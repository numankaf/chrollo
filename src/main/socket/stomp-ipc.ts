import { getMainWindow } from '@/main/index';
import { Client, StompHeaders, type Message } from '@stomp/stompjs';
import { ipcMain } from 'electron';
import SockJS from 'sockjs-client';

import { CONNECTION_STATUS, type ConnectionStatusData, type StompConnection } from '@/types/connection';

const stompClients: Record<string, Client> = {};

export function initStompIpc() {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;

  // ------------------------------
  // CONNECT
  // ------------------------------
  ipcMain.on('stomp:connect', async (_, connection: StompConnection) => {
    const { id } = connection;

    if (stompClients[id]) {
      stompClients[id].deactivate();
      delete stompClients[id];
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(connection.prefix + connection.url),
      ...connection.settings,
      debug: (msg) => {
        mainWindow.webContents.send('console:log', msg);
      },
    });

    mainWindow.webContents.send('stomp:status', {
      connectionId: id,
      status: CONNECTION_STATUS.CONNECTING,
      timestamp: Date.now(),
    } as ConnectionStatusData);

    client.onConnect = () => {
      mainWindow.webContents.send('stomp:status', {
        connectionId: id,
        status: CONNECTION_STATUS.CONNECTED,
        timestamp: Date.now(),
      } as ConnectionStatusData);
    };
    client.onDisconnect = () => {
      mainWindow.webContents.send('stomp:status', {
        connectionId: id,
        status: CONNECTION_STATUS.DISCONNECTED,
        timestamp: Date.now(),
      } as ConnectionStatusData);
    };

    client.onWebSocketClose = () => {
      mainWindow.webContents.send('stomp:status', {
        connectionId: id,
        status: CONNECTION_STATUS.CLOSED,
        timestamp: Date.now(),
      } as ConnectionStatusData);
    };

    client.onStompError = (frame) => {
      const errorMsg = `STOMP Error (${id}): ${frame.headers['message']}`;
      mainWindow.webContents.send('console:log', errorMsg);
      mainWindow.webContents.send('stomp:status', {
        connectionId: id,
        status: CONNECTION_STATUS.ERROR,
        timestamp: Date.now(),
      } as ConnectionStatusData);
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
  ipcMain.on('stomp:send', (_, data: { id: string; destination: string; body: string; headers?: StompHeaders }) => {
    const client = stompClients[data.id];
    if (client && client.connected) {
      client.publish({
        destination: data.destination,
        body: data.body,
        headers: data.headers,
      });
      mainWindow.webContents.send('console:log', ` [${data.id}] Message sent: ${data.body}`);
    } else {
      mainWindow.webContents.send('console:log', ` STOMP (${data.id}) not connected`);
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
