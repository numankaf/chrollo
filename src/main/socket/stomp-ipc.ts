import { getMainWindow } from '@/main/index';
import { Client, type Message } from '@stomp/stompjs';
import { ipcMain } from 'electron';
import SockJS from 'sockjs-client';

import { REQUEST_BODY_TYPE, type Request } from '@/types/collection';
import {
  CONNECTION_STATUS,
  WS_URL_SCHEME,
  type ConnectionStatus,
  type ConnectionStatusData,
  type StompConnection,
} from '@/types/connection';

const stompClients: Record<string, Client> = {};

export function initStompIpc() {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;

  // ------------------------------
  // CONNECT
  // ------------------------------
  ipcMain.on('stomp:connect', async (_, connection: StompConnection) => {
    const { id, name, connectHeaders, subscriptions } = connection;

    if (stompClients[id]) {
      stompClients[id].deactivate();
      delete stompClients[id];
    }

    const headers = connectHeaders.filter((h) => h.enabled).reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});

    const prefix = connection.prefix;
    let socketFactory: () => WebSocket | InstanceType<typeof SockJS>;
    switch (prefix) {
      case WS_URL_SCHEME.WS:
      case WS_URL_SCHEME.WSS:
        socketFactory = () => new WebSocket(prefix + connection.url);
        break;

      case WS_URL_SCHEME.HTTP:
      case WS_URL_SCHEME.HTTPS:
        socketFactory = () => new SockJS(prefix + connection.url);
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

      // ------------------------------
      // ADD ENABLED SUBSCRIBTIONS
      // ------------------------------
      for (const subscription of subscriptions) {
        if (subscription.enabled) {
          client.subscribe(subscription.topic, (msg: Message) => {
            mainWindow.webContents.send('stomp:message', {
              connectionId: subscription.id,
              topic: subscription.topic,
              body: msg.body,
            });
          });
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
    }
  });

  // ------------------------------
  // UNSUBSCRIBE
  // ------------------------------
  ipcMain.on('stomp:unsubscribe', (_, data: { id: string; topic: string }) => {
    const client = stompClients[data.id];
    if (client) {
      client.unsubscribe(data.topic);
    }
  });

  // ------------------------------
  // SEND
  // ------------------------------
  ipcMain.on('stomp:send', (_, id: string, request: Request) => {
    const client = stompClients[id];
    const { body, destination, headers } = request;
    let payload = body.data;

    if (body.type === REQUEST_BODY_TYPE.JSON) {
      payload = JSON.stringify(payload);
    }
    const requestHeaders = headers.filter((h) => h.enabled).reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});

    if (client && client.connected) {
      client.publish({
        destination: destination,
        body: payload,
        headers: requestHeaders,
      });
      mainWindow.webContents.send('console:log', ` [${id}] Message sent: ${body}`);
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
      mainWindow.webContents.send('stomp:status', {
        connectionId: id,
        status: CONNECTION_STATUS.DISCONNECTED,
        timestamp: Date.now(),
      } as ConnectionStatusData);
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
