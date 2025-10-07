import { nanoid } from 'nanoid';
import { create } from 'zustand';
import type { EnvironmentItem } from '../types/layout';

interface EnvironmentStore {
  environments: EnvironmentItem[];
  selectedEnvironment: EnvironmentItem | null;
  createEnvironment: (environment: EnvironmentItem) => void;
  updateEnvironment: (environment: EnvironmentItem) => void;
  deleteEnvironment: (id: string) => void;
  selectEnvironment: (environment: EnvironmentItem | null) => void;
}

const useEnvironmentStore = create<EnvironmentStore>((set) => ({
  environments: [
    {
      id: nanoid(8),
      name: 'environment-tukks',
      type: 'environment',
    },
    {
      id: nanoid(8),
      name: 'environment-tukks-hq200',
      type: 'environment',
    },
    {
      id: nanoid(8),
      name: 'environment-ehkks',
      type: 'environment',
    },
  ],
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
