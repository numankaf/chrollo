import { create } from 'zustand';

import type { SocketMessage } from '@/types/socket';

interface SocketMessageStatusStore {
  messageMap: Record<string, SocketMessage[]>;

  addMessage: (msg: SocketMessage) => void;
  removeMessage: (connectionId: string, messageId: number) => void;
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

  removeMessage: (connectionId, messageId) =>
    set((state) => {
      const existing = state.messageMap[connectionId] ?? [];
      return {
        messageMap: {
          ...state.messageMap,
          [connectionId]: existing.filter((m) => m.id !== messageId),
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
