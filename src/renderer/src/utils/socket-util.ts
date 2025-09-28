import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const openStompSocket = (url: string) => {
  const stompClient = new Client({
    webSocketFactory: () => new SockJS(url),
    reconnectDelay: 5000,
    
    debug: (msg) => console.log(msg),
  });

  stompClient.onConnect = (frame) => {
    console.log('✅ Connected:', frame);

    stompClient.subscribe('/topic/scope-bsi-command', (message) => {
      console.log('📩 Received:', message.body);
    });
    stompClient.subscribe('/topic/scope-bsi-event', (message) => {
      console.log('📩 Received:', message.body);
    });
  };

  stompClient.onStompError = (frame) => {
    console.error('❌ Broker reported error:', frame.headers['message']);
    console.error('❌ Additional details:', frame.body);
  };

  stompClient.onWebSocketClose = (event) => {
    console.log('🔌 WebSocket closed', event);
  };

  stompClient.activate();

  return stompClient;
};
