import { nanoid } from 'nanoid';
import { create } from 'zustand';

import { type Connection } from '@/types/connection';

interface ConnectionStore {
  connections: Connection[];
  selectedConnection: Connection | null;
  getConnection: (id: string) => Connection | undefined;
  createConnection: (connection: Connection) => Connection;
  updateConnection: (connection: Connection) => Connection;
  deleteConnection: (id: string) => void;
  selectConnection: (connection: Connection | null) => void;
}

const useConnectionStore = create<ConnectionStore>((set, get) => ({
  connections: [],
  selectedConnection: null,
  getConnection: (id: string) => {
    return get().connections.find((c) => c.id === id)!;
  },
  createConnection: (connection) => {
    const newConnection = { ...connection, id: nanoid(8) };
    set((state) => ({
      connections: [...state.connections, newConnection],
      selectedConnection: newConnection,
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
        selectedConnection:
          state.selectedConnection?.id === connection.id ? updatedConnection : state.selectedConnection,
      };
    });

    return updatedConnection;
  },

  deleteConnection: (id) => {
    set((state) => {
      const newConnections = state.connections.filter((c) => c.id !== id);
      let newSelected = state.selectedConnection;
      if (state.selectedConnection?.id === id) {
        newSelected = newConnections[0] ?? null;
      }
      return { connections: newConnections, selectedConnection: newSelected };
    });
  },

  selectConnection: (connection) => {
    set({ selectedConnection: connection });
  },
}));

export default useConnectionStore;
