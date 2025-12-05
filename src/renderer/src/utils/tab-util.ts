import useCollectionItemStore from '@/store/collection-item-store';
import useConnectionStore from '@/store/connection-store';
import useEnvironmentStore from '@/store/environment-store';
import useWorkspaceStore from '@/store/workspace-store';

import { BASE_MODEL_TYPE } from '@/types/base';
import { COLLECTION_TYPE } from '@/types/collection';
import { CONNECTION_TYPE } from '@/types/connection';
import type { Tab, TabItem } from '@/types/layout';

export const scrollToTab = (tabId: string | null) => {
  if (!tabId) return;
  requestAnimationFrame(() => {
    const el = document.querySelector(`[data-tab-id="${tabId}"]`);
    el?.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
  });
};

export function getTabRoute(tab: Tab): string {
  const item = getTabItem(tab);
  switch (item?.modelType) {
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

export function getTabItem(tab: Tab): TabItem | undefined {
  switch (tab.modelType) {
    case BASE_MODEL_TYPE.WORKSPACE:
      return useWorkspaceStore.getState().workspaces.find((w) => w.id === tab.id);
    case BASE_MODEL_TYPE.CONNECTION:
      return useConnectionStore.getState().connections.find((c) => c.id === tab.id);
    case BASE_MODEL_TYPE.COLLECTION:
      return useCollectionItemStore.getState().collectionItemMap.get(tab.id);
    case BASE_MODEL_TYPE.ENVIRONMENT:
      return useEnvironmentStore.getState().environments.find((e) => e.id === tab.id);
    default:
      return undefined;
  }
}
