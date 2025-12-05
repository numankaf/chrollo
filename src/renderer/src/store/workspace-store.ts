import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Workspace, WorkspaceFile, WorkspaceSelection, WorkspaceSelectionValue } from '@/types/workspace';

interface WorkspaceStore {
  workspaces: Workspace[];
  activeWorkspaceId: string | undefined;
  workspaceSelection: WorkspaceSelection;

  setWorkspaces: (workspaces: Workspace[]) => void;
  createWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (workspace: Workspace) => void;
  deleteWorkspace: (id: string) => void;
  setActiveWorkspace: (id: string) => void;

  initWorkspaceStore: (workspaceFile: WorkspaceFile) => Promise<void>;
  updateWorkspaceSelection: (values: Partial<WorkspaceSelectionValue>) => void;
}

const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      workspaces: [],
      activeWorkspaceId: undefined,

      workspaceSelection: {},

      setWorkspaces: (workspaces) =>
        set(() => ({
          workspaces,
        })),

      createWorkspace: (workspace) =>
        set((state) => ({
          workspaces: [...state.workspaces, workspace],
        })),

      updateWorkspace: (workspace) =>
        set((state) => ({
          workspaces: state.workspaces.map((e) => (e.id === workspace.id ? { ...e, ...workspace } : e)),
        })),

      deleteWorkspace: (id) =>
        set((state) => {
          return {
            workspaces: state.workspaces.filter((e) => e.id !== id),
          };
        }),

      setActiveWorkspace: (id) =>
        set(() => ({
          activeWorkspaceId: id,
        })),

      initWorkspaceStore: async (workspaceFile) => {
        return new Promise((resolve) => {
          const { activeWorkspaceId, workspaces } = workspaceFile;
          set(() => ({
            activeWorkspaceId: activeWorkspaceId,
            workspaces: workspaces,
          }));
          resolve();
        });
      },

      updateWorkspaceSelection: (values: Partial<WorkspaceSelectionValue>) =>
        set((state) => {
          const workspaceId = state.activeWorkspaceId;
          if (!workspaceId) return {};

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
    }),
    {
      name: 'workspace-store',
      partialize: (state) => ({ workspaceSelection: state.workspaceSelection }),
    }
  )
);

export default useWorkspaceStore;
