import useTabsStore from '@/store/tab-store';
import { cloneCollectionItemDeep, deleteItemAndChildren, hasChildren, hasParent } from '@/utils/collection-util';
import { toMap } from '@/utils/map-utils';
import { create } from 'zustand';

import { type Collection, type CollectionFile, type CollectionItem, type Folder } from '@/types/collection';

interface CollectionItemStore {
  collectionItemMap: Map<string, CollectionItem>;
  createCollectionItem: (collection: CollectionItem) => CollectionItem;
  updateCollectionItem: (collection: CollectionItem) => CollectionItem;
  deleteCollectionItem: (id: string) => Promise<void>;
  cloneCollectionItem: (id: string) => Promise<void>;
  saveCollectionItem: (collection: CollectionItem) => Promise<CollectionItem>;
  initCollectionItemStore: (collectionFile: CollectionFile) => Promise<void>;
}

const useCollectionItemStore = create<CollectionItemStore>((set, get) => ({
  collectionItemMap: new Map(),

  createCollectionItem: (collection: CollectionItem) => {
    set((state) => {
      const newMap = new Map(state.collectionItemMap);

      newMap.set(collection.id, collection);

      if (hasParent(collection)) {
        const parent = newMap.get(collection.parentId) as Collection | Folder | undefined;
        if (parent) {
          const children = parent.children ? [...parent.children] : [];
          if (!children.includes(collection.id)) {
            children.push(collection.id);
          }
          if (hasChildren(parent)) {
            const updatedParent = { ...parent, children };
            newMap.set(parent.id, updatedParent);
          }
        }
      }

      return { collectionItemMap: newMap };
    });

    return collection;
  },

  updateCollectionItem: (collection: CollectionItem) => {
    set((state) => {
      const newMap = new Map(state.collectionItemMap);

      if (newMap.has(collection.id)) {
        newMap.set(collection.id, collection);

        if (hasParent(collection)) {
          const parent = newMap.get(collection.parentId) as Collection | Folder | undefined;
          if (parent) {
            const children = parent.children ? [...parent.children] : [];
            if (!children.includes(collection.id)) {
              children.push(collection.id);
            }
            if (hasChildren(parent)) {
              const updatedParent = { ...parent, children };
              newMap.set(parent.id, updatedParent);
            }
          }
        }
      }

      return { collectionItemMap: newMap };
    });

    return collection;
  },

  deleteCollectionItem: async (id: string) => {
    set((state) => {
      const newMap = new Map(state.collectionItemMap);

      deleteItemAndChildren(newMap, id);

      return { collectionItemMap: newMap };
    });

    useTabsStore.getState().closeTab(id);

    const updatedMap = get().collectionItemMap;
    await window.api.collection.save({ collectionItemMap: Object.fromEntries(updatedMap) });
  },

  cloneCollectionItem: async (id: string) => {
    let clonedId = '';
    set((state) => {
      const { newMap, clonedRootId } = cloneCollectionItemDeep(state.collectionItemMap, id);
      clonedId = clonedRootId;
      const original = state.collectionItemMap.get(id);
      if (original && hasParent(original)) {
        const parent = newMap.get(original.parentId) as Collection | Folder | undefined;
        if (parent) {
          const index = parent.children?.indexOf(id) ?? -1;
          if (index !== -1) {
            parent.children!.splice(index + 1, 0, clonedRootId);
          }
        }
      }

      return { collectionItemMap: newMap };
    });

    const clonedCollectionItem = get().collectionItemMap.get(clonedId);
    if (clonedCollectionItem) useTabsStore.getState().openTab(clonedCollectionItem);

    await window.api.collection.save({ collectionItemMap: Object.fromEntries(get().collectionItemMap) });
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
