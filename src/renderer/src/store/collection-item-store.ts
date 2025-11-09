import { nanoid } from 'nanoid';
import { create } from 'zustand';

import { BASE_MODEL_TYPE } from '@/types/base';
import { COLLECTION_TYPE, type CollectionItem } from '@/types/collection';

interface CollectionItemStore {
  collectionItemMap: Map<string, CollectionItem>;
  createCollectionItem: (collection: CollectionItem) => void;
  updateCollectionItem: (collection: CollectionItem) => void;
  deleteCollectionItem: (id: string) => void;
}

const initialCollectionItemMap = new Map<string, CollectionItem>([
  [
    'corec2',
    {
      id: 'corec2',
      name: 'scope-corec2',
      workspaceId: nanoid(8),
      modelType: BASE_MODEL_TYPE.COLLECTION,
      collectionItemType: COLLECTION_TYPE.COLLECTION,
      variables: new Map(),
      overview: '',
      scripts: {},
      children: ['corec2-bsi'],
    } as CollectionItem,
  ],
  [
    'corec2-bsi',
    {
      id: 'corec2-bsi',
      name: 'bsi',
      workspaceId: nanoid(8),
      modelType: BASE_MODEL_TYPE.COLLECTION,
      collectionItemType: COLLECTION_TYPE.FOLDER,
      parentId: 'corec2',
      overview: '',
      scripts: {},
      children: ['corec2-bsi-unit-getUnit'],
    } as CollectionItem,
  ],
  [
    'corec2-bsi-unit-getUnit',
    {
      id: 'corec2-bsi-unit-getUnit',
      name: 'getUnit',
      workspaceId: nanoid(8),
      modelType: BASE_MODEL_TYPE.COLLECTION,
      collectionItemType: COLLECTION_TYPE.REQUEST,
      parentId: 'corec2-bsi',
      documentation: '',
      destination: '',
      body: { body: '', type: 'TEXT' },
      headers: new Map(),
      scripts: {},
      children: [],
    } as CollectionItem,
  ],
]);

const useCollectionItemStore = create<CollectionItemStore>((set) => ({
  collectionItemMap: initialCollectionItemMap,

  createCollectionItem: (collection) =>
    set((state) => {
      const newMap = new Map(state.collectionItemMap);
      newMap.set(collection.id, collection);
      return { collectionItemMap: newMap };
    }),

  updateCollectionItem: (collection) =>
    set((state) => {
      const newMap = new Map(state.collectionItemMap);
      if (newMap.has(collection.id)) newMap.set(collection.id, collection);
      return { collectionItemMap: newMap };
    }),

  deleteCollectionItem: (id) =>
    set((state) => {
      const newMap = new Map(state.collectionItemMap);
      newMap.delete(id);
      return { collectionItemMap: newMap };
    }),
}));

export default useCollectionItemStore;
