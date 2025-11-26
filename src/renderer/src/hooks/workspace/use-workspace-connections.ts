import { useMemo } from 'react';
import useConnectionStore from '@/store/connection-store';
import useWorkspaceStore from '@/store/workspace-store';
import { useShallow } from 'zustand/react/shallow';

export function useWorkspaceConnections() {
  const { connections } = useConnectionStore(
    useShallow((state) => ({
      connections: state.connections,
    }))
  );
  const { workspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      workspaceId: state.selectedWorkspace?.id,
    }))
  );

  return useMemo(() => {
    if (!workspaceId) return [];
    return connections.filter((c) => c.workspaceId === workspaceId);
  }, [connections, workspaceId]);
}
