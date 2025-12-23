import useTabsStore from '@/store/tab-store';
import { cloneCollectionItemDeep, deleteItemAndChildren, hasChildren, hasParent } from '@/utils/collection-util';
import { create } from 'zustand';

import { type Collection, type CollectionItem, type Folder, type Request } from '@/types/collection';

interface CollectionItemStore {
  collectionItemMap: Map<string, CollectionItem>;
  initCollectionStore: (items: CollectionItem[]) => Promise<void>;
  createCollectionItem: (collection: CollectionItem) => Promise<CollectionItem>;
  updateCollectionItem: (
    collection: CollectionItem,
    options?: {
      persist?: boolean;
    }
  ) => Promise<CollectionItem>;
  deleteCollectionItem: (id: string) => Promise<void>;
  cloneCollectionItem: (id: string) => Promise<CollectionItem>;
  saveCollectionItem: (collection: CollectionItem) => Promise<CollectionItem>;
  moveCollectionItem: (id: string, parentId: string | null, index: number) => Promise<void>;
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

  createCollectionItem: async (collection: CollectionItem) => {
    const itemsToSave: CollectionItem[] = [];

    set((state) => {
      const newMap = new Map(state.collectionItemMap);

      newMap.set(collection.id, collection);
      itemsToSave.push(collection);

      if (hasParent(collection)) {
        const parent = newMap.get(collection.parentId) as Collection | Folder | undefined;
        if (parent) {
          const children = parent.children ? [...parent.children] : [];
          if (!children.includes(collection.id)) {
            children.push(collection.id);
            if (hasChildren(parent)) {
              const updatedParent = { ...parent, children };
              newMap.set(parent.id, updatedParent);
              itemsToSave.push(updatedParent);
            }
          }
        }
      }

      return { collectionItemMap: newMap };
    });

    for (const item of itemsToSave) {
      await window.api.collection.save(item);
    }

    return collection;
  },

  updateCollectionItem: async (collection: CollectionItem, options = { persist: false }) => {
    const itemsToSave: CollectionItem[] = [];

    set((state) => {
      const newMap = new Map(state.collectionItemMap);

      if (newMap.has(collection.id)) {
        newMap.set(collection.id, collection);
        if (options.persist) itemsToSave.push(collection);
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
                itemsToSave.push(updatedParent);
              }
            }
          }
        }
      }

      return { collectionItemMap: newMap };
    });

    for (const item of itemsToSave) {
      await window.api.collection.save(item);
    }

    return collection;
  },

  deleteCollectionItem: async (id: string) => {
    set((state) => {
      const newMap = new Map(state.collectionItemMap);

      deleteItemAndChildren(newMap, id);

      return { collectionItemMap: newMap };
    });

    useTabsStore.getState().closeTab(id);
  },

  cloneCollectionItem: async (id: string) => {
    let clonedId = '';
    let parentToSave: CollectionItem | undefined;

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
          parentToSave = parent;
        }
      }

      return { collectionItemMap: newMap };
    });

    if (parentToSave) {
      await window.api.collection.save(parentToSave);
    }

    const clonedCollectionItem = get().collectionItemMap.get(clonedId);
    if (!clonedCollectionItem) {
      throw new Error(`Failed to clone collection item with id: ${id}`);
    }

    useTabsStore.getState().openTab(clonedCollectionItem);

    return clonedCollectionItem;
  },

  saveCollectionItem: async (collection) => {
    const exists = get().collectionItemMap.has(collection.id);
    const updatedCollection = exists
      ? await get().updateCollectionItem(collection, { persist: true })
      : await get().createCollectionItem(collection);

    return updatedCollection;
  },

  moveCollectionItem: async (id: string, parentId: string | null, index: number) => {
    const itemsToSave: CollectionItem[] = [];

    set((state) => {
      const newMap = new Map(state.collectionItemMap);
      const item = newMap.get(id);
      if (!item) return state;

      const oldParentId = hasParent(item) ? item.parentId : null;

      // 1. Remove from old parent
      if (oldParentId) {
        const oldParent = newMap.get(oldParentId);
        if (oldParent && hasChildren(oldParent)) {
          const children = (oldParent.children || []).filter((cid) => cid !== id);
          const updatedOldParent = { ...oldParent, children };
          newMap.set(oldParentId, updatedOldParent);
          itemsToSave.push(updatedOldParent);
        }
      }

      // 2. Update item's parentId if it's a type that has a parent
      const updatedItem = { ...item };
      if (hasParent(updatedItem)) {
        if (parentId) {
          (updatedItem as Folder | Request).parentId = parentId;
        }
        newMap.set(id, updatedItem);
        itemsToSave.push(updatedItem);
      }

      // 3. Add to new parent
      if (parentId) {
        const newParent = newMap.get(parentId);
        if (newParent && hasChildren(newParent)) {
          const children = [...(newParent.children || [])];
          // Remove if already there (shouldn't be, but safe)
          const existingIndex = children.indexOf(id);
          if (existingIndex !== -1) {
            children.splice(existingIndex, 1);
          }
          children.splice(index, 0, id);
          const updatedNewParent = { ...newParent, children };
          newMap.set(parentId, updatedNewParent);
          itemsToSave.push(updatedNewParent);
        }
      }

      return { collectionItemMap: newMap };
    });

    for (const itemToSave of itemsToSave) {
      await window.api.collection.save(itemToSave);
    }
  },
}));

export default useCollectionItemStore;
