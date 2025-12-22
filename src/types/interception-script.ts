import type { BaseAuditModel } from '@/types/base';

export interface InterceptionScript extends BaseAuditModel {
  modelType: 'INTERCEPTION_SCRIPT';
  workspaceId: string;
  name: string;
  description?: string;
  enabled: boolean;
  script: string;
}
