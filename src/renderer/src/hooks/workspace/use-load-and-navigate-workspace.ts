import { use, useCallback } from 'react';
import { AppContext } from '@/provider/app-init-provider';
import useTabsStore from '@/store/tab-store';
import { useNavigate } from 'react-router';

import { useTabNavigation } from '@/hooks/app/use-tab-navigation';

export function useLoadAndNavigateWorkspace() {
  const { loadWorkspace } = use(AppContext);
  const { openTab } = useTabNavigation();

  const navigate = useNavigate();

  const loadAndNavigateWorkspace = useCallback(
    async (workspaceId: string) => {
      await loadWorkspace(workspaceId);
      const { activeTabIdByWorkspace, tabs } = useTabsStore.getState();
      const activeTabId = activeTabIdByWorkspace[workspaceId];
      const tab = tabs.find((tab) => tab.id === activeTabId);
      if (tab) {
        openTab(tab);
      } else {
        navigate('/main/empty');
      }
    },
    [loadWorkspace, openTab, navigate]
  );

  return loadAndNavigateWorkspace;
}
