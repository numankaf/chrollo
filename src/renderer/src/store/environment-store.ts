import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { getActiveWorkspaceSelection } from '@/utils/workspace-util';
import { nanoid } from 'nanoid';
import { create } from 'zustand';

import type { Environment } from '@/types/environment';

interface EnvironmentStore {
  environments: Environment[];
  initEnvironmentStore: (connections: Environment[]) => Promise<void>;
  getEnvironment: (id: string) => Environment | undefined;
  createEnvironment: (environment: Environment) => Promise<Environment>;
  updateEnvironment: (
    environment: Environment,
    options?: {
      persist?: boolean;
    }
  ) => Promise<Environment>;
  deleteEnvironment: (id: string) => Promise<void>;
  cloneEnvironment: (id: string) => Promise<Environment>;
  saveEnvironment: (environment: Environment) => Promise<Environment>;
}

const useEnvironmentStore = create<EnvironmentStore>((set, get) => ({
  environments: [],
  initEnvironmentStore: async (environments: Environment[]) =>
    set(() => {
      return { environments: environments };
    }),
  getEnvironment: (id: string) => {
    return get().environments.find((e) => e.id === id)!;
  },
  createEnvironment: async (environment) => {
    const newEnvironment = { ...environment, id: nanoid() };

    set((state) => ({
      environments: [...state.environments, newEnvironment],
    }));

    await window.api.environment.save(newEnvironment);

    return newEnvironment;
  },
  updateEnvironment: async (environment, options = { persist: false }) => {
    let updatedEnvironment = environment;

    set((state) => {
      const existing = state.environments.find((e) => e.id === environment.id);

      if (existing) {
        updatedEnvironment = { ...existing, ...environment };
      }

      return {
        environments: state.environments.map((e) => (e.id === environment.id ? updatedEnvironment : e)),
      };
    });

    if (options.persist) {
      await window.api.environment.save(updatedEnvironment);
      useTabsStore.getState().setDirtyBeforeSaveByTab(updatedEnvironment.id, false);
    }

    return updatedEnvironment;
  },

  deleteEnvironment: async (id) => {
    const newEnvironments = get().environments.filter((e) => e.id !== id);
    const currentActiveEnvironmentId = getActiveWorkspaceSelection('activeEnvironmentId');

    if (currentActiveEnvironmentId === id) {
      useWorkspaceStore.getState().updateWorkspaceSelection({ activeEnvironmentId: undefined });
    }

    await window.api.environment.delete(id);

    useTabsStore.getState().closeTab(id);

    set({ environments: newEnvironments });
  },

  cloneEnvironment: async (id: string) => {
    const state = get();
    const environments = state.environments;
    const index = environments.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Cannot clone environment: no environment found with id "${id}"`);
    }

    const original = environments[index];

    const newEnvironment = {
      ...original,
      id: nanoid(),
      name: `${original.name} (Copy)`,
    } as Environment;

    const newEnvironments = [...environments.slice(0, index + 1), newEnvironment, ...environments.slice(index + 1)];

    await window.api.environment.save(newEnvironment);

    set({ environments: newEnvironments });

    useTabsStore.getState().openTab(newEnvironment);
    return newEnvironment;
  },

  saveEnvironment: async (environment) => {
    const exists = get().environments.some((e) => e.id === environment.id);
    const updatedEnvironment = exists
      ? await get().updateEnvironment(environment, { persist: true })
      : await get().createEnvironment(environment);
    return updatedEnvironment;
  },
}));

export default useEnvironmentStore;
