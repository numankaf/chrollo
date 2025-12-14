import type { BaseStompPlugin } from '@/plugins/base-plugin';
import { createPlugin } from '@/plugins/plugin-factory';
import { useAppConfigStore } from '@/store/app-config-store';

let activeStompPlugin: BaseStompPlugin | undefined;

export function getActiveStompPlugin(): BaseStompPlugin | undefined {
  const pluginId = useAppConfigStore.getState().activeStompPlugin;

  if (!pluginId) {
    activeStompPlugin = undefined;
    return undefined;
  }

  if (!activeStompPlugin || activeStompPlugin.id !== pluginId) {
    activeStompPlugin = createPlugin(pluginId) as BaseStompPlugin;
  }

  return activeStompPlugin;
}
