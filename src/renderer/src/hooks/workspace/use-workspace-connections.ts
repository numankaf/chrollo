import useConnectionStore from '@/store/connection-store';
import { useShallow } from 'zustand/react/shallow';

export function useWorkspaceConnections() {
  const { connections } = useConnectionStore(
    useShallow((state) => ({
      connections: state.connections,
    }))
  );

  return connections;
}
