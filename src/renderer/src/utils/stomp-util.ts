import type { Request } from '@/types/collection';
import type { StompConnection } from '@/types/connection';

export function connectStomp(connection: StompConnection) {
  window.api.stomp.connect(connection);
}

export function disconnectStomp(connectionId: string) {
  window.api.stomp.disconnect(connectionId);
}

export function subscribeStomp(connectionId: string, subscriptionId: string, topic: string) {
  window.api.stomp.subscribe(connectionId, subscriptionId, topic);
}

export function unsubscribeStomp(connectionId: string, subscriptionId: string, topic: string) {
  window.api.stomp.unsubscribe(connectionId, subscriptionId, topic);
}

export function sendStompMessage(connectionId: string, request: Request) {
  window.api.stomp.send(connectionId, request);
}
