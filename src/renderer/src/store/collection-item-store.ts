import useTabsStore from '@/store/tab-store';
import { cloneCollectionItemDeep, deleteItemAndChildren, hasChildren, hasParent } from '@/utils/collection-util';
import { create } from 'zustand';

import { type Collection, type CollectionItem, type Folder } from '@/types/collection';

interface CollectionItemStore {
  collectionItemMap: Map<string, CollectionItem>;
  initCollectionStore: (items: CollectionItem[]) => Promise<void>;
  createCollectionItem: (collection: CollectionItem) => CollectionItem;
  updateCollectionItem: (
    collection: CollectionItem,
    options?: {
      persist?: boolean;
    }
  ) => CollectionItem;
  deleteCollectionItem: (id: string) => void;
  cloneCollectionItem: (id: string) => void;
  saveCollectionItem: (collection: CollectionItem) => CollectionItem;
}

const useCollectionItemStore = create<CollectionItemStore>((set, get) => ({
  collectionItemMap: new Map(),
  initCollectionStore: async (items: CollectionItem[]) =>
    set(() => {
      const map = new Map<string, CollectionItem>();

      for (const item of items) {
        map.set(item.id, item);
      }

      return { collectionItemMap: map };
    }),

  createCollectionItem: (collection: CollectionItem) => {
    set((state) => {
      const newMap = new Map(state.collectionItemMap);

      newMap.set(collection.id, collection);
      window.api.collection.save(collection);

      if (hasParent(collection)) {
        const parent = newMap.get(collection.parentId) as Collection | Folder | undefined;
        if (parent) {
          const children = parent.children ? [...parent.children] : [];
          if (!children.includes(collection.id)) {
            children.push(collection.id);
            if (hasChildren(parent)) {
              const updatedParent = { ...parent, children };
              newMap.set(parent.id, updatedParent);
              window.api.collection.save(updatedParent);
            }
          }
        }
      }

      return { collectionItemMap: newMap };
    });

    return collection;
  },

  updateCollectionItem: (collection: CollectionItem, options = { persist: false }) => {
    set((state) => {
      const newMap = new Map(state.collectionItemMap);

      if (newMap.has(collection.id)) {
        newMap.set(collection.id, collection);
        if (options.persist) window.api.collection.save(collection);

        if (hasParent(collection)) {
          const parent = newMap.get(collection.parentId) as Collection | Folder | undefined;
          if (parent) {
            const children = parent.children ? [...parent.children] : [];
            if (!children.includes(collection.id)) {
              children.push(collection.id);
              if (hasChildren(parent)) {
                const updatedParent = { ...parent, children };
                newMap.set(parent.id, updatedParent);
                // always persist if child added
                window.api.collection.save(updatedParent);
              }
            }
          }
        }
      }

      return { collectionItemMap: newMap };
    });

    return collection;
  },

  deleteCollectionItem: (id: string) => {
    set((state) => {
      const newMap = new Map(state.collectionItemMap);

      deleteItemAndChildren(newMap, id);

      return { collectionItemMap: newMap };
    });

    useTabsStore.getState().closeTab(id);
  },

  cloneCollectionItem: (id: string) => {
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
          window.api.collection.save(parent);
        }
      }

      return { collectionItemMap: newMap };
    });

    const clonedCollectionItem = get().collectionItemMap.get(clonedId);
    if (clonedCollectionItem) useTabsStore.getState().openTab(clonedCollectionItem);
  },

  saveCollectionItem: (collection) => {
    const exists = get().collectionItemMap.has(collection.id);
    const updatedCollection = exists
      ? get().updateCollectionItem(collection, { persist: true })
      : get().createCollectionItem(collection);

    return updatedCollection;
  },
}));

export default useCollectionItemStore;
