import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AppConfigState = {
  applicationSettings: unknown;
  setApplicationSettings: (settings: unknown) => void;
};

export const useAppConfigStore = create<AppConfigState>()(
  persist(
    (set) => ({
      applicationSettings: undefined,

      setApplicationSettings: (settings) => set({ applicationSettings: settings }),
    }),
    {
      name: 'app-config',
    }
  )
);
