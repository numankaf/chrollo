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
  const { workspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      workspaceId: state.selectedWorkspace?.id,
    }))
  );

  return useMemo(() => {
    if (!workspaceId) return [];
    return environments.filter((e) => e.workspaceId === workspaceId);
  }, [environments, workspaceId]);
}
