type Handler = () => void;

const listeners = new Map<string, Set<Handler>>();

export const commandBus = {
  on(command: string, handler: Handler) {
    if (!listeners.has(command)) {
      listeners.set(command, new Set());
    }
    listeners.get(command)!.add(handler);

    return () => listeners.get(command)?.delete(handler);
  },

  emit(command: string) {
    listeners.get(command)?.forEach((handler) => handler());
  },
};
