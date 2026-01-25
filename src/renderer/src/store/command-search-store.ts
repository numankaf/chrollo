import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { RecentTab, Tab } from '@/types/layout';

export const MAX_RECENT_TABS = 20;

interface CommandSearchStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  recentTabs: RecentTab[];
  addRecentTab: (tab: Tab) => void;
  removeRecentTab: (id: string) => void;
}

const useCommandSearchStore = create<CommandSearchStore>()(
  persist(
    (set) => ({
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      recentTabs: [],
      addRecentTab: (tab) =>
        set((state) => {
          const filtered = state.recentTabs.filter((t) => t.id !== tab.id);
          const newRecentTab: RecentTab = { ...tab, timestamp: Date.now() };
          return {
            recentTabs: [newRecentTab, ...filtered].slice(0, MAX_RECENT_TABS),
          };
        }),
      removeRecentTab: (id) =>
        set((state) => ({
          recentTabs: state.recentTabs.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'command-search-store',
      partialize: (state) => ({ recentTabs: state.recentTabs }),
    }
  )
);

export default useCommandSearchStore;
