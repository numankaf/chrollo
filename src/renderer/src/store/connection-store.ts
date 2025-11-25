import { nanoid } from 'nanoid';
import { create } from 'zustand';

import { type Connection } from '@/types/connection';

interface ConnectionStore {
  connections: Connection[];
  setConnections: (connections: Connection[]) => void;
  getConnection: (id: string) => Connection | undefined;
  createConnection: (connection: Connection) => Connection;
  updateConnection: (connection: Connection) => Connection;
  deleteConnection: (id: string) => void;
  selectedConnection: Connection | null;
  selectConnection: (connection: Connection | null) => void;
  saveConnection: (connection: Connection) => Promise<Connection>;
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
  selectedConnection: null,

  selectConnection: (connection) => {
    set({ selectedConnection: connection });
  },

  saveConnection: async (connection) => {
    const exists = get().connections.some((c) => c.id === connection.id);
    const updatedConnection = exists ? get().updateConnection(connection) : get().createConnection(connection);

    await window.api.connection.save(get().selectedConnection?.id, get().connections);

    return updatedConnection;
  },
}));

export default useConnectionStore;
