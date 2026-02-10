import { getMainWindow } from '@/main/index';
import logger from '@/main/lib/logger';
import { chrolloEngine } from '@/main/scripts/engine';
import type { StompMessageCtx } from '@/main/scripts/runtime/stomp-runtime';
import { stripAllWhitespace } from '@/main/utils/common-util';
import { CONTENT_TYPE_MAP, isJsonContentType } from '@/main/utils/message-util';
import { Client, type IFrame, type Message } from '@stomp/stompjs';
import { ipcMain } from 'electron';
import SockJS from 'sockjs-client';

import { type Request } from '@/types/collection';
import { ENVIRONMENT_VARIABLE_CAPTURE_REGEX, ENVIRONMENT_VARIABLE_MATCH_REGEX } from '@/types/common';
import {
  CONNECTION_STATUS,
  CONNECTION_TYPE,
  WS_URL_SCHEME,
  type ConnectionStatus,
  type ConnectionStatusData,
  type StompConnection,
} from '@/types/connection';
import { SOCKET_MESSAGE_TYPE, type SocketMessage } from '@/types/socket';

let seq = 0;
const nextSeq = () => ++seq;

const stompClients: Record<string, Client> = {};

function subscribeInternal(connectionId: string, subscriptionId: string, topic: string) {
  const mainWindow = getMainWindow();
  const client = stompClients[connectionId];
  if (!mainWindow) return;
  if (client && client.connected && client.active) {
    client.subscribe(
      topic.trim(),
      (msg: Message) => {
        const socketReceivedMessage: SocketMessage = {
          id: nextSeq(),
          connectionId,
          connectionType: CONNECTION_TYPE.STOMP,
          type: SOCKET_MESSAGE_TYPE.RECEIVED,
          timestamp: Date.now(),
          data: msg.body,
          meta: {
            command: msg.command,
            headers: msg.headers,
            isBinaryBody: msg.isBinaryBody,
            binaryBody: msg.binaryBody,
          },
        };

        const runtime = chrolloEngine.getRuntime();
        const ctx: StompMessageCtx = { message: socketReceivedMessage };

        // Set message context so resolveRequestKey works in user scripts
        runtime.request.beginMessageContext(socketReceivedMessage);
        runtime.stomp.runMessage(ctx);
        runtime.request.endMessageContext();

        mainWindow.webContents.send('stomp:message', socketReceivedMessage);

        const data = isJsonContentType(msg.headers) ? JSON.parse(msg.body) : msg.body;

        logger.info(data);
      },
      { id: subscriptionId }
    );
  }

  const socketSubscribedMessage: SocketMessage = {
    id: nextSeq(),
    connectionId,
    connectionType: CONNECTION_TYPE.STOMP,
    type: SOCKET_MESSAGE_TYPE.SUBSCRIBED,
    timestamp: Date.now(),
    data: `Subscribed to ${topic}`,
    meta: {
      headers: { id: subscriptionId, destination: topic.trim() },
    },
  };

  mainWindow.webContents.send('stomp:message', socketSubscribedMessage);
}

function unSubscribeInternal(connectionId: string, subscriptionId: string, topic: string) {
  const mainWindow = getMainWindow();
  const client = stompClients[connectionId];
  if (!mainWindow) return;
  if (client && client.connected && client.active) {
    client.unsubscribe(subscriptionId);
    const socketUnsubscribedMessage: SocketMessage = {
      id: nextSeq(),
      connectionId: connectionId,
      connectionType: CONNECTION_TYPE.STOMP,
      type: SOCKET_MESSAGE_TYPE.UNSUBSCRIBED,
      timestamp: Date.now(),
      data: `Unsubscribed from ${topic}`,
      meta: {
        headers: { id: subscriptionId },
      },
    };

    mainWindow.webContents.send('stomp:message', socketUnsubscribedMessage);
  }
}

