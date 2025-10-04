import { nanoid } from 'nanoid';
import { create } from 'zustand';
import type { Tab, TabItemType } from '../types/layout';

interface TabsStore {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (title: string, itemType: TabItemType, itemId: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
}

const useTabsStore = create<TabsStore>()((set) => ({
  activeTabId: null,
  tabs: [
    { id: nanoid(8), itemId: 'default', itemType: 'connection', title: 'Welcome1' },
    { id: nanoid(8), itemId: 'default', itemType: 'connection', title: 'Welcome2' },
    { id: nanoid(8), itemId: 'default', itemType: 'connection', title: 'Welcome3' },
  ],
  addTab: (title, itemType, itemId) => {
    const newTab = { id: nanoid(8), itemId: itemId, itemType: itemType, title: title };
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
