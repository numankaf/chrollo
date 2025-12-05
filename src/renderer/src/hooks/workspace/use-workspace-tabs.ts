import { useMemo } from 'react';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { useShallow } from 'zustand/react/shallow';

import { BASE_MODEL_TYPE } from '@/types/base';

export function useWorkspaceTabs() {
  const { tabs } = useTabsStore(
    useShallow((state) => ({
      tabs: state.tabs,
    }))
  );
  const { activeWorkspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
    }))
  );

  return useMemo(() => {
    if (!activeWorkspaceId) return [];

    return tabs.filter((tab) => {
      if (tab.modelType === BASE_MODEL_TYPE.WORKSPACE) {
        return tab.id === activeWorkspaceId;
      }

      return tab.workspaceId === activeWorkspaceId;
    });
  }, [tabs, activeWorkspaceId]);
}
