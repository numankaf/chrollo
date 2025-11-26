import { default as useWorkspaceStore } from '@/store/workspace-store';
import { getActiveWorkspaceSelection } from '@/utils/workspace-utils';
import { create } from 'zustand';

import { BASE_MODEL_TYPE } from '@/types/base';
import type { Tab, TabItem, TabsFile } from '@/types/layout';

interface TabsStore {
  tabs: Tab[];
  setTabs: (tabs: Tab[]) => void;
  addTab: (item: TabItem) => Tab;
  openTab: (item: TabItem) => Tab;
  closeTab: (id: string) => Tab | null;
  initTabsStore: (tabsFile: TabsFile) => Promise<void>;
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
      const newTab: Tab = { id: item.id, item };
      targetTab = newTab;
      set({ tabs: [...state.tabs, newTab] });
      useWorkspaceStore.getState().updateWorkspaceSelection({ activeTabId: newTab.id });
    }

    scrollToTab(targetTab.id);
    return targetTab;
  },

  closeTab: (id) => {
    const state = get();
    const activeWorkspaceId = useWorkspaceStore.getState().activeWorkspaceId;

    // Separate current workspace tabs and other workspace tabs
    const currentWorkspaceTabs = state.tabs.filter((tab) => {
      if (tab.item.modelType === BASE_MODEL_TYPE.WORKSPACE) {
        return tab.id === activeWorkspaceId;
      }
      return tab.item.workspaceId === activeWorkspaceId;
    });

    const otherWorkspaceTabs = state.tabs.filter((tab) =>
      tab.item.modelType === BASE_MODEL_TYPE.WORKSPACE
        ? tab.id !== activeWorkspaceId
        : tab.item.workspaceId !== activeWorkspaceId
    );

    const tabIndex = currentWorkspaceTabs.findIndex((t) => t.id === id);
    const newCurrentTabs = currentWorkspaceTabs.filter((t) => t.id !== id);

    const currentActiveTabId = getActiveWorkspaceSelection('activeTabId');

    let newActiveTabId = currentActiveTabId;

    if (currentActiveTabId === id) {
      if (tabIndex > 0) {
        newActiveTabId = newCurrentTabs[tabIndex - 1]?.id ?? newCurrentTabs[0]?.id;
      } else {
        newActiveTabId = newCurrentTabs[0]?.id;
      }
      useWorkspaceStore.getState().updateWorkspaceSelection({ activeTabId: newActiveTabId });
    }

    // Merge back with tabs from other workspaces
    const mergedTabs = [...otherWorkspaceTabs, ...newCurrentTabs];

    set({ tabs: mergedTabs });

    return mergedTabs.find((t) => t.id === newActiveTabId) ?? null;
  },

  initTabsStore: async (tabsFile: TabsFile) => {
    return new Promise((resolve) => {
      set(() => ({
        tabs: tabsFile.tabs,
      }));
      resolve();
    });
  },
}));

export default useTabsStore;
