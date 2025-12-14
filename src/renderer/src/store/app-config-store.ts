import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { PLUGIN_ID, type PluginId } from '@/types/plugin';

type AppConfigState = {
  activeStompPlugin: PluginId | undefined;

  setActiveStompPlugin: (pluginId?: PluginId) => void;
};

export const useAppConfigStore = create<AppConfigState>()(
  persist(
    (set) => ({
      activeStompPlugin: PLUGIN_ID.SCOPE_PLATFORM,

      setActiveStompPlugin: (pluginId) => set({ activeStompPlugin: pluginId }),
    }),
    {
      name: 'app-config',
    }
  )
);
