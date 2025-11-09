import useTabsStore from '@/store/tab-store';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { BASE_MODEL_TYPE } from '@/types/base';
import { COLLECTION_TYPE } from '@/types/collection';
import { CONNECTION_TYPE } from '@/types/connection';
import type { TabItem } from '@/types/layout';

function getTabRoute(item: TabItem): string {
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

export function useTabNavigation() {
  const navigate = useNavigate();
  const { openTab, addTab, closeTab, setActiveTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
      addTab: state.addTab,
      closeTab: state.closeTab,
      setActiveTab: state.setActiveTab,
    }))
  );

  const openAndNavigateToTab = (item: TabItem) => {
    const openedTab = openTab(item);
    navigate(getTabRoute(openedTab.item));
  };

  const addAndNavigateToTab = (item: TabItem) => {
    const addedTab = addTab(item);
    navigate(getTabRoute(addedTab.item));
  };

  const closeTabAndNavigate = (id: string, fallbackRoute = '/') => {
    const closedTab = closeTab(id);
    navigate(closedTab ? getTabRoute(closedTab?.item) : fallbackRoute);
  };

  const setActiveTabAndNavigate = (id: string) => {
    const activatedTab = setActiveTab(id);
    if (activatedTab) navigate(getTabRoute(activatedTab.item));
  };

  return {
    openAndNavigateToTab,
    addAndNavigateToTab,
    closeTabAndNavigate,
    setActiveTabAndNavigate,
  };
}
