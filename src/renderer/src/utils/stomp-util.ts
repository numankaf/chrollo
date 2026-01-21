import { resolveEnvironmentVariables, resolveObjectVariables } from '@/utils/environment-util';

import type { Request } from '@/types/collection';
import type { StompConnection } from '@/types/connection';

export function connectStomp(connection: StompConnection) {
  const resolvedConnection = resolveObjectVariables(connection);
  window.api.stomp.connect(resolvedConnection);
}

export function disconnectStomp(connectionId: string) {
  window.api.stomp.disconnect(connectionId);
}

export function subscribeStomp(connectionId: string, subscriptionId: string, topic: string) {
  const resolvedTopic = resolveEnvironmentVariables(topic);
  window.api.stomp.subscribe(connectionId, subscriptionId, resolvedTopic);
}

export function unsubscribeStomp(connectionId: string, subscriptionId: string, topic: string) {
  const resolvedTopic = resolveEnvironmentVariables(topic);
  window.api.stomp.unsubscribe(connectionId, subscriptionId, resolvedTopic);
}

export function sendStompMessage(connectionId: string, request: Request) {
  const resolvedRequest = resolveObjectVariables(request);
  window.api.stomp.send(connectionId, resolvedRequest);
}
