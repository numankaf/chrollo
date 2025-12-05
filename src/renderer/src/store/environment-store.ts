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
  createEnvironment: (environment: Environment) => Environment;
  updateEnvironment: (environment: Environment) => Environment;
  deleteEnvironment: (id: string) => void;
  cloneEnvironment: (id: string) => Environment;
  saveEnvironment: (environment: Environment) => Environment;
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
  createEnvironment: (environment) => {
    const newEnvironment = { ...environment, id: nanoid(8) };

    set((state) => ({
      environments: [...state.environments, newEnvironment],
    }));

    window.api.environment.save(newEnvironment);

    return newEnvironment;
  },
  updateEnvironment: (environment) => {
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

    window.api.environment.save(updatedEnvironment);

    return updatedEnvironment;
  },

  deleteEnvironment: (id) => {
    const newEnvironments = get().environments.filter((e) => e.id !== id);
    const currentActiveEnvironmentId = getActiveWorkspaceSelection('activeEnvironmentId');

    if (currentActiveEnvironmentId === id) {
      useWorkspaceStore.getState().updateWorkspaceSelection({ activeEnvironmentId: undefined });
    }
    useTabsStore.getState().closeTab(id);

    window.api.environment.delete(id);
    set({ environments: newEnvironments });
  },

  cloneEnvironment: (id: string) => {
    const state = get();
    const environments = state.environments;
    const index = environments.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Cannot clone environment: no environment found with id "${id}"`);
    }

    const original = environments[index];

    const newEnvironment = {
      ...original,
      id: nanoid(8),
      name: `${original.name} (Copy)`,
    } as Environment;

    const newEnvironments = [...environments.slice(0, index + 1), newEnvironment, ...environments.slice(index + 1)];

    window.api.environment.save(newEnvironment);

    set({ environments: newEnvironments });

    useTabsStore.getState().openTab(newEnvironment);
    return newEnvironment;
  },

  saveEnvironment: (environment) => {
    const exists = get().environments.some((e) => e.id === environment.id);
    const updatedEnvironment = exists ? get().updateEnvironment(environment) : get().createEnvironment(environment);
    return updatedEnvironment;
  },
}));

export default useEnvironmentStore;
