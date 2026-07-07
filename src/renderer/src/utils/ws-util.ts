import type { WebSocketConnection } from '@/types/connection';

export function connectWebSocket(connection: WebSocketConnection) {
  window.api.ws.connect(connection);
}

export function disconnectWebSocket(connectionId: string) {
  window.api.ws.disconnect(connectionId);
}

export function sendWebSocketMessage(connectionId: string, data: string) {
  window.api.ws.send(connectionId, data);
}
