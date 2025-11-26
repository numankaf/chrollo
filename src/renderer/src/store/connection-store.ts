import useWorkspaceStore from '@/store/workspace-store';
import { getActiveWorkspaceSelection } from '@/utils/workspace-utils';
import { nanoid } from 'nanoid';
import { create } from 'zustand';

import { type Connection, type ConnectionFile } from '@/types/connection';

interface ConnectionStore {
  connections: Connection[];
  setConnections: (connections: Connection[]) => void;
  getConnection: (id: string) => Connection | undefined;
  createConnection: (connection: Connection) => Connection;
  updateConnection: (connection: Connection) => Connection;
  deleteConnection: (id: string) => void;
  saveConnection: (connection: Connection) => Promise<Connection>;
  initConnectionStore: (connectionFile: ConnectionFile) => void;
}

const useConnectionStore = create<ConnectionStore>((set, get) => ({
  connections: [],
  setConnections: (connections) => set({ connections }),
  getConnection: (id: string) => {
    return get().connections.find((c) => c.id === id)!;
  },
  createConnection: (connection) => {
    const newConnection = { ...connection, id: nanoid(8) };
    set((state) => ({
      connections: [...state.connections, newConnection],
    }));

    return newConnection;
  },

  updateConnection: (connection) => {
    let updatedConnection = connection;

    set((state) => {
      const existing = state.connections.find((c) => c.id === connection.id);

      if (existing) {
        updatedConnection = { ...existing, ...connection };
      }

      return {
        connections: state.connections.map((c) => (c.id === connection.id ? updatedConnection : c)),
      };
    });

    return updatedConnection;
  },

  deleteConnection: (id) => {
    set((state) => {
      const newConnections = state.connections.filter((c) => c.id !== id);
      const currentActiveConnectionId = getActiveWorkspaceSelection('activeConnectionId');

      let newSelectedId = currentActiveConnectionId as string;
      if (currentActiveConnectionId === id) {
        newSelectedId = newConnections[0]?.id ?? undefined;
      }
      useWorkspaceStore.getState().updateWorkspaceSelection({ activeConnectionId: newSelectedId });
      return { connections: newConnections };
    });
  },

  saveConnection: async (connection) => {
    const exists = get().connections.some((c) => c.id === connection.id);
    const updatedConnection = exists ? get().updateConnection(connection) : get().createConnection(connection);

    await window.api.connection.save({ connections: get().connections });

    return updatedConnection;
  },
  initConnectionStore: (connectionFile) => set(() => ({ connections: connectionFile.connections })),
}));

export default useConnectionStore;
