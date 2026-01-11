import { nanoid } from 'nanoid';

import {
  COLLECTION_TYPE,
  type Collection,
  type CollectionItem,
  type Folder,
  type Request,
  type RequestResponse,
} from '@/types/collection';

export function hasChildren(item: CollectionItem): item is Collection | Folder {
  return item.collectionItemType === COLLECTION_TYPE.COLLECTION || item.collectionItemType === COLLECTION_TYPE.FOLDER;
}

export function hasParent(item: CollectionItem): item is Folder | Request | RequestResponse {
  return (
    item.collectionItemType === COLLECTION_TYPE.FOLDER ||
    item.collectionItemType === COLLECTION_TYPE.REQUEST ||
    item.collectionItemType === COLLECTION_TYPE.REQUEST_RESPONSE
  );
}

export async function deleteItemAndChildren(map: Map<string, CollectionItem>, id: string): Promise<string[]> {
  const item = map.get(id);
  if (!item) return [];

  let deletedIds = [id];

  // Delete all children recursively if item has children
  if (hasChildren(item) && item.children?.length) {
    const childrenDeletedIds = await Promise.all(item.children.map((childId) => deleteItemAndChildren(map, childId)));
    deletedIds = deletedIds.concat(childrenDeletedIds.flat());
  }

  // Remove this item from its parent's children
  if (hasParent(item)) {
    const parent = map.get(item.parentId);
    if (parent && hasChildren(parent)) {
      parent.children = parent.children.filter((cid) => cid !== id);
      map.set(parent.id, { ...parent });
      await window.api.collection.save({ ...parent });
    }
  }

  //Delete this item from map
  map.delete(id);
  await window.api.collection.delete(id);

  return deletedIds;
}

export function cloneCollectionItemDeep(
  collectionItemMap: Map<string, CollectionItem>,
  originalId: string,
  idMap = new Map<string, string>()
): { newMap: Map<string, CollectionItem>; clonedRootId: string } {
  const newMap = new Map(collectionItemMap);
  let clonedRootId = '';

  function recursiveClone(itemId: string, parentId?: string) {
    const original = collectionItemMap.get(itemId);
    if (!original) return;

    const newId = nanoid();
    idMap.set(itemId, newId);

    const name = itemId === originalId ? `${original.name} (Copy)` : original.name;
    const cloned: CollectionItem = {
      ...original,
      id: newId,
      name,
      ...(hasParent(original) && parentId ? { parentId } : {}),
      ...(hasChildren(original) ? { children: [] } : {}),
    };

    newMap.set(newId, cloned);

    if (itemId === originalId) clonedRootId = newId;

    if (hasChildren(original) && hasChildren(cloned)) {
      cloned.children = original.children.map((childId) => {
        recursiveClone(childId, newId);
        return idMap.get(childId)!;
      });
    }
    window.api.collection.save(cloned);
  }

  // Always clone the root item first, pass parentId only if it exists
  const collectionItem = collectionItemMap.get(originalId);
  if (collectionItem) {
    const parentId = hasParent(collectionItem) ? collectionItem.parentId : undefined;
    recursiveClone(originalId, parentId);
  }

  return { newMap, clonedRootId };
}

export type ExportableCollectionItem = CollectionItem & {
  children?: ExportableCollectionItem[];
};

export function getCollectionItemWithChildren(
  map: Map<string, CollectionItem>,
  id: string
): ExportableCollectionItem | null {
  const item = map.get(id);
  if (!item) return null;

  const itemData = { ...item } as ExportableCollectionItem;

  if (hasChildren(item)) {
    if (item.children) {
      itemData.children = item.children
        .map((childId) => getCollectionItemWithChildren(map, childId))
        .filter((child): child is ExportableCollectionItem => child !== null);
    }
  }

  return itemData;
}
