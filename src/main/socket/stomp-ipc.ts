import { getMainWindow } from '@/main/index';
import { isJsonContentType } from '@/main/utils/message-util';
import { Client, type Message } from '@stomp/stompjs';
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

const stompClients: Record<string, Client> = {};

export function initStompIpc() {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;

  // ------------------------------
  // CONNECT
  // ------------------------------
  ipcMain.on('stomp:connect', async (_, connection: StompConnection) => {
    const { id, name, prefix, url, connectHeaders, subscriptions } = connection;

    if (stompClients[id]) {
      stompClients[id].deactivate();
      delete stompClients[id];
    }

    const headers = connectHeaders.filter((h) => h.enabled).reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});

    const connectionUrl = prefix + url;

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
        mainWindow.webContents.send('console:log', msg);
      },
    });

    let lastStompStatus: ConnectionStatus | null = null;
    client.onConnect = () => {
      lastStompStatus = CONNECTION_STATUS.CONNECTED;
      mainWindow.webContents.send('stomp:status', {
        connectionId: id,
        status: lastStompStatus,
        timestamp: Date.now(),
      } as ConnectionStatusData);
      const socketConnectedMessage: SocketMessage = {
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
          client.subscribe(subscription.topic, (msg: Message) => {
            const socketReceivedMessage: SocketMessage = {
              connectionId: id,
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
          });
          const socketSubscribedMessage: SocketMessage = {
            connectionId: id,
            connectionType: CONNECTION_TYPE.STOMP,
            type: SOCKET_MESSAGE_TYPE.SUBSCRIBED,
            timestamp: Date.now(),
            data: `Subscribed to ${subscription.topic}`,
          };

          mainWindow.webContents.send('stomp:message', socketSubscribedMessage);
        }
      }
    };

    client.onChangeState = (state) => {
      if (
        state === 2 &&
        lastStompStatus !== CONNECTION_STATUS.DISCONNECTED &&
        lastStompStatus !== CONNECTION_STATUS.ERROR
      ) {
        lastStompStatus = CONNECTION_STATUS.DEACTIVATED;
        mainWindow.webContents.send('stomp:status', {
          connectionId: id,
          status: lastStompStatus,
          timestamp: Date.now(),
        } as ConnectionStatusData);
        mainWindow.webContents.send('console:log', `Deactivated (${id} : ${name})`);
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
        connectionId: id,
        connectionType: CONNECTION_TYPE.STOMP,
        type: SOCKET_MESSAGE_TYPE.DISCONNECTED,
        timestamp: Date.now(),
        data: `Disconnected from ${connectionUrl}`,
      };

      mainWindow.webContents.send('stomp:message', socketDisconnectedMessage);
    };

    client.onStompError = (frame) => {
      lastStompStatus = CONNECTION_STATUS.ERROR;
      mainWindow.webContents.send('console:log', `STOMP Error (${id}: ${name}): ${frame.headers['message']}`);
      mainWindow.webContents.send('stomp:status', {
        connectionId: id,
        status: lastStompStatus,
        timestamp: Date.now(),
      } as ConnectionStatusData);
    };

    client.onWebSocketClose = () => {
      if (lastStompStatus !== CONNECTION_STATUS.DISCONNECTED && lastStompStatus !== CONNECTION_STATUS.ERROR) {
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
  ipcMain.on('stomp:subscribe', (_, data: { id: string; topic: string }) => {
    const client = stompClients[data.id];
    if (client && client.connected && client.active) {
      client.subscribe(data.topic, (msg: Message) => {
        mainWindow.webContents.send('stomp:message', {
          connectionId: data.id,
          topic: data.topic,
          body: msg.body,
        });
      });
      const socketSubscribedMessage: SocketMessage = {
        connectionId: data.id,
        connectionType: CONNECTION_TYPE.STOMP,
        type: SOCKET_MESSAGE_TYPE.SUBSCRIBED,
        timestamp: Date.now(),
        data: `Subscribed to ${data.topic}`,
      };

      mainWindow.webContents.send('stomp:message', socketSubscribedMessage);
    }
  });

  // ------------------------------
  // UNSUBSCRIBE
  // ------------------------------
  ipcMain.on('stomp:unsubscribe', (_, data: { id: string; topic: string }) => {
    const client = stompClients[data.id];
    if (client) {
      client.unsubscribe(data.topic);
      const socketUnsubscribedMessage: SocketMessage = {
        connectionId: data.id,
        connectionType: CONNECTION_TYPE.STOMP,
        type: SOCKET_MESSAGE_TYPE.UNSUBSCRIBED,
        timestamp: Date.now(),
        data: `Unsubscribed from ${data.topic}`,
      };

      mainWindow.webContents.send('stomp:message', socketUnsubscribedMessage);
    }
  });

  // ------------------------------
  // SEND
  // ------------------------------
  ipcMain.on('stomp:send', (_, id: string, request: Request) => {
    const client = stompClients[id];
    const { body, destination, headers } = request;
    const payload = body.data;

    const requestHeaders = headers.filter((h) => h.enabled).reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});

    if (client && client.connected) {
      client.publish({
        destination: destination,
        body: payload,
        headers: requestHeaders,
      });
      mainWindow.webContents.send('console:log', ` [${id}] Message sent: ${body}`);
      const socketSentMessage: SocketMessage = {
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
