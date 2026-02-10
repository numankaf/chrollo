import { use, useCallback } from 'react';
import { AppContext } from '@/provider/app-init-provider';
import useTabsStore from '@/store/tab-store';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { useTabNavigation } from '@/hooks/app/use-tab-navigation';

export function useLoadAndNavigateWorkspace() {
  const { loadWorkspace } = use(AppContext);

  const { activeTabIdByWorkspace } = useTabsStore(
    useShallow((state) => ({
      activeTabIdByWorkspace: state.activeTabIdByWorkspace,
    }))
  );
  const { openTab } = useTabNavigation();

  const navigate = useNavigate();

  const loadAndNavigateWorkspace = useCallback(
    async (workspaceId: string) => {
      await loadWorkspace(workspaceId);
      const activeTabId = activeTabIdByWorkspace[workspaceId];
      const tab = useTabsStore.getState().tabs.find((tab) => tab.id === activeTabId);
      if (tab) {
        openTab(tab);
      } else {
        navigate('/main/empty');
      }
    },
    [loadWorkspace, openTab, activeTabIdByWorkspace, navigate]
  );

  return loadAndNavigateWorkspace;
}
