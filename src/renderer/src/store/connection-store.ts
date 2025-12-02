import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { getActiveWorkspaceSelection } from '@/utils/workspace-utils';
import { nanoid } from 'nanoid';
import { create } from 'zustand';

import { CONNECTION_TYPE, type Connection, type ConnectionFile } from '@/types/connection';

interface ConnectionStore {
  connections: Connection[];
  setConnections: (connections: Connection[]) => void;
  getConnection: (id: string) => Connection | undefined;
  createConnection: (connection: Connection) => Connection;
  updateConnection: (connection: Connection) => Connection;
  deleteConnection: (id: string) => Promise<void>;
  cloneConnection: (id: string) => Promise<Connection>;
  saveConnection: (connection: Connection) => Promise<Connection>;
  initConnectionStore: (connectionFile: ConnectionFile) => Promise<void>;
  saveConnectionStore: () => Promise<void>;
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

  deleteConnection: async (id) => {
    const newConnections = get().connections.filter((c) => c.id !== id);
    const currentActiveConnectionId = getActiveWorkspaceSelection('activeConnectionId');

    if (currentActiveConnectionId === id) {
      useWorkspaceStore.getState().updateWorkspaceSelection({ activeConnectionId: undefined });
    }
    useTabsStore.getState().closeTab(id);

    // Close connection on delete
    const connectionToDelete = get().connections.find((c) => c.id === id);
    if (connectionToDelete) {
      switch (connectionToDelete.connectionType) {
        case CONNECTION_TYPE.STOMP: {
          window.api.stomp.disconnect(id);
          break;
        }
        default: {
          break;
        }
      }
    }

    //Save to file system
    await window.api.connection.save({ connections: newConnections });
    set({ connections: newConnections });
  },

  cloneConnection: async (id: string) => {
    const state = get();
    const connections = state.connections;
    const index = connections.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Cannot clone connection: no connection found with id "${id}"`);
    }

    const original = connections[index];

    const newConnection = {
      ...original,
      id: nanoid(8),
      name: `${original.name} (Copy)`,
    } as Connection;

    const newConnections = [...connections.slice(0, index + 1), newConnection, ...connections.slice(index + 1)];

    await get().saveConnectionStore();

    set({ connections: newConnections });

    useTabsStore.getState().openTab(newConnection);
    return newConnection;
  },

  saveConnection: async (connection) => {
    const exists = get().connections.some((c) => c.id === connection.id);
    const updatedConnection = exists ? get().updateConnection(connection) : get().createConnection(connection);

    await window.api.connection.save({ connections: get().connections });

    return updatedConnection;
  },

  initConnectionStore: (connectionFile) => {
    return new Promise((resolve) => {
      set(() => ({
        connections: connectionFile.connections,
      }));
      resolve();
    });
  },

  saveConnectionStore: async () => {
    await window.api.connection.save({ connections: get().connections });
  },
}));

export default useConnectionStore;
