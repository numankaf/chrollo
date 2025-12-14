import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { type PluginId } from '@/types/plugin';

type AppConfigState = {
  activeStompPlugin: PluginId | undefined;

  setActiveStompPlugin: (pluginId?: PluginId) => void;
};

export const useAppConfigStore = create<AppConfigState>()(
  persist(
    (set) => ({
      activeStompPlugin: undefined,

      setActiveStompPlugin: (pluginId) => set({ activeStompPlugin: pluginId }),
    }),
    {
      name: 'app-config',
    }
  )
);