export function initStompIpc() {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;

  const runtime = chrolloEngine.getRuntime();
  runtime.stomp.onError((err, hook) => {
    mainWindow.webContents.send('console:error', `[Script Runtime Error: ${hook}] ${err.message}`);
  });

  // ------------------------------
  // CONNECT
  // ------------------------------
  ipcMain.on('stomp:connect', async (_, connection: StompConnection) => {
    const runtime = chrolloEngine.getRuntime();

    const ctx = { connection };
    runtime.stomp.runPreConnect(ctx);

    const { id, name, prefix, url, connectHeaders, subscriptions } = connection;
    if (stompClients[id]) {
      await stompClients[id].deactivate();
      delete stompClients[id];
    }

    const headers = connectHeaders
      .filter((h) => h.enabled)
      .reduce((acc, h) => ({ ...acc, [h.key]: h.value.trim() }), {});

    const connectionUrl = stripAllWhitespace(prefix + url);

    let socketFactory: () => WebSocket | InstanceType<typeof SockJS>;
    switch (prefix) {
      case WS_URL_SCHEME.WS:
      case WS_URL_SCHEME.WSS:
        socketFactory = () => new WebSocket(connectionUrl);
        break;

      case WS_URL_SCHEME.HTTP:
      case WS_URL_SCHEME.HTTPS:
        socketFactory = () => new SockJS(connectionUrl);
        break;

      //FALLBACK: Normally this should never happen
      default:
        mainWindow.webContents.send('console:error', `Unsupported URL scheme: ${prefix}`);
        return;
    }
    const client = new Client({
      webSocketFactory: socketFactory,
      ...connection.settings,
      connectHeaders: headers,
      debug: (msg) => {
        logger.info(`[${id}] [${name}] ${msg}`);
      },
    });

    let lastStompStatus: ConnectionStatus | null = null;
    lastStompStatus = CONNECTION_STATUS.CONNECTED;
    client.onConnect = (frame) => {
      mainWindow.webContents.send('stomp:status', {
        connectionId: id,
        status: lastStompStatus,
        timestamp: Date.now(),
      } as ConnectionStatusData);
      const socketConnectedMessage: SocketMessage = {
        id: nextSeq(),
        connectionId: id,
        connectionType: CONNECTION_TYPE.STOMP,
        type: SOCKET_MESSAGE_TYPE.CONNECTED,
        timestamp: Date.now(),
        data: `Connected to ${connectionUrl}`,
        meta: {
          command: frame.command,
          headers: { ...frame.headers, ...headers },
        },
      };

      mainWindow.webContents.send('stomp:message', socketConnectedMessage);

      // ------------------------------
      // ADD ENABLED SUBSCRIBTIONS
      // ------------------------------
      for (const subscription of subscriptions) {
        if (subscription.enabled) {
          const ctx = {
            connectionId: id,
            subscriptionId: subscription.id,
            topic: subscription.topic,
            subscribe: subscribeInternal,
          };
          const { defaultDisabled } = runtime.stomp.runPreSubscribe(ctx);
          if (!defaultDisabled) {
            subscribeInternal(id, subscription.id, subscription.topic);
          }
        }
      }
    };

    client.onDisconnect = (frame) => {
      lastStompStatus = CONNECTION_STATUS.DISCONNECTED;
      mainWindow.webContents.send('stomp:status', {
        connectionId: id,
        status: lastStompStatus,
        timestamp: Date.now(),
      } as ConnectionStatusData);
      const socketDisconnectedMessage: SocketMessage = {
        id: nextSeq(),
        connectionId: id,
        connectionType: CONNECTION_TYPE.STOMP,
        type: SOCKET_MESSAGE_TYPE.DISCONNECTED,
        timestamp: Date.now(),
        data: `Disconnected from ${connectionUrl}`,
        meta: {
          command: frame.command,
          headers: frame.headers,
        },
      };

      mainWindow.webContents.send('stomp:message', socketDisconnectedMessage);
    };

    client.onStompError = (frame: IFrame) => {
      logger.info(`STOMP Error (${id}: ${name}): ${frame.headers['message']}`);

      const socketStompErrorMessage: SocketMessage = {
        id: nextSeq(),
        connectionId: id,
        connectionType: CONNECTION_TYPE.STOMP,
        type: SOCKET_MESSAGE_TYPE.ERROR,
        timestamp: Date.now(),
        data: `ERROR: ${frame.headers['message']}`,
        meta: {
          command: frame.command,
          headers: frame.headers,
        },
      };

      mainWindow.webContents.send('stomp:message', socketStompErrorMessage);
    };

    client.onWebSocketClose = (frame) => {
      const socketStompErrorMessage: SocketMessage = {
        id: nextSeq(),
        connectionId: id,
        connectionType: CONNECTION_TYPE.STOMP,
        type: SOCKET_MESSAGE_TYPE.EVENT,
        timestamp: Date.now(),
        data: `${JSON.stringify(frame)}`,
      };

      mainWindow.webContents.send('stomp:message', socketStompErrorMessage);
      if (lastStompStatus !== CONNECTION_STATUS.DISCONNECTED) {
        mainWindow.webContents.send('stomp:status', {
          connectionId: id,
          status: CONNECTION_STATUS.CLOSED,
          timestamp: Date.now(),
        } as ConnectionStatusData);
      }
    };
    client.activate();
    stompClients[id] = client;
  });

  // ------------------------------
  // SUBSCRIBE
  // ------------------------------
  ipcMain.on('stomp:subscribe', (_, data: { connectionId: string; subscriptionId: string; topic: string }) => {
    const runtime = chrolloEngine.getRuntime();
    const { connectionId, subscriptionId, topic } = data;
    const ctx = {
      connectionId,
      subscriptionId,
      topic,
      subscribe: subscribeInternal,
    };
    const { defaultDisabled } = runtime.stomp.runPreSubscribe(ctx);
    if (defaultDisabled) return;
    subscribeInternal(connectionId, subscriptionId, topic);
  });

  // ------------------------------
  // UNSUBSCRIBE
  // ------------------------------
  ipcMain.on('stomp:unsubscribe', (_, data: { connectionId: string; subscriptionId: string; topic: string }) => {
    const runtime = chrolloEngine.getRuntime();

    const { connectionId, subscriptionId, topic } = data;
    const ctx = {
      connectionId,
      subscriptionId,
      topic,
      unsubscribe: unSubscribeInternal,
    };
    const { defaultDisabled } = runtime.stomp.runPreUnsubscribe(ctx);
    if (defaultDisabled) return;
    unSubscribeInternal(connectionId, subscriptionId, topic);
  });

  // ------------------------------
  // SEND
  // ------------------------------
  ipcMain.on('stomp:send', (_, id: string, request: Request) => {
    const runtime = chrolloEngine.getRuntime();
    const mainWindow = getMainWindow();

    runtime.request.beginSendContext(id, request);

    const ctx = { connectionId: id, request };
    runtime.stomp.runPreSend(ctx);

    // Run request's pre-request script
    if (request.scripts?.preRequest) {
      chrolloEngine.loadScript(request.scripts.preRequest);
    }

    const allVariables = runtime.variables.all();
    const { body, destination, headers } = request;
    let payload = body.data;

    // Resolve variables in payload
    payload = payload.replace(ENVIRONMENT_VARIABLE_MATCH_REGEX, (match) => {
      const capture = ENVIRONMENT_VARIABLE_CAPTURE_REGEX.exec(match);
      if (!capture) return match;
      const key = capture[1];
      const val = allVariables[key];

      if (val === undefined) return match;

      if (typeof val === 'object') {
        return JSON.stringify(val);
      }
      return String(val);
    });

    runtime.request.endSendContext();

    const client = stompClients[id];

    const requestHeaders = headers.filter((h) => h.enabled).reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});
    if (client && client.connected) {
      client.publish({
        destination: destination.trim(),
        body: payload,
        headers: requestHeaders,
      });
      const socketSentMessage: SocketMessage = {
        id: nextSeq(),
        connectionId: id,
        connectionType: CONNECTION_TYPE.STOMP,
        type: SOCKET_MESSAGE_TYPE.SENT,
        timestamp: Date.now(),
        data: payload,
        meta: {
          command: 'SEND',
          headers: {
            destination,
            ...requestHeaders,
            'content-length': String(payload.length),
            'content-type': CONTENT_TYPE_MAP[request.body.type],
          },
        },
      };
      if (mainWindow) {
        mainWindow.webContents.send('stomp:message', socketSentMessage);
      }
    } else {
      logger.info(` STOMP (${id}) not connected`);
    }
  });

  // ------------------------------
  // DISCONNECT
  // ------------------------------
  ipcMain.on('stomp:disconnect', async (_, id: string) => {
    const client = stompClients[id];
    if (client) {
      await client.deactivate();
      delete stompClients[id];
      logger.info(`Disconnected STOMP (${id})`);
    }
    mainWindow.webContents.send('stomp:status', {
      connectionId: id,
      status: CONNECTION_STATUS.DISCONNECTED,
      timestamp: Date.now(),
    } as ConnectionStatusData);
  });

  // ------------------------------
  // DISCONNECT ALL
  // ------------------------------
  ipcMain.on('stomp:disconnectAll', () => {
    Object.entries(stompClients).forEach(async ([id, client]) => {
      await client.deactivate();
      delete stompClients[id];
    });
    logger.info(`All STOMP connections closed`);
  });
}
