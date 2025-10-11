import type { BaseAuditModel } from './base';

export interface EnvironmentVariable {
  value: string;
  description: string;
  enabled: boolean;
}

export interface Environment extends BaseAuditModel {
  modelType: 'ENVIRONMENT';
  workspaceId: string;
  name: string;
  variables: Map<string, EnvironmentVariable>;
}
