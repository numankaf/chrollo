import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { getActiveWorkspaceSelection } from '@/utils/workspace-util';
import { create } from 'zustand';

import { CONNECTION_TYPE, type Connection } from '@/types/connection';

interface ConnectionStore {
  connections: Connection[];
  initConnectionStore: (connections: Connection[]) => Promise<void>;
  getConnection: (id: string) => Connection | undefined;
  createConnection: (connection: Connection) => Connection;
  // persist will be optional  since this will called many times in the app
  updateConnection: (
    connection: Connection,
    options?: {
      persist?: boolean;
    }
  ) => Connection;
  deleteConnection: (id: string) => void;
  cloneConnection: (id: string) => Connection;
  saveConnection: (connection: Connection) => Connection;
}

const useConnectionStore = create<ConnectionStore>((set, get) => ({
  connections: [],
  initConnectionStore: async (connections: Connection[]) =>
    set(() => {
      return { connections: connections };
    }),
  getConnection: (id: string) => {
    return get().connections.find((c) => c.id === id)!;
  },

  createConnection: (connection) => {
    const newConnection = { ...connection, id: nanoid() };
    set((state) => ({
      connections: [...state.connections, newConnection],
    }));

    window.api.connection.save(newConnection);
    return newConnection;
  },

  updateConnection: (connection, options = { persist: false }) => {
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

    if (options.persist) window.api.connection.save(updatedConnection);
    return updatedConnection;
  },

  deleteConnection: (id) => {
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

    window.api.connection.delete(id);
    set({ connections: newConnections });
  },

  cloneConnection: (id: string) => {
    const state = get();
    const connections = state.connections;
    const index = connections.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Cannot clone connection: no connection found with id "${id}"`);
    }

    const original = connections[index];

    const newConnection = {
      ...original,
      id: nanoid(),
      name: `${original.name} (Copy)`,
    } as Connection;

    const newConnections = [...connections.slice(0, index + 1), newConnection, ...connections.slice(index + 1)];

    set({ connections: newConnections });

    window.api.connection.save(newConnection);

    useTabsStore.getState().openTab(newConnection);
    return newConnection;
  },

  saveConnection: (connection) => {
    const exists = get().connections.some((c) => c.id === connection.id);
    const updatedConnection = exists
      ? get().updateConnection(connection, { persist: true })
      : get().createConnection(connection);
    return updatedConnection;
  },
}));

export default useConnectionStore;
