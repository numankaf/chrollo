import { getMainWindow } from '@/main/index';
import logger from '@/main/lib/logger';
import { chrolloEngine } from '@/main/scripts/engine';
import type { StompMessageCtx } from '@/main/scripts/runtime/stomp-runtime';
import { stripAllWhitespace } from '@/main/utils/common-util';
import { CONTENT_TYPE_MAP, isJsonContentType } from '@/main/utils/message-util';
import { resolveJsonPayload, resolveVariables } from '@/main/utils/variable-resolver-util';
import { Client, type IFrame, type Message } from '@stomp/stompjs';
import { ipcMain } from 'electron';
import SockJS from 'sockjs-client';

import { REQUEST_BODY_TYPE, type Request } from '@/types/collection';
import {
  CONNECTION_STATUS,
  CONNECTION_TYPE,
  WS_URL_SCHEME,
  type ConnectionStatus,
  type ConnectionStatusData,
  type StompConnection,
} from '@/types/connection';
import type { RequestResolvedEvent } from '@/types/request-response';
import { SOCKET_MESSAGE_TYPE, type SocketMessage } from '@/types/socket';

let seq = 0;
const nextSeq = () => ++seq;

const stompClients: Record<string, Client> = {};
const connectionWorkspaceMap: Record<string, string> = {};

function subscribeInternal(connectionId: string, subscriptionId: string, topic: string) {
  const mainWindow = getMainWindow();
  const client = stompClients[connectionId];
  if (!mainWindow) return;
  if (client && client.connected && client.active) {
    client.subscribe(
      topic.trim(),
      async (msg: Message) => {
        await chrolloEngine.executeWithContext(connectionWorkspaceMap[connectionId], () => {
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

          runtime.request.beginMessageContext(socketReceivedMessage);
          runtime.stomp.runMessage(ctx);

          // Check if any requests were resolved during message handlers
          const resolvedRequests = runtime.request.consumeResolvedRequests();

          // restoreLocal temporarily replaces the shared localStore for each resolved
          // request's post-response script. This is safe because executeWithContext
          // serializes all callbacks — no two scripts run concurrently.
          for (const resolved of resolvedRequests) {
            runtime.variables.restoreLocal(resolved.locals);
            runtime.test.beginContext();
            if (resolved.request.scripts?.postResponse) {
              chrolloEngine.loadScript(resolved.request.scripts.postResponse);
            }

            const event: RequestResolvedEvent = {
              requestKey: resolved.requestKey,
              response: resolved.message,
              testResults: runtime.test.getResults(),
              timestamp: Date.now(),
            };
            mainWindow.webContents.send('stomp:request-resolved', event);
          }

          runtime.request.endMessageContext();

          mainWindow.webContents.send('stomp:message', socketReceivedMessage);

          try {
            const data = isJsonContentType(msg.headers) ? JSON.parse(msg.body) : msg.body;
            logger.info(data);
          } catch {
            logger.info(msg.body);
          }
        });
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
    await chrolloEngine.executeWithContext(connection.workspaceId, () => {
      const runtime = chrolloEngine.getRuntime();

      const ctx = { connection };
      runtime.stomp.runPreConnect(ctx);
    });

    const { id, name, prefix, url, connectHeaders, subscriptions } = connection;
    connectionWorkspaceMap[id] = connection.workspaceId;
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
    client.onConnect = (frame) => {
      lastStompStatus = CONNECTION_STATUS.CONNECTED;
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
  ipcMain.on('stomp:subscribe', async (_, data: { connectionId: string; subscriptionId: string; topic: string }) => {
    const { connectionId, subscriptionId, topic } = data;

    await chrolloEngine.executeWithContext(connectionWorkspaceMap[connectionId], () => {
      const runtime = chrolloEngine.getRuntime();
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
  });

  // ------------------------------
  // UNSUBSCRIBE
  // ------------------------------
  ipcMain.on('stomp:unsubscribe', async (_, data: { connectionId: string; subscriptionId: string; topic: string }) => {
    const { connectionId, subscriptionId, topic } = data;

    await chrolloEngine.executeWithContext(connectionWorkspaceMap[connectionId], () => {
      const runtime = chrolloEngine.getRuntime();

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
  });

  // ------------------------------
  // SEND
  // ------------------------------
  ipcMain.on('stomp:send', async (_, id: string, request: Request) => {
    await chrolloEngine.executeWithContext(connectionWorkspaceMap[id], () => {
      const runtime = chrolloEngine.getRuntime();
      const mainWindow = getMainWindow();

      runtime.request.beginSendContext(id, request);

      const ctx = { connectionId: id, request };
      runtime.stomp.runPreSend(ctx);

      // Run request's pre-request script
      if (request.scripts?.preRequest) {
        chrolloEngine.loadScript(request.scripts.preRequest);
      }

      const { body, destination, headers } = request;
      const payload =
        body.type === REQUEST_BODY_TYPE.JSON ? resolveJsonPayload(body.data) : resolveVariables(body.data);

      // Snapshot locals after the full pre-request script has run so every
      // local set during the script (including after setRequestKey) is captured.
      runtime.request.endSendContext(runtime.variables.snapshotLocal());

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
  });

  // ------------------------------
  // DISCONNECT
  // ------------------------------
  ipcMain.on('stomp:disconnect', async (_, id: string) => {
    const client = stompClients[id];
    if (client) {
      await client.deactivate();
      delete stompClients[id];
      delete connectionWorkspaceMap[id];
      logger.info(`Disconnected STOMP (${id})`);
    }
    const runtime = chrolloEngine.getRuntime();
    runtime.request.clearPendingRequests();
    mainWindow.webContents.send('stomp:status', {
      connectionId: id,
      status: CONNECTION_STATUS.DISCONNECTED,
      timestamp: Date.now(),
    } as ConnectionStatusData);
  });

  // ------------------------------
  // DISCONNECT ALL
  // ------------------------------
  ipcMain.on('stomp:disconnectAll', async () => {
    await Promise.all(
      Object.entries(stompClients).map(async ([id, client]) => {
        await client.deactivate();
        delete stompClients[id];
        delete connectionWorkspaceMap[id];
      })
    );
    const runtime = chrolloEngine.getRuntime();
    runtime.request.clearPendingRequests();
    logger.info('All STOMP connections closed');
  });
}
