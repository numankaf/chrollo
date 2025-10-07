import { nanoid } from 'nanoid';
import { create } from 'zustand';
import type { Tab, TabItem } from '../types/layout';

interface TabsStore {
  tabs: Tab[];
  activeTabId: string | null;
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
  activeTabId: null,
  tabs: [],

  addTab: (item) => {
    const newTab: Tab = { id: nanoid(8), item };
    set((state) => {
      const tabs = [...state.tabs, newTab];
      return { tabs, activeTabId: newTab.id };
    });
    scrollToTab(newTab.id);
    return newTab;
  },

  openTab: (item) => {
    let targetTab: Tab | null = null;

    set((state) => {
      const existingTab = state.tabs.find((t) => t.item.id === item.id);
      if (existingTab) {
        targetTab = existingTab;
        return { ...state, activeTabId: existingTab.id };
      }
      const newTab: Tab = { id: nanoid(8), item };
      targetTab = newTab;
      return { tabs: [...state.tabs, newTab], activeTabId: newTab.id };
    });

    if (targetTab) scrollToTab((targetTab as Tab).id);
    return targetTab!;
  },

  closeTab: (id) => {
    let newActiveTab: Tab | null = null;
    set((state) => {
      const tabs = state.tabs;
      const tabIndex = tabs.findIndex((t) => t.id === id);
      const newTabs = tabs.filter((t) => t.id !== id);

      let newActiveTabId = state.activeTabId;
      if (state.activeTabId === id) {
        newActiveTabId = tabIndex > 0 ? (newTabs[tabIndex - 1]?.id ?? null) : (newTabs[0]?.id ?? null);
      }
      newActiveTab = newTabs.find((t) => t.id === newActiveTabId) ?? null;
      return { tabs: newTabs, activeTabId: newActiveTabId };
    });
    return newActiveTab;
  },

  setActiveTab: (id) => {
    set({ activeTabId: id });
    scrollToTab(id);
    const tab = get().tabs.find((t) => t.id === id) ?? null;
    return tab;
  },
}));

export default useTabsStore;
