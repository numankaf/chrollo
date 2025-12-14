export const PLUGIN_ID = {
  SCOPE_PLATFORM: 'SCOPE_PLATFORM',
} as const;

export type PluginId = (typeof PLUGIN_ID)[keyof typeof PLUGIN_ID];
