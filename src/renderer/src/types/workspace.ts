import type { BaseAuditModel } from './base';

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

export interface WorkspaceSettings {}

export interface Workspace extends BaseAuditModel {
  modelType: 'WORKSPACE';
  name: string;
  type: WorkspaceType;
  overview: string;
  settings: WorkspaceSettings;
}
