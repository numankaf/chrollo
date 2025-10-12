import { COLLECTION_TYPE, type CollectionItem } from '../types/collection';

export function hasChildren(item: CollectionItem): item is CollectionItem & { children: string[] } {
  return (
    item.collectionItemType === COLLECTION_TYPE.COLLECTION ||
    item.collectionItemType === COLLECTION_TYPE.FOLDER ||
    item.collectionItemType === COLLECTION_TYPE.REQUEST
  );
}
