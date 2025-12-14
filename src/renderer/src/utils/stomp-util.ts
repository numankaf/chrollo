import type { BaseStompPlugin } from '@/plugins/base-plugin';
import { createPlugin } from '@/plugins/plugin-factory';
import { pluginStore } from '@/plugins/plugin-store';
import { useAppConfigStore } from '@/store/app-config-store';

import type { Request } from '@/types/collection';
import type { StompConnection, StompSubscription } from '@/types/connection';

export function connectStomp(connection: StompConnection) {
  const { subscriptions } = connection;
  const activePluginId = useAppConfigStore.getState().activePlugin;

  let constructedConnection = connection;

  if (activePluginId) {
    let plugin = pluginStore.get(connection.id) as BaseStompPlugin | undefined;

    if (!plugin) {
      plugin = createPlugin(activePluginId) as BaseStompPlugin;
      pluginStore.set(connection.id, plugin);
    }

    if (plugin.onPreConnect) {
      constructedConnection = plugin.onPreConnect(connection);
    }

    const newSubscriptions: StompSubscription[] = [];

    if (plugin.onPreSubscribe) {
      for (const subscription of subscriptions) {
        const pluginSubsciptions = plugin.onPreSubscribe(subscription.id, subscription.topic);
        for (const pluginSubscription of pluginSubsciptions) {
          newSubscriptions.push({ ...subscription, id: pluginSubscription.id, topic: pluginSubscription.topic });
        }
      }
    }
    constructedConnection.subscriptions = newSubscriptions;
  }

  window.api.stomp.connect(constructedConnection);
}

export function disconnectStomp(connectionId: string) {
  window.api.stomp.disconnect(connectionId);
}

export function subscribeStomp(connectionId: string, subscriptionId: string, topic: string) {
  const activePluginId = useAppConfigStore.getState().activePlugin;
  const plugin = activePluginId ? (pluginStore.get(connectionId) as BaseStompPlugin | undefined) : undefined;

  let subscriptions: { id: string; topic: string }[] = [{ id: subscriptionId, topic }];

  if (plugin?.onPreSubscribe) {
    subscriptions = plugin.onPreSubscribe(subscriptionId, topic);
  }

  for (const sub of subscriptions) {
    window.api.stomp.subscribe(connectionId, sub.id, sub.topic);
  }
}

export function unsubscribeStomp(connectionId: string, subscriptionId: string, topic: string) {
  const activePluginId = useAppConfigStore.getState().activePlugin;
  const plugin = activePluginId ? (pluginStore.get(connectionId) as BaseStompPlugin | undefined) : undefined;

  let subscriptions: { id: string; topic: string }[] = [{ id: subscriptionId, topic }];

  if (plugin?.onPreSubscribe) {
    subscriptions = plugin.onPreSubscribe(subscriptionId, topic);
  }

  for (const sub of subscriptions) {
    window.api.stomp.unsubscribe(connectionId, sub.id, sub.topic);
  }
}

export function sendStompMessage(connectionId: string, request: Request) {
  const activePluginId = useAppConfigStore.getState().activePlugin;
  const plugin = activePluginId ? (pluginStore.get(connectionId) as BaseStompPlugin) : undefined;

  let finalRequest = request;

  if (plugin && plugin.onPreSend) {
    finalRequest = plugin.onPreSend(request);
  }

  window.api.stomp.send(connectionId, finalRequest);
}
