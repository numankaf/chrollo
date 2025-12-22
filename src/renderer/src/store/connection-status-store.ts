import { create } from 'zustand';

import type { ConnectionStatus } from '@/types/connection';

interface ConnectionStatusStore {
  statuses: Record<string, ConnectionStatus>;
  setStatus: (id: string, status: ConnectionStatus) => void;
  getStatus: (id: string) => ConnectionStatus | undefined;
}

const useConnectionStatusStore = create<ConnectionStatusStore>((set, get) => ({
  statuses: {},

  setStatus: (id, status) =>
    set((state) => ({
      statuses: { ...state.statuses, [id]: status },
    })),

  getStatus: (id) => get().statuses[id],
}));

export default useConnectionStatusStore;
