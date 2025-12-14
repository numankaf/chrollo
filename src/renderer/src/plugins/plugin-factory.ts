import type { BasePlugin } from '@/plugins/base-plugin';
import { ScopePlatformPlugin } from '@/plugins/stomp/scope-platform-plugin';

import { PLUGIN_ID, type PluginId } from '@/types/plugin';

type PluginConstructor = () => BasePlugin;

const registry: Record<PluginId, PluginConstructor> = {
  [PLUGIN_ID.SCOPE_PLATFORM]: () => new ScopePlatformPlugin(),
};

export function createPlugin(pluginId: PluginId): BasePlugin {
  const factory = registry[pluginId];

  if (!factory) {
    throw new Error(`Unknown plugin id: ${pluginId}`);
  }

  return factory();
}
