import { nanoid } from 'nanoid';
import { create } from 'zustand';
import type { SocketConnetionItem } from '../types/layout';

interface ConnectionStore {
  connections: SocketConnetionItem[];
  selectedConnection: SocketConnetionItem | null;
  getConnection: (id: string) => SocketConnetionItem | undefined;
  createConnection: (connection: SocketConnetionItem) => void;
  updateConnection: (connection: SocketConnetionItem) => void;
  deleteConnection: (id: string) => void;
  selectConnection: (connection: SocketConnetionItem | null) => void;
}

const useConnectionStore = create<ConnectionStore>((set, get) => ({
  connections: [
    {
      id: nanoid(8),
      name: 'ws-connection-tukks',
      state: 'connected',
      type: 'connection',
    },
    {
      id: nanoid(8),
      name: 'ws-connection-tukks-hq200',
      state: 'idle',
      type: 'connection',
    },
    {
      id: nanoid(8),
      name: 'ws-connection-ehkks',
      state: 'error',
      type: 'connection',
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
