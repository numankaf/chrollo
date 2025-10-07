import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import useTabsStore from '../store/tab-store';
import type { TabItem } from '../types/layout';

function getTabRoute(item: TabItem): string {
  switch (item.type) {
    case 'collection':
      return `/collection/${item.id}`;
    case 'connection':
      return `/connection/${item.id}`;
    case 'folder':
      return `/collection/folder/${item.id}`;
    case 'request':
      return `/collection/folder/request/${item.id}`;
    case 'environment':
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
