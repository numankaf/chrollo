import { useCallback } from 'react';
import useTabsStore from '@/store/tab-store';
import { getTabRoute } from '@/utils/tab-util';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import type { Tab } from '@/types/layout';

export function useTabNavigation() {
  const navigate = useNavigate();

  const { openTab, closeTab, addTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
      closeTab: state.closeTab,
      addTab: state.addTab,
    }))
  );

  const navigateToTab = useCallback(
    (tab: Tab | null | undefined) => {
      const route = getTabRoute(tab);
      navigate(route);
    },
    [navigate]
  );

  const addAndNavigate = useCallback(
    (tab: Tab) => {
      const newTab = addTab(tab);
      navigateToTab(newTab);
      return newTab;
    },
    [addTab, navigateToTab]
  );

  const openAndNavigate = useCallback(
    (tab: Tab) => {
      const targetTab = openTab(tab);
      navigateToTab(targetTab);
      return targetTab;
    },
    [openTab, navigateToTab]
  );

  const closeAndNavigate = useCallback(
    (tabId: string) => {
      const closedTo = closeTab(tabId);
      navigateToTab(closedTo);
      return closedTo;
    },
    [closeTab, navigateToTab]
  );

  return {
    addTab: addAndNavigate,
    openTab: openAndNavigate,
    closeTab: closeAndNavigate,
  };
}
