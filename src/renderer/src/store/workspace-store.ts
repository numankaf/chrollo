import useTabsStore from '@/store/tab-store';
import { create } from 'zustand';

import type { Workspace, WorkspaceFile, WorkspaceSelection, WorkspaceSelectionValue } from '@/types/workspace';

interface WorkspaceStore {
  workspaces: Workspace[];
  activeWorkspaceId: string | undefined;
  workspaceSelection: WorkspaceSelection;

  setWorkspaces: (workspaces: Workspace[]) => void;
  createWorkspace: (workspace: Workspace) => Promise<Workspace>;
  updateWorkspace: (workspace: Workspace, options?: { persist?: boolean }) => Promise<Workspace>;
  deleteWorkspace: (id: string) => Promise<void>;
  setActiveWorkspace: (id: string | undefined) => Promise<void>;

  initWorkspaceStore: (workspaceFile: WorkspaceFile) => Promise<void>;
  updateWorkspaceSelection: (values: Partial<WorkspaceSelectionValue>) => void;
  saveWorkspace: (workspace: Workspace) => Promise<Workspace>;
}

const useWorkspaceStore = create<WorkspaceStore>()((set, get) => ({
  workspaces: [],
  activeWorkspaceId: undefined,

  workspaceSelection: {},

  setWorkspaces: (workspaces) =>
    set(() => ({
      workspaces,
    })),

  createWorkspace: async (workspace) => {
    set((state) => ({
      workspaces: [...state.workspaces, workspace],
    }));
    await window.api.workspace.save(workspace);
    return workspace;
  },

  updateWorkspace: async (workspace, options = { persist: false }) => {
    let updatedWorkspace = workspace;
    set((state) => {
      const existing = state.workspaces.find((e) => e.id === workspace.id);
      if (existing) {
        updatedWorkspace = { ...existing, ...workspace };
      }
      return {
        workspaces: state.workspaces.map((e) => (e.id === workspace.id ? updatedWorkspace : e)),
      };
    });
    if (options.persist) {
      await window.api.workspace.save(updatedWorkspace);
    }
    return updatedWorkspace;
  },

  saveWorkspace: async (workspace) => {
    const exists = get().workspaces.some((e) => e.id === workspace.id);
    if (exists) {
      return await get().updateWorkspace(workspace, { persist: true });
    } else {
      return await get().createWorkspace(workspace);
    }
  },

  deleteWorkspace: async (id) => {
    const isActive = get().activeWorkspaceId === id;
    await window.api.workspace.delete(id);
    useTabsStore.getState().deleteTabsByWorkspaceId(id);

    if (isActive) {
      await get().setActiveWorkspace(undefined);
    }

    set((state) => {
      return {
        workspaces: state.workspaces.filter((e) => e.id !== id),
      };
    });
  },

  setActiveWorkspace: async (id) => {
    await window.api.workspace.setActive(id);
    set(() => ({
      activeWorkspaceId: id,
    }));
  },

  initWorkspaceStore: async (workspaceFile) => {
    return new Promise((resolve) => {
      const { activeWorkspaceId, workspaces, workspaceSelection } = workspaceFile;
      set(() => ({
        activeWorkspaceId: activeWorkspaceId,
        workspaces: workspaces,
        workspaceSelection: workspaceSelection,
      }));
      resolve();
    });
  },

  updateWorkspaceSelection: (values: Partial<WorkspaceSelectionValue>) =>
    set((state) => {
      const workspaceId = state.activeWorkspaceId;
      if (!workspaceId) return {};

      window.api.workspace.updateSelection(workspaceId, values);

      return {
        workspaceSelection: {
          ...state.workspaceSelection,
          [workspaceId]: {
            ...(state.workspaceSelection[workspaceId] ?? {}),
            ...values,
          },
        },
      };
    }),
}));

export default useWorkspaceStore;
