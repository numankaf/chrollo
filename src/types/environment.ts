import { BASE_MODEL_TYPE, type BaseAuditModel } from '@/types/base';

export interface EnvironmentVariable {
  key: string;
  value: string;
  description: string;
  enabled: boolean;
}

export interface Environment extends BaseAuditModel {
  modelType: 'ENVIRONMENT';
  workspaceId: string;
  name: string;
  variables: EnvironmentVariable[];
}

export type EnvironmentFile = {
  environments: Environment[];
};

export const ENVIRONMENT_DEFAULT_VALUES: Omit<Environment, 'id' | 'name' | 'workspaceId'> = {
  modelType: BASE_MODEL_TYPE.ENVIRONMENT,
  variables: [],
};
