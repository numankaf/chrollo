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
  const { activeWorkspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
    }))
  );

  return useMemo(() => {
    if (!activeWorkspaceId) return [];
    return connections.filter((c) => c.workspaceId === activeWorkspaceId);
  }, [connections, activeWorkspaceId]);
}
