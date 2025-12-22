import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { disconnectStomp } from '@/utils/stomp-util';
import { getActiveWorkspaceSelection } from '@/utils/workspace-util';
import { nanoid } from 'nanoid';
import { create } from 'zustand';

import { CONNECTION_TYPE, type Connection } from '@/types/connection';

interface ConnectionStore {
  connections: Connection[];
  initConnectionStore: (connections: Connection[]) => Promise<void>;
  getConnection: (id: string) => Connection | undefined;
  createConnection: (connection: Connection) => Promise<Connection>;
  // persist will be optional  since this will called many times in the app
  updateConnection: (
    connection: Connection,
    options?: {
      persist?: boolean;
    }
  ) => Promise<Connection>;
  deleteConnection: (id: string) => Promise<void>;
  cloneConnection: (id: string) => Promise<Connection>;
  saveConnection: (connection: Connection) => Promise<Connection>;
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

  createConnection: async (connection) => {
    const newConnection = { ...connection, id: nanoid() };
    set((state) => ({
      connections: [...state.connections, newConnection],
    }));

    await window.api.connection.save(newConnection);
    return newConnection;
  },

  updateConnection: async (connection, options = { persist: false }) => {
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

    if (options.persist) {
      await window.api.connection.save(updatedConnection);
      useTabsStore.getState().setDirtyBeforeSaveByTab(updatedConnection.id, false);
    }
    return updatedConnection;
  },

  deleteConnection: async (id) => {
    const newConnections = get().connections.filter((c) => c.id !== id);
    const currentActiveConnectionId = getActiveWorkspaceSelection('activeConnectionId');

    if (currentActiveConnectionId === id) {
      useWorkspaceStore.getState().updateWorkspaceSelection({ activeConnectionId: undefined });
    }

    // Close connection on delete
    const connectionToDelete = get().connections.find((c) => c.id === id);
    if (connectionToDelete) {
      switch (connectionToDelete.connectionType) {
        case CONNECTION_TYPE.STOMP: {
          disconnectStomp(id);
          break;
        }
        default: {
          break;
        }
      }
    }

    await window.api.connection.delete(id);

    useTabsStore.getState().closeTab(id);

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
      id: nanoid(),
      name: `${original.name} (Copy)`,
    } as Connection;

    const newConnections = [...connections.slice(0, index + 1), newConnection, ...connections.slice(index + 1)];

    set({ connections: newConnections });

    await window.api.connection.save(newConnection);

    useTabsStore.getState().openTab(newConnection);
    return newConnection;
  },

  saveConnection: async (connection) => {
    const exists = get().connections.some((c) => c.id === connection.id);
    const updatedConnection = exists
      ? await get().updateConnection(connection, { persist: true })
      : await get().createConnection(connection);
    return updatedConnection;
  },
}));

export default useConnectionStore;
