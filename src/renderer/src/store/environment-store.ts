import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { getActiveWorkspaceSelection } from '@/utils/workspace-utils';
import { nanoid } from 'nanoid';
import { create } from 'zustand';

import type { Environment, EnvironmentFile } from '@/types/environment';

interface EnvironmentStore {
  environments: Environment[];
  createEnvironment: (environment: Environment) => Environment;
  updateEnvironment: (environment: Environment) => Environment;
  deleteEnvironment: (id: string) => Promise<void>;
  saveEnvironment: (environment: Environment) => Promise<Environment>;
  initEnvironmentStore: (environmentFile: EnvironmentFile) => Promise<void>;
}

const useEnvironmentStore = create<EnvironmentStore>((set, get) => ({
  environments: [],

  createEnvironment: (environment) => {
    const newEnvironment = { ...environment, id: nanoid(8) };
    set((state) => ({
      environments: [...state.environments, newEnvironment],
    }));
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

    return updatedEnvironment;
  },

  deleteEnvironment: async (id) => {
    const newEnvironments = get().environments.filter((e) => e.id !== id);
    const currentActiveEnvironmentId = getActiveWorkspaceSelection('activeEnvironmentId');

    if (currentActiveEnvironmentId === id) {
      useWorkspaceStore.getState().updateWorkspaceSelection({ activeEnvironmentId: undefined });
    }
    useTabsStore.getState().closeTab(id);

    //Save to file system
    await window.api.environment.save({ environments: newEnvironments });
    set({ environments: newEnvironments });
  },

  saveEnvironment: async (environment) => {
    const exists = get().environments.some((e) => e.id === environment.id);
    const updatedEnvironment = exists ? get().updateEnvironment(environment) : get().createEnvironment(environment);

    await window.api.environment.save({ environments: get().environments });

    return updatedEnvironment;
  },
  initEnvironmentStore: (environmentFile) => {
    return new Promise((resolve) => {
      set(() => ({
        environments: environmentFile.environments,
      }));
      resolve();
    });
  },
}));

export default useEnvironmentStore;
