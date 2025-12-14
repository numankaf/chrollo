import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { PLUGIN_ID, type PluginId } from '@/types/plugin';

type AppConfigState = {
  activePlugin: PluginId | undefined;

  setActivePlugin: (pluginId?: PluginId) => void;
};

export const useAppConfigStore = create<AppConfigState>()(
  persist(
    (set) => ({
      activePlugin: PLUGIN_ID.SCOPE_PLATFORM,

      setActivePlugin: (pluginId) => set({ activePlugin: pluginId }),
    }),
    {
      name: 'app-config',
    }
  )
);
