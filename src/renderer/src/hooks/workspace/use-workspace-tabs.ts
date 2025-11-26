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
  const { workspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      workspaceId: state.selectedWorkspace?.id,
    }))
  );

  return useMemo(() => {
    if (!workspaceId) return [];

    return tabs.filter((tab) => {
      if (tab.item.modelType === BASE_MODEL_TYPE.WORKSPACE) {
        return tab.id === workspaceId;
      }

      return tab.item.workspaceId === workspaceId;
    });
  }, [tabs, workspaceId]);
}
