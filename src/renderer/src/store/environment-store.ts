import { create } from 'zustand';

import type { Environment } from '@/types/environment';

interface EnvironmentStore {
  environments: Environment[];
  selectedEnvironment: Environment | null;
  createEnvironment: (environment: Environment) => void;
  updateEnvironment: (environment: Environment) => void;
  deleteEnvironment: (id: string) => void;
  selectEnvironment: (environment: Environment | null) => void;
}

const useEnvironmentStore = create<EnvironmentStore>((set) => ({
  environments: [],
  selectedEnvironment: null,

  createEnvironment: (environment) =>
    set((state) => ({
      environments: [...state.environments, environment],
    })),

  updateEnvironment: (environment) =>
    set((state) => ({
      environments: state.environments.map((e) => (e.id === environment.id ? { ...e, ...environment } : e)),
      selectedEnvironment:
        state.selectedEnvironment?.id === environment.id
          ? { ...state.selectedEnvironment, ...environment }
          : state.selectedEnvironment,
    })),

  deleteEnvironment: (id) =>
    set((state) => ({
      environments: state.environments.filter((e) => e.id !== id),
      selectedEnvironment: state.selectedEnvironment?.id === id ? null : state.selectedEnvironment,
    })),

  selectEnvironment: (environment) =>
    set(() => ({
      selectedEnvironment: environment,
    })),
}));

export default useEnvironmentStore;
