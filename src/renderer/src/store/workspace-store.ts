import { create } from 'zustand';

import type { Workspace } from '@/types/workspace';

interface WorkspaceStore {
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  createWorkspace: (environment: Workspace) => void;
  updateWorkspace: (environment: Workspace) => void;
  deleteWorkspace: (id: string) => void;
  selectWorkspace: (environment: Workspace | null) => void;
}

const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: [],
  selectedWorkspace: null,

  createWorkspace: (workspace) =>
    set((state) => ({
      workspaces: [...state.workspaces, workspace],
    })),

  updateWorkspace: (workspace) =>
    set((state) => ({
      environments: state.workspaces.map((e) => (e.id === workspace.id ? { ...e, ...workspace } : e)),
      selectedWorkspace:
        state.selectedWorkspace?.id === workspace.id
          ? { ...state.selectedWorkspace, ...workspace }
          : state.selectedWorkspace,
    })),

  deleteWorkspace: (id) =>
    set((state) => ({
      workspaces: state.workspaces.filter((e) => e.id !== id),
      selectedWorkspace: state.selectedWorkspace?.id === id ? null : state.selectedWorkspace,
    })),

  selectWorkspace: (workspace) =>
    set(() => ({
      selectedWorkspace: workspace,
    })),
}));

export default useWorkspaceStore;
