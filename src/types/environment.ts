import { BASE_MODEL_TYPE, type BaseAuditModel } from '@/types/base';

export interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  description: string;
  enabled: boolean;
}

export interface Environment extends BaseAuditModel {
  modelType: 'ENVIRONMENT';
  workspaceId: string;
  name: string;
  isGlobal: boolean;
  variables: EnvironmentVariable[];
}

export const ENVIRONMENT_DEFAULT_VALUES: Omit<Environment, 'id' | 'name' | 'workspaceId'> = {
  modelType: BASE_MODEL_TYPE.ENVIRONMENT,
  isGlobal: false,
  variables: [],
};
