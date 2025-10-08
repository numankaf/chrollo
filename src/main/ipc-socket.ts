import { Client, type Message } from '@stomp/stompjs';
import { ipcMain } from 'electron';
import SockJS from 'sockjs-client';
import { getMainWindow } from './index';

let stompClient: Client | null = null;

export function initStompIpc() {
  const mainWindow = getMainWindow();

  if (!mainWindow) return;

  ipcMain.on('stomp:connect', (_, url: string) => {
    if (stompClient) stompClient.deactivate();

    stompClient = new Client({
      webSocketFactory: () => new SockJS(url),
      reconnectDelay: 5000,
      debug: (msg) => {
        console.log(msg);
        mainWindow.webContents.send('console-log', msg);
      },
    });

    stompClient.onStompError = (frame) => {
      console.error('❌ STOMP Error', frame.headers['message']);
      mainWindow.webContents.send('console-log', `❌ STOMP Error ${frame.headers['message']}`);
    };

    stompClient.activate();
  });

  ipcMain.on('stomp:subscribe', (_, topic: string) => {
    if (stompClient && stompClient.connected && stompClient.active)
      stompClient.subscribe(topic, (msg: Message) => {
        console.log('📩 Received:', msg.body);
      });
  });

  ipcMain.on('stomp:unsubscribe', (_, topic: string) => {
    if (stompClient) {
      stompClient?.unsubscribe(topic);
    }
  });

  ipcMain.on('stomp:disconnect', (_) => {
    if (stompClient) {
      stompClient?.deactivate();
    }
  });

  ipcMain.on('stomp:send', (_, data: { destination: string; body: string; headers?: any }) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: data.destination,
        body: data.body,
        headers: data.headers,
      });
      mainWindow.webContents.send('console-log', `📤 Message sent: ${data.body}`);
    } else {
      mainWindow.webContents.send('console-log', '❌ STOMP not connected');
    }
  });
}
