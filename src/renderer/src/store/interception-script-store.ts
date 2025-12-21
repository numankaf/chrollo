import useTabsStore from '@/store/tab-store';
import { nanoid } from 'nanoid';
import { create } from 'zustand';

import type { InterceptionScript } from '@/types/interception-script';

interface InterceptionScriptStore {
  interceptionScripts: InterceptionScript[];
  initInterceptionScriptStore: (interceptionScripts: InterceptionScript[]) => Promise<void>;
  getInterceptionScript: (id: string) => InterceptionScript | undefined;
  createInterceptionScript: (interceptionScript: InterceptionScript) => InterceptionScript;
  updateInterceptionScript: (
    interceptionScript: InterceptionScript,
    options?: {
      persist?: boolean;
    }
  ) => InterceptionScript;
  deleteInterceptionScript: (id: string) => void;
  cloneInterceptionScript: (id: string) => InterceptionScript;
  saveInterceptionScript: (interceptionScript: InterceptionScript) => InterceptionScript;
}

const useInterceptionScriptStore = create<InterceptionScriptStore>((set, get) => ({
  interceptionScripts: [],
  initInterceptionScriptStore: async (interceptionScripts: InterceptionScript[]) =>
    set(() => {
      return { interceptionScripts: interceptionScripts };
    }),
  getInterceptionScript: (id: string) => {
    return get().interceptionScripts.find((e) => e.id === id)!;
  },
  createInterceptionScript: (interceptionScript) => {
    const newInterceptionScript = { ...interceptionScript, id: nanoid() };

    set((state) => ({
      interceptionScripts: [...state.interceptionScripts, newInterceptionScript],
    }));

    window.api.interceptionScript.save(newInterceptionScript);

    return newInterceptionScript;
  },
  updateInterceptionScript: (interceptionScript, options = { persist: false }) => {
    let updatedInterceptionScript = interceptionScript;

    set((state) => {
      const existing = state.interceptionScripts.find((e) => e.id === interceptionScript.id);

      if (existing) {
        updatedInterceptionScript = { ...existing, ...interceptionScript };
      }

      return {
        interceptionScripts: state.interceptionScripts.map((e) =>
          e.id === interceptionScript.id ? updatedInterceptionScript : e
        ),
      };
    });

    if (options.persist) window.api.interceptionScript.save(updatedInterceptionScript);

    return updatedInterceptionScript;
  },

  deleteInterceptionScript: (id) => {
    const newInterceptionScripts = get().interceptionScripts.filter((e) => e.id !== id);

    useTabsStore.getState().closeTab(id);

    window.api.interceptionScript.delete(id);
    set({ interceptionScripts: newInterceptionScripts });
  },

  cloneInterceptionScript: (id: string) => {
    const state = get();
    const interceptionScripts = state.interceptionScripts;
    const index = interceptionScripts.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Cannot clone interceptionScript: no interceptionScript found with id "${id}"`);
    }

    const original = interceptionScripts[index];

    const newInterceptionScript = {
      ...original,
      id: nanoid(),
      name: `${original.name} (Copy)`,
    } as InterceptionScript;

    const newInterceptionScripts = [
      ...interceptionScripts.slice(0, index + 1),
      newInterceptionScript,
      ...interceptionScripts.slice(index + 1),
    ];

    window.api.interceptionScript.save(newInterceptionScript);

    set({ interceptionScripts: newInterceptionScripts });

    useTabsStore.getState().openTab(newInterceptionScript);
    return newInterceptionScript;
  },

  saveInterceptionScript: (interceptionScript) => {
    const exists = get().interceptionScripts.some((e) => e.id === interceptionScript.id);
    const updatedInterceptionScript = exists
      ? get().updateInterceptionScript(interceptionScript, { persist: true })
      : get().createInterceptionScript(interceptionScript);
    return updatedInterceptionScript;
  },
}));

export default useInterceptionScriptStore;
