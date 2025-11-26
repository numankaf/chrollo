import { default as useWorkspaceStore } from '@/store/workspace-store';
import { getActiveWorkspaceSelection } from '@/utils/workspace-utils';
import { nanoid } from 'nanoid';
import { create } from 'zustand';

import type { Tab, TabItem, TabsFile } from '@/types/layout';

interface TabsStore {
  tabs: Tab[];
  setTabs: (tabs: Tab[]) => void;
  addTab: (item: TabItem) => Tab;
  openTab: (item: TabItem) => Tab;
  closeTab: (id: string) => Tab | null;
  initTabsStore: (tabsFile: TabsFile) => void;
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
  addTab: (item) => {
    const newTab: Tab = { id: item.id, item };
    set((state) => {
      const tabs = [...state.tabs, newTab];
      return { tabs, activeTab: newTab };
    });
    scrollToTab(newTab.id);
    useWorkspaceStore.getState().updateWorkspaceSelection({ activeTabId: newTab.id });
    return newTab;
  },

  openTab: (item) => {
    let targetTab: Tab;
    const state = get();

    const existingTab = state.tabs.find((t) => t.item.id === item.id);
    if (existingTab) {
      targetTab = existingTab;
      useWorkspaceStore.getState().updateWorkspaceSelection({ activeTabId: existingTab.id });
    } else {
      const newTab: Tab = { id: nanoid(8), item };
      targetTab = newTab;
      set({ tabs: [...state.tabs, newTab] });
      useWorkspaceStore.getState().updateWorkspaceSelection({ activeTabId: newTab.id });
    }

    scrollToTab(targetTab.id);
    return targetTab;
  },

  closeTab: (id) => {
    const state = get();
    const tabs = state.tabs;
    const tabIndex = tabs.findIndex((t) => t.id === id);
    const newTabs = tabs.filter((t) => t.id !== id);

    const currentActiveTabId = getActiveWorkspaceSelection('activeTabId');

    let newActiveTabId = currentActiveTabId;

    if (currentActiveTabId === id) {
      if (tabIndex > 0) {
        newActiveTabId = newTabs[tabIndex - 1]?.id ?? newTabs[0]?.id;
      } else {
        newActiveTabId = newTabs[0]?.id;
      }

      useWorkspaceStore.getState().updateWorkspaceSelection({ activeTabId: newActiveTabId });
    }

    set({ tabs: newTabs });

    return newTabs.find((t) => t.id === newActiveTabId) ?? null;
  },

  initTabsStore: (tabsFile) => set(() => ({ tabs: tabsFile.tabs })),
}));

export default useTabsStore;
