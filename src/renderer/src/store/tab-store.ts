import { nanoid } from 'nanoid';
import { create } from 'zustand';

import type { Tab, TabItem } from '@/types/layout';

interface TabsStore {
  tabs: Tab[];
  setTabs: (tabs: Tab[]) => void;
  activeTab: Tab | null;
  addTab: (item: TabItem) => Tab;
  openTab: (item: TabItem) => Tab;
  closeTab: (id: string) => Tab | null;
  setActiveTab: (id: string) => Tab | null;
}

const scrollToTab = (tabId: string | null) => {
  if (!tabId) return;
  requestAnimationFrame(() => {
    const el = document.querySelector(`[data-tab-id="${tabId}"]`);
    el?.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
  });
};

const useTabsStore = create<TabsStore>()((set, get) => ({
  tabs: [],
  setTabs: (tabs) => set({ tabs }),
  activeTab: null,
  addTab: (item) => {
    const newTab: Tab = { id: item.id, item };
    set((state) => {
      const tabs = [...state.tabs, newTab];
      return { tabs, activeTab: newTab };
    });
    scrollToTab(newTab.id);
    return newTab;
  },

  openTab: (item) => {
    let targetTab: Tab;
    const state = get();

    const existingTab = state.tabs.find((t) => t.item.id === item.id);
    if (existingTab) {
      targetTab = existingTab;
      set({ activeTab: existingTab });
    } else {
      const newTab: Tab = { id: nanoid(8), item };
      targetTab = newTab;
      set({ tabs: [...state.tabs, newTab], activeTab: newTab });
    }

    scrollToTab(targetTab.id);
    return targetTab;
  },

  closeTab: (id) => {
    const state = get();
    const tabs = state.tabs;
    const tabIndex = tabs.findIndex((t) => t.id === id);
    const newTabs = tabs.filter((t) => t.id !== id);

    let newActiveTab: Tab | null = state.activeTab;

    if (state.activeTab?.id === id) {
      if (tabIndex > 0) {
        newActiveTab = newTabs[tabIndex - 1] ?? null;
      } else {
        newActiveTab = newTabs[0] ?? null;
      }
    }

    set({ tabs: newTabs, activeTab: newActiveTab });
    return newActiveTab;
  },

  setActiveTab: (id) => {
    const tab = get().tabs.find((t) => t.id === id) ?? null;
    set({ activeTab: tab });
    scrollToTab(tab?.id ?? null);
    return tab;
  },
}));

export default useTabsStore;
