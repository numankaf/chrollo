import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import useTabsStore from '../store/tab-store';
import type { TabItem } from '../types/layout';

export function useTabNavigation() {
  const navigate = useNavigate();
  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );

  const openAndNavigateToTab = (item: TabItem) => {
    openTab(item);

    switch (item.type) {
      case 'collection':
        navigate(`/collection/${item.id}`);
        break;
      case 'connection':
        navigate(`/connection/${item.id}`);
        break;
      case 'folder':
        navigate(`/collection/folder/${item.id}`);
        break;
      case 'request':
        navigate(`/collection/folder/request/${item.id}`);
        break;
      case 'enviroment':
        navigate(`/enviroment/${item.id}`);
        break;
    }
  };

  return { openAndNavigateToTab };
}
