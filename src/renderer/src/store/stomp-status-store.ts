import { create } from 'zustand';

import type { ConnectionStatus } from '@/types/connection';

interface StompStatusStore {
  statuses: Record<string, ConnectionStatus>;
  setStatus: (id: string, status: ConnectionStatus) => void;
  getStatus: (id: string) => ConnectionStatus | undefined;
}

const useStompStatusStore = create<StompStatusStore>((set, get) => ({
  statuses: {},

  setStatus: (id, status) =>
    set((state) => ({
      statuses: { ...state.statuses, [id]: status },
    })),

  getStatus: (id) => get().statuses[id],
}));

export default useStompStatusStore;
