import { nanoid } from 'nanoid';
import { create } from 'zustand';

import { BASE_MODEL_TYPE } from '../types/base';
import { CONNECTION_TYPE, type Connection } from '../types/connection';

interface ConnectionStore {
  connections: Connection[];
  selectedConnection: Connection | null;
  getConnection: (id: string) => Connection | undefined;
  createConnection: (connection: Connection) => void;
  updateConnection: (connection: Connection) => void;
  deleteConnection: (id: string) => void;
  selectConnection: (connection: Connection | null) => void;
}

const useConnectionStore = create<ConnectionStore>((set, get) => ({
  connections: [
    {
      id: nanoid(8),
      workspaceId: nanoid(8),
      name: 'ws-connection-tukks',
      modelType: BASE_MODEL_TYPE.CONNECTION,
      connectionType: CONNECTION_TYPE.STOMP,
    },
  ],
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
  },

  updateConnection: (connection) => {
    set((state) => ({
      connections: state.connections.map((c) => (c.id === connection.id ? { ...c, ...connection } : c)),
      selectedConnection:
        state.selectedConnection?.id === connection.id
          ? { ...state.selectedConnection, ...connection }
          : state.selectedConnection,
    }));
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
