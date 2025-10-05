import { nanoid } from 'nanoid';
import { create } from 'zustand';
import type { Tab, TabItem } from '../types/layout';

interface TabsStore {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (item: TabItem) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
}

const useTabsStore = create<TabsStore>()((set) => ({
  activeTabId: null,
  tabs: [
    {
      id: nanoid(8),
      item: {
        id: nanoid(8),
        name: 'createUnit',
        commandType: 'command',
        type: 'request',
        path: '/bsi/unit/createUnit',
      },
    },
    {
      id: nanoid(8),
      item: {
        id: nanoid(8),
        name: 'ws-connection-ehkks',
        type: 'connection',
        state: 'error',
      },
    },
    {
      id: nanoid(8),
      item: {
        id: nanoid(8),
        type: 'enviroment',
        name: 'environment-ehkks',
      },
    },
    {
      id: nanoid(8),
      item: {
        id: nanoid(8),
        name: 'scope-corec2',
        type: 'collection',
      },
    },
  ],
  addTab: (item) => {
    const newTab = { id: nanoid(8), item: item };
    set((state) => ({
      tabs: [...state.tabs, newTab],
    }));
  },
  closeTab: (id) =>
    set((state) => {
      const newTabs = state.tabs.filter((t) => t.id !== id);
      return { tabs: newTabs };
    }),
  setActiveTab: (id) => set({ activeTabId: id }),
}));

export default useTabsStore;
