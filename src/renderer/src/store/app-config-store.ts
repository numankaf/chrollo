import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DEFAULT_APP_SETTINGS, type AppSettings } from '@/types/setting';

type AppConfigState = {
  applicationSettings: AppSettings;
  setApplicationSettings: (settings: AppSettings) => void;
  updateApplicationSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
};

export const useAppConfigStore = create<AppConfigState>()(
  persist(
    (set) => ({
      applicationSettings: DEFAULT_APP_SETTINGS,

      setApplicationSettings: (settings) => set({ applicationSettings: settings }),

      updateApplicationSetting: (key, value) =>
        set((state) => ({
          applicationSettings: {
            ...state.applicationSettings,
            [key]: value,
          },
        })),
    }),
    {
      name: 'app-config',
    }
  )
);
