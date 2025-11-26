import { BASE_MODEL_TYPE } from '@/types/base';
import { COLLECTION_TYPE } from '@/types/collection';
import { CONNECTION_TYPE } from '@/types/connection';
import type { TabItem } from '@/types/layout';

export function getTabRoute(item: TabItem): string {
  switch (item.modelType) {
    case BASE_MODEL_TYPE.COLLECTION: {
      switch (item.collectionItemType) {
        case COLLECTION_TYPE.COLLECTION:
          return `/collection/${item.id}`;

        case COLLECTION_TYPE.FOLDER:
          return `/collection/folder/${item.id}`;

        case COLLECTION_TYPE.REQUEST:
          return `/collection/folder/request/${item.id}`;

        case COLLECTION_TYPE.REQUEST_RESPONSE:
          return `/collection/folder/request/request-response/${item.id}`;
        default:
          return '/';
      }
    }

    case BASE_MODEL_TYPE.WORKSPACE:
      return `/workspace/${item.id}`;

    case BASE_MODEL_TYPE.CONNECTION:
      switch (item.connectionType) {
        case CONNECTION_TYPE.STOMP:
          return `/connection/stomp/${item.id}`;

        case CONNECTION_TYPE.SOCKETIO:
          return `/connection/socketio/${item.id}`;
        default:
          return '/';
      }

    case BASE_MODEL_TYPE.ENVIRONMENT:
      return `/environment/${item.id}`;

    default:
      return '/';
  }
}
