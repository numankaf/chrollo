import { create } from 'zustand';

import type { SocketMessage } from '@/types/socket';

interface SocketMessageStatusStore {
  messageMap: Record<string, SocketMessage[]>;

  addMessage: (msg: SocketMessage) => void;
  clearMessages: (connectionId: string) => void;
  clearAll: () => void;
}

const useSocketMessageStatusStore = create<SocketMessageStatusStore>((set) => ({
  messageMap: {},

  addMessage: (msg: SocketMessage) =>
    set((state) => {
      const existing = state.messageMap[msg.connectionId] ?? [];
      return {
        messageMap: {
          ...state.messageMap,
          [msg.connectionId]: [...existing, msg],
        },
      };
    }),

  clearMessages: (connectionId) =>
    set((state) => {
      const next = { ...state.messageMap };
      delete next[connectionId];
      return { messageMap: next };
    }),

  clearAll: () => set({ messageMap: {} }),
}));

export default useSocketMessageStatusStore;
