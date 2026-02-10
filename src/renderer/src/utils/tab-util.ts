import useCollectionItemStore from '@/store/collection-item-store';
import useConnectionStore from '@/store/connection-store';
import useEnvironmentStore from '@/store/environment-store';
import useInterceptionScriptStore from '@/store/interception-script-store';
import useWorkspaceStore from '@/store/workspace-store';
import { hasParent } from '@/utils/collection-util';

import { BASE_MODEL_TYPE } from '@/types/base';
import { COLLECTION_TYPE, type CollectionItem } from '@/types/collection';
import { CONNECTION_TYPE } from '@/types/connection';
import type { Tab, TabItem } from '@/types/layout';

export const scrollToTab = (tabId: string | null) => {
  if (!tabId) return;
  requestAnimationFrame(() => {
    const el = document.querySelector(`[data-tab-id="${tabId}"]`);
    el?.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
  });
};

export function getTabRoute(tab: Tab | null | undefined): string {
  const item = tab ? getTabItem(tab) : null;

  if (!item) return '/main/empty';

  switch (item.modelType) {
    case BASE_MODEL_TYPE.COLLECTION: {
      switch (item.collectionItemType) {
        case COLLECTION_TYPE.COLLECTION:
          return `/main/collection/${item.id}`;

        case COLLECTION_TYPE.FOLDER:
          return `/main/collection/folder/${item.id}`;

        case COLLECTION_TYPE.REQUEST:
          return `/main/collection/folder/request/${item.id}`;

        case COLLECTION_TYPE.REQUEST_RESPONSE:
          return `/main/collection/folder/request/request-response/${item.id}`;

        default:
          return '/main/empty';
      }
    }

    case BASE_MODEL_TYPE.WORKSPACE:
      return `/main/workspace/${item.id}`;

    case BASE_MODEL_TYPE.CONNECTION:
      switch (item.connectionType) {
        case CONNECTION_TYPE.STOMP:
          return `/main/connection/stomp/${item.id}`;

        case CONNECTION_TYPE.SOCKETIO:
          return `/main/connection/socketio/${item.id}`;

        default:
          return '/main/empty';
      }

    case BASE_MODEL_TYPE.ENVIRONMENT:
      return `/main/environment/${item.id}`;

    case BASE_MODEL_TYPE.INTERCEPTION_SCRIPT:
      return `/main/interception-script/${item.id}`;

    default:
      return '/main/empty';
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

    case BASE_MODEL_TYPE.INTERCEPTION_SCRIPT:
      return useInterceptionScriptStore.getState().interceptionScripts.find((e) => e.id === tab.id);

    default:
      return undefined;
  }
}

export async function getPersistedTabItem(tab: Tab) {
  switch (tab.modelType) {
    case BASE_MODEL_TYPE.WORKSPACE:
      return window.api.workspace.get(tab.id);

    case BASE_MODEL_TYPE.CONNECTION:
      return window.api.connection.get(tab.id);

    case BASE_MODEL_TYPE.COLLECTION:
      return window.api.collection.get(tab.id);

    case BASE_MODEL_TYPE.ENVIRONMENT:
      return window.api.environment.get(tab.id);

    case BASE_MODEL_TYPE.INTERCEPTION_SCRIPT:
      return window.api.interceptionScript.get(tab.id);

    default:
      return undefined;
  }
}

export function getTabBreadcrumbs(tab: Tab) {
  const getCollectionItemChain = (item: CollectionItem): CollectionItem[] => {
    if (!hasParent(item) || (hasParent(item) && !item.parentId)) return [item];

    const parent = useCollectionItemStore.getState().collectionItemMap.get(item.parentId);
    if (parent) {
      return [...getCollectionItemChain(parent), item];
    }

    return [item];
  };

  switch (tab.modelType) {
    case BASE_MODEL_TYPE.COLLECTION: {
      const tabItem = getTabItem(tab);
      if (!tabItem) return [];
      return getCollectionItemChain(tabItem as CollectionItem);
    }
    default:
      return [tab];
  }
}

export function getNextTab(tabs: Tab[], activeTabId?: string) {
  if (!tabs.length || !activeTabId) return null;

  const index = tabs.findIndex((t) => t.id === activeTabId);
  if (index === -1) return null;

  return tabs[(index + 1) % tabs.length];
}

export function getPreviousTab(tabs: Tab[], activeTabId?: string) {
  if (!tabs.length || !activeTabId) return null;

  const index = tabs.findIndex((t) => t.id === activeTabId);
  if (index === -1) return null;

  return tabs[(index - 1 + tabs.length) % tabs.length];
}
