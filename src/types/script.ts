import type { BaseAuditModel } from '@/types/base';

export interface Script extends BaseAuditModel {
  modelType: 'SCRIPT';
  workspaceId: string;
  name: string;
}
