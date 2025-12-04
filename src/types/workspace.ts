import { type BaseAuditModel } from '@/types/base';

export const DEFAULT_WORKSPACE_ID = '__defaultWorkspaceId__';
export const ACTIVE_KEY = '__activeWorkspaceId__';

export const WORKSPACE_TYPE = {
  PUBLIC: 'PUBLIC',
  INTERNAL: 'INTERNAL',
} as const;

export type WorkspaceType = (typeof WORKSPACE_TYPE)[keyof typeof WORKSPACE_TYPE];

export const WORKSPACE_ROLE = {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER',
} as const;

export type WorkspaceRole = (typeof WORKSPACE_ROLE)[keyof typeof WORKSPACE_ROLE];

export interface Workspace extends BaseAuditModel {
  modelType: 'WORKSPACE';
  name: string;
  type: WorkspaceType;
  description: string | null;
}

export type WorkspaceSelectionValue = {
  activeConnectionId?: string | undefined;
  activeEnvironmentId?: string | undefined;
  activeTabId?: string | undefined;
};

export type WorkspaceSelection = Record<string, WorkspaceSelectionValue>;

export type WorkspaceFile = {
  workspaces: Workspace[];
  activeWorkspaceId: string | undefined;
};
