import useTabsStore from '@/store/tab-store';
import { nanoid } from 'nanoid';
import { create } from 'zustand';

import type { InterceptionScript } from '@/types/interception-script';

interface InterceptionScriptStore {
  interceptionScripts: InterceptionScript[];
  initInterceptionScriptStore: (interceptionScripts: InterceptionScript[]) => Promise<void>;
  getInterceptionScript: (id: string) => InterceptionScript | undefined;
  createInterceptionScript: (interceptionScript: InterceptionScript) => Promise<InterceptionScript>;
  updateInterceptionScript: (
    interceptionScript: InterceptionScript,
    options?: {
      persist?: boolean;
    }
  ) => Promise<InterceptionScript>;
  deleteInterceptionScript: (id: string) => Promise<void>;
  cloneInterceptionScript: (id: string) => Promise<InterceptionScript>;
  saveInterceptionScript: (interceptionScript: InterceptionScript) => Promise<InterceptionScript>;
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
  createInterceptionScript: async (interceptionScript) => {
    const newInterceptionScript = { ...interceptionScript, id: nanoid() };

    set((state) => ({
      interceptionScripts: [...state.interceptionScripts, newInterceptionScript],
    }));

    await window.api.interceptionScript.save(newInterceptionScript);

    return newInterceptionScript;
  },
  updateInterceptionScript: async (interceptionScript, options = { persist: false }) => {
    const state = get();
    const existing = state.interceptionScripts.find((e) => e.id === interceptionScript.id);

    const updatedInterceptionScript = existing ? { ...existing, ...interceptionScript } : interceptionScript;

    set({
      interceptionScripts: state.interceptionScripts.map((e) =>
        e.id === updatedInterceptionScript.id ? updatedInterceptionScript : e
      ),
    });

    if (options.persist) {
      await window.api.interceptionScript.save(updatedInterceptionScript);
      useTabsStore.getState().setDirtyBeforeSaveByTab(updatedInterceptionScript.id, false);
    }

    return updatedInterceptionScript;
  },

  deleteInterceptionScript: async (id) => {
    const newInterceptionScripts = get().interceptionScripts.filter((e) => e.id !== id);

    await window.api.interceptionScript.delete(id);

    set({ interceptionScripts: newInterceptionScripts });
  },

  cloneInterceptionScript: async (id: string) => {
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

    await window.api.interceptionScript.save(newInterceptionScript);

    set({ interceptionScripts: newInterceptionScripts });

    return newInterceptionScript;
  },

  saveInterceptionScript: async (interceptionScript) => {
    const exists = get().interceptionScripts.some((e) => e.id === interceptionScript.id);
    const updatedInterceptionScript = exists
      ? await get().updateInterceptionScript(interceptionScript, { persist: true })
      : await get().createInterceptionScript(interceptionScript);
    return updatedInterceptionScript;
  },
}));

export default useInterceptionScriptStore;
