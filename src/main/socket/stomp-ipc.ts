import { getMainWindow } from '@/main/index';
import { chrolloEngine } from '@/main/scripts/engine';
import { stripAllWhitespace } from '@/main/utils/common-util';
import { CONTENT_TYPE_MAP, isJsonContentType } from '@/main/utils/message-util';
import { Client, type IFrame, type Message } from '@stomp/stompjs';
import { ipcMain } from 'electron';
import SockJS from 'sockjs-client';

import { type Request } from '@/types/collection';
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

chrolloEngine.load(`
    chrollo.stomp.onPreConnect(({ connection }) => {
      const clientSessionId = chrollo.utils.randomId();
      const key = 'clientSessionId' + '-' + connection.id;
      chrollo.variables.set(key, clientSessionId);
      connection.connectHeaders.push({
          id: chrollo.utils.randomId(),
          key: '_clientSessionId',
          value: clientSessionId,
          enabled: true,
      }) 
    });

    chrollo.stomp.onPreSubscribe(({ connectionId, subscriptionId, topic, subscribe, disableDefault }) => {
      disableDefault();
      const key = 'clientSessionId' + '-' + connectionId;
      const clientSessionId = chrollo.variables.get(key);
    
      const broadcastId = subscriptionId + '-broadcast';  
      const broadcastTopic = '/topic/' + topic + "/broadcast/";
      subscribe(connectionId, broadcastId, broadcastTopic);

      const clientBroadcastId = subscriptionId + '-client-broadcast';  
      const clientBroadcastTopic = '/topic/' + topic + "/" + clientSessionId + "/broadcast/";
      subscribe(connectionId, clientBroadcastId, clientBroadcastTopic);

      const clientId = subscriptionId + '-client';  
      const clientTopic = '/topic/' + topic + "/" + clientSessionId;
      subscribe(connectionId, clientId, clientTopic);
    });

    chrollo.stomp.onPreUnsubscribe(({ connectionId, subscriptionId, topic, unsubscribe, disableDefault }) => {
      disableDefault();
      const key = 'clientSessionId' + '-' + connectionId;
      const clientSessionId = chrollo.variables.get(key);
    
      const broadcastId = subscriptionId + '-broadcast';  
      const broadcastTopic = '/topic/' + topic + "/broadcast/";
      unsubscribe(connectionId, broadcastId, broadcastTopic);

      const clientBroadcastId = subscriptionId + '-client-broadcast';  
      const clientBroadcastTopic = '/topic/' + topic + "/" + clientSessionId + "/broadcast/";
      unsubscribe(connectionId, clientBroadcastId, clientBroadcastTopic);

      const clientId = subscriptionId + '-client';  
      const clientTopic = '/topic/' + topic + "/" + clientSessionId;
      unsubscribe(connectionId, clientId, clientTopic);
    });

    chrollo.stomp.onPreSend(({ connectionId, request }) => {
      const key = 'clientSessionId' + '-' + connectionId;
      const clientSessionId = chrollo.variables.get(key);
      const requestId = chrollo.utils.randomId();
      request.destination = '/app/secure/' + requestId + '/' + request.destination;
      request.headers.push({
          id: chrollo.utils.randomId(),
          key: 'clientSessionId',
          value: clientSessionId,
          enabled: true,
      })
    });
`);

const runtime = chrolloEngine.getRuntime();

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

        mainWindow.webContents.send('stomp:message', socketReceivedMessage);

        const data = isJsonContentType(msg.headers) ? JSON.parse(msg.body) : msg.body;

        mainWindow.webContents.send('console:log', data);
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

  // ------------------------------
  // CONNECT
  // ------------------------------
  ipcMain.on('stomp:connect', async (_, connection: StompConnection) => {
    const ctx = { connection };
    runtime.stomp.runPreConnect(ctx);

    const { id, name, prefix, url, connectHeaders, subscriptions } = connection;
    if (stompClients[id]) {
      stompClients[id].deactivate();
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
        mainWindow.webContents.send('console:log', `[${id}] [${name}] ${msg}`);
      },
    });

    let lastStompStatus: ConnectionStatus | null = null;
    lastStompStatus = CONNECTION_STATUS.CONNECTED;
    client.onConnect = () => {
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

    client.onDisconnect = () => {
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
      };

      mainWindow.webContents.send('stomp:message', socketDisconnectedMessage);
    };

    client.onStompError = (frame: IFrame) => {
      mainWindow.webContents.send('console:log', `STOMP Error (${id}: ${name}): ${frame.headers['message']}`);

      const socketStompErrorMessage: SocketMessage = {
        id: nextSeq(),
        connectionId: id,
        connectionType: CONNECTION_TYPE.STOMP,
        type: SOCKET_MESSAGE_TYPE.ERROR,
        timestamp: Date.now(),
        data: `ERROR: ${frame.headers['message']}`,
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
    const ctx = { connectionId: id, request };
    runtime.stomp.runPreSend(ctx);
    const client = stompClients[id];
    const { body, destination, headers } = request;
    const payload = body.data;

    const requestHeaders = headers.filter((h) => h.enabled).reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});
    if (client && client.connected) {
      client.publish({
        destination: destination.trim(),
        body: payload,
        headers: requestHeaders,
      });
      mainWindow.webContents.send('console:log', ` [${id}] Message sent: ${body}`);
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
      mainWindow.webContents.send('stomp:message', socketSentMessage);
    } else {
      mainWindow.webContents.send('console:log', ` STOMP (${id}) not connected`);
    }
  });

  // ------------------------------
  // DISCONNECT
  // ------------------------------
  ipcMain.on('stomp:disconnect', (_, id: string) => {
    const client = stompClients[id];
    if (client) {
      client.deactivate();
      delete stompClients[id];
      mainWindow.webContents.send('stomp:status', {
        connectionId: id,
        status: CONNECTION_STATUS.DISCONNECTED,
        timestamp: Date.now(),
      } as ConnectionStatusData);
      mainWindow.webContents.send('console:log', `Disconnected STOMP (${id})`);
    }
  });

  // ------------------------------
  // DISCONNECT ALL
  // ------------------------------
  ipcMain.on('stomp:disconnectAll', () => {
    Object.entries(stompClients).forEach(([id, client]) => {
      client.deactivate();
      delete stompClients[id];
    });
    mainWindow.webContents.send('console:log', `All STOMP connections closed`);
  });
}
