import { nanoid } from 'nanoid';
import { create } from 'zustand';
import type { Tab, TabItem } from '../types/layout';

interface TabsStore {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (item: TabItem) => void;
  openTab: (item: TabItem) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
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
    const newTab = { id: nanoid(8), item };
    set((state) => {
      const tabs = [...state.tabs, newTab];
      return { tabs, activeTabId: newTab.id };
    });
    scrollToTab(newTab.id);
  },

  openTab: (item) => {
    let targetTabId: string | null = null;

    set((state) => {
      const existingTab = state.tabs.find((t) => t.item.id === item.id);
      if (existingTab) {
        targetTabId = existingTab.id;
        return { ...state, activeTabId: existingTab.id };
      }

      const newTab = { id: nanoid(8), item };
      targetTabId = newTab.id;
      return { tabs: [...state.tabs, newTab], activeTabId: newTab.id };
    });

    scrollToTab(targetTabId);
  },

  closeTab: (id) =>
    set((state) => {
      const tabs = state.tabs;
      const tabIndex = tabs.findIndex((t) => t.id === id);
      const newTabs = tabs.filter((t) => t.id !== id);

      let newActiveTabId = state.activeTabId;
      if (state.activeTabId === id) {
        newActiveTabId = tabIndex > 0 ? (newTabs[tabIndex - 1]?.id ?? null) : (newTabs[0]?.id ?? null);
      }

      return { tabs: newTabs, activeTabId: newActiveTabId };
    }),

  setActiveTab: (id) => {
    set({ activeTabId: id });
    scrollToTab(id);
  },
}));

export default useTabsStore;
