import { create } from 'zustand';

import type { Environment, EnvironmentFile } from '@/types/environment';

interface EnvironmentStore {
  environments: Environment[];
  createEnvironment: (environment: Environment) => void;
  updateEnvironment: (environment: Environment) => void;
  deleteEnvironment: (id: string) => void;
  initEnvironmentStore: (environmentFile: EnvironmentFile) => Promise<void>;
}

const useEnvironmentStore = create<EnvironmentStore>((set) => ({
  environments: [],

  createEnvironment: (environment) =>
    set((state) => ({
      environments: [...state.environments, environment],
    })),

  updateEnvironment: (environment) =>
    set((state) => ({
      environments: state.environments.map((e) => (e.id === environment.id ? { ...e, ...environment } : e)),
    })),

  deleteEnvironment: (id) =>
    set((state) => ({
      environments: state.environments.filter((e) => e.id !== id),
    })),
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
