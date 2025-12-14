import type { BasePlugin } from '@/plugins/base-plugin';

class PluginStore {
  private plugins = new Map<string, BasePlugin>();

  set(connectionId: string, plugin: BasePlugin) {
    this.plugins.set(connectionId, plugin);
  }

  get(connectionId: string): BasePlugin | undefined {
    return this.plugins.get(connectionId);
  }

  remove(connectionId: string) {
    this.plugins.delete(connectionId);
  }

  clear() {
    this.plugins.clear();
  }
}

export const pluginStore = new PluginStore();
