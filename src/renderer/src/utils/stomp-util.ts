import { getActiveStompPlugin } from '@/plugins/plugin-runtime';

import type { Request } from '@/types/collection';
import type { StompConnection, StompSubscription } from '@/types/connection';

export function connectStomp(connection: StompConnection) {
  const plugin = getActiveStompPlugin();
  let constructedConnection = connection;

  if (plugin?.onPreConnect) {
    constructedConnection = plugin.onPreConnect(constructedConnection);
  }

  if (plugin?.onPreSubscribe) {
    const newSubscriptions: StompSubscription[] = [];

    for (const sub of connection.subscriptions) {
      const expanded = plugin.onPreSubscribe(connection.id, sub.id, sub.topic);
      for (const e of expanded) {
        newSubscriptions.push({ ...sub, id: e.id, topic: e.topic });
      }
    }

    constructedConnection = {
      ...constructedConnection,
      subscriptions: newSubscriptions,
    };
  }

  window.api.stomp.connect(constructedConnection);
}

export function disconnectStomp(connectionId: string) {
  window.api.stomp.disconnect(connectionId);
}

export function subscribeStomp(connectionId: string, subscriptionId: string, topic: string) {
  const plugin = getActiveStompPlugin();

  const subs = plugin?.onPreSubscribe
    ? plugin.onPreSubscribe(connectionId, subscriptionId, topic)
    : [{ id: subscriptionId, topic }];

  for (const sub of subs) {
    window.api.stomp.subscribe(connectionId, sub.id, sub.topic);
  }
}

export function unsubscribeStomp(connectionId: string, subscriptionId: string, topic: string) {
  const plugin = getActiveStompPlugin();

  const subs = plugin?.onPreSubscribe
    ? plugin.onPreSubscribe(connectionId, subscriptionId, topic)
    : [{ id: subscriptionId, topic }];

  for (const sub of subs) {
    window.api.stomp.unsubscribe(connectionId, sub.id, sub.topic);
  }
}

export function sendStompMessage(connectionId: string, request: Request) {
  const plugin = getActiveStompPlugin();
  const finalRequest = plugin?.onPreSend ? plugin.onPreSend(connectionId, request) : request;

  window.api.stomp.send(connectionId, finalRequest);
}
