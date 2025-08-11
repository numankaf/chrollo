import { Client } from '@stomp/stompjs';
import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';

function App() {
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
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
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
      console.log('🔌 STOMP client deactivated');
    };
  }, []);

  const sendMessage = (message: string) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: '/app/topic/scope-bsi-command/545445', // adjust to your server endpoint
        body: message,
        // headers: { /* any headers if needed */ },
      });
      console.log('Message sent:', message);
    } else {
      console.error('WebSocket not connected');
    }
  };
  return (
    <div>
      <button
        className="bg-red-500 p-3 rounded-md cursor-pointer"
        onClick={() => sendMessage('Some Bsi Message')}
      >
        Send Bsi Message
      </button>
    </div>
  );
}

export default App;
