import { useMemo } from 'react';
import useEnvironmentStore from '@/store/environment-store';
import useWorkspaceStore from '@/store/workspace-store';
import { useShallow } from 'zustand/react/shallow';

export function useWorkspaceEnvironments() {
  const { environments } = useEnvironmentStore(
    useShallow((state) => ({
      environments: state.environments,
    }))
  );
  const { activeWorkspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
    }))
  );

  return useMemo(() => {
    if (!activeWorkspaceId) return [];
    return environments.filter((e) => e.workspaceId === activeWorkspaceId);
  }, [environments, activeWorkspaceId]);
}
