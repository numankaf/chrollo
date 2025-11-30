import useTabsStore from '@/store/tab-store';
import { toMap } from '@/utils/map-utils';
import { create } from 'zustand';

import { type CollectionFile, type CollectionItem } from '@/types/collection';

interface CollectionItemStore {
  collectionItemMap: Map<string, CollectionItem>;
  createCollectionItem: (collection: CollectionItem) => CollectionItem;
  updateCollectionItem: (collection: CollectionItem) => CollectionItem;
  deleteCollectionItem: (id: string) => Promise<void>;
  saveCollectionItem: (collection: CollectionItem) => Promise<CollectionItem>;
  initCollectionItemStore: (collectionFile: CollectionFile) => Promise<void>;
}

const useCollectionItemStore = create<CollectionItemStore>((set, get) => ({
  collectionItemMap: new Map(),

  createCollectionItem: (collection) => {
    set((state) => {
      const newMap = new Map(state.collectionItemMap);
      newMap.set(collection.id, collection);
      return { collectionItemMap: newMap };
    });

    return collection;
  },

  updateCollectionItem: (collection) => {
    set((state) => {
      const newMap = new Map(state.collectionItemMap);
      if (newMap.has(collection.id)) {
        newMap.set(collection.id, collection);
      }
      return { collectionItemMap: newMap };
    });

    return collection;
  },

  deleteCollectionItem: async (id) => {
    set((state) => {
      const newMap = new Map(state.collectionItemMap);
      newMap.delete(id);
      return { collectionItemMap: newMap };
    });

    useTabsStore.getState().closeTab(id);

    const updatedMap = get().collectionItemMap;
    await window.api.collection.save({ collectionItemMap: Object.fromEntries(updatedMap) });
  },

  saveCollectionItem: async (collection) => {
    const exists = get().collectionItemMap.has(collection.id);
    const updatedCollection = exists ? get().updateCollectionItem(collection) : get().createCollectionItem(collection);

    await window.api.collection.save({ collectionItemMap: Object.fromEntries(get().collectionItemMap) });

    return updatedCollection;
  },

  initCollectionItemStore: (collectionFile) => {
    return new Promise((resolve) => {
      set(() => ({
        collectionItemMap: toMap(collectionFile.collectionItemMap),
      }));
      resolve();
    });
  },
}));

export default useCollectionItemStore;
