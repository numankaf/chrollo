import { nanoid } from 'nanoid';
import { create } from 'zustand';
import type { EnviromentItem } from '../types/layout';

interface EnviromentStore {
  enviroments: EnviromentItem[];
  selectedEnviroment: EnviromentItem | null;
  createEnviroment: (enviroment: EnviromentItem) => void;
  updateEnviroment: (enviroment: EnviromentItem) => void;
  deleteEnviroment: (id: string) => void;
  selectEnviroment: (enviroment: EnviromentItem | null) => void;
}

const useEnviromentStore = create<EnviromentStore>((set) => ({
  enviroments: [
    {
      id: nanoid(8),
      name: 'environment-tukks',
      type: 'enviroment',
    },
    {
      id: nanoid(8),
      name: 'environment-tukks-hq200',
      type: 'enviroment',
    },
    {
      id: nanoid(8),
      name: 'environment-ehkks',
      type: 'enviroment',
    },
  ],
  selectedEnviroment: null,

  createEnviroment: (enviroment) =>
    set((state) => ({
      enviroments: [...state.enviroments, enviroment],
    })),

  updateEnviroment: (enviroment) =>
    set((state) => ({
      enviroments: state.enviroments.map((e) => (e.id === enviroment.id ? { ...e, ...enviroment } : e)),
      selectedEnviroment:
        state.selectedEnviroment?.id === enviroment.id
          ? { ...state.selectedEnviroment, ...enviroment }
          : state.selectedEnviroment,
    })),

  deleteEnviroment: (id) =>
    set((state) => ({
      enviroments: state.enviroments.filter((e) => e.id !== id),
      selectedEnviroment: state.selectedEnviroment?.id === id ? null : state.selectedEnviroment,
    })),

  selectEnviroment: (enviroment) =>
    set(() => ({
      selectedEnviroment: enviroment,
    })),
}));

export default useEnviromentStore;
