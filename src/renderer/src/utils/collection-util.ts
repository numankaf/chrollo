import {
  COLLECTION_TYPE,
  type Collection,
  type CollectionItem,
  type Folder,
  type Request,
  type RequestResponse,
} from '@/types/collection';

export function hasChildren(item: CollectionItem): item is Collection | Folder | Request {
  return (
    item.collectionItemType === COLLECTION_TYPE.COLLECTION ||
    item.collectionItemType === COLLECTION_TYPE.FOLDER ||
    item.collectionItemType === COLLECTION_TYPE.REQUEST
  );
}

export function hasParent(item: CollectionItem): item is Folder | Request | RequestResponse {
  return (
    item.collectionItemType === COLLECTION_TYPE.FOLDER ||
    item.collectionItemType === COLLECTION_TYPE.REQUEST ||
    item.collectionItemType === COLLECTION_TYPE.REQUEST_RESPONSE
  );
}

export function deleteItemAndChildren(map: Map<string, CollectionItem>, id: string) {
  const item = map.get(id);
  if (!item) return;

  // Delete all children recursively if item has children
  if (hasChildren(item) && item.children?.length) {
    item.children.forEach((childId) => deleteItemAndChildren(map, childId));
  }

  // Remove this item from its parent's children
  if (hasParent(item)) {
    const parent = map.get(item.parentId);
    if (parent && hasChildren(parent)) {
      parent.children = parent.children.filter((cid) => cid !== id);
      map.set(parent.id, { ...parent });
    }
  }

  //Delete this item from map
  map.delete(id);
}
