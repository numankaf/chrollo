import useSocketMessageStatusStore from '@/store/socket-message-store';
import { useShallow } from 'zustand/react/shallow';

export function useConnectionMessages(connectionId: string | undefined) {
  const messageMap = useSocketMessageStatusStore(useShallow((state) => state.messageMap));

  if (!connectionId) return [];

  const list = messageMap[connectionId] ?? [];

  // Sort by timestamp (newest → oldest)
  return [...list].sort((a, b) => b.timestamp - a.timestamp);
}
