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
