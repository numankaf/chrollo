import { default as useWorkspaceStore } from '@/store/workspace-store';
import { scrollToTab } from '@/utils/tab-util';
import { getActiveWorkspaceSelection } from '@/utils/workspace-util';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { BASE_MODEL_TYPE } from '@/types/base';
import type { Tab } from '@/types/layout';

interface TabsStore {
  tabs: Tab[];
  setTabs: (tabs: Tab[]) => void;
  addTab: (item: Tab) => Tab;
  openTab: (item: Tab) => Tab;
  closeTab: (id: string) => Tab | null;
}

const useTabsStore = create<TabsStore>()(
  persist(
    (set, get) => ({
      tabs: [],
      setTabs: (tabs) => set({ tabs }),
      addTab: (tab) => {
        const activeWorkspaceId = useWorkspaceStore.getState().activeWorkspaceId!;
        const newTab: Tab = { id: tab.id, modelType: tab.modelType, workspaceId: activeWorkspaceId };
        set((state) => {
          const tabs = [...state.tabs, newTab];
          return { tabs, activeTab: newTab };
        });
        scrollToTab(newTab.id);
        useWorkspaceStore.getState().updateWorkspaceSelection({ activeTabId: newTab.id });
        return newTab;
      },

      openTab: (tab) => {
        let targetTab: Tab;
        const state = get();

        const existingTab = state.tabs.find((t) => t.id === tab.id);
        if (existingTab) {
          targetTab = existingTab;
          useWorkspaceStore.getState().updateWorkspaceSelection({ activeTabId: existingTab.id });
        } else {
          const activeWorkspaceId = useWorkspaceStore.getState().activeWorkspaceId!;
          const newTab: Tab = { id: tab.id, modelType: tab.modelType, workspaceId: activeWorkspaceId };
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
          if (tab.modelType === BASE_MODEL_TYPE.WORKSPACE) {
            return tab.id === activeWorkspaceId;
          }
          return tab.workspaceId === activeWorkspaceId;
        });

        const otherWorkspaceTabs = state.tabs.filter((tab) =>
          tab.modelType === BASE_MODEL_TYPE.WORKSPACE
            ? tab.id !== activeWorkspaceId
            : tab.workspaceId !== activeWorkspaceId
        );

        const tabIndex = currentWorkspaceTabs.findIndex((t) => t.id === id);
        const newCurrentTabs = currentWorkspaceTabs.filter((t) => t.id !== id);

        const currentActiveTabId = getActiveWorkspaceSelection('activeTabId');

        let newActiveTabId = currentActiveTabId as string;

        if (id === currentActiveTabId) {
          if (tabIndex > 0) {
            newActiveTabId = newCurrentTabs[tabIndex - 1]?.id ?? newCurrentTabs[0]?.id;
          } else {
            newActiveTabId = newCurrentTabs[0]?.id;
          }
        }

        useWorkspaceStore.getState().updateWorkspaceSelection({ activeTabId: newActiveTabId });

        // Merge back with tabs from other workspaces
        const mergedTabs = [...otherWorkspaceTabs, ...newCurrentTabs];
        set({ tabs: mergedTabs });

        return mergedTabs.find((t) => t.id === newActiveTabId) ?? null;
      },
    }),
    {
      name: 'tabs-store',
      partialize: (state) => ({ tabs: state.tabs }),
    }
  )
);

export default useTabsStore;
