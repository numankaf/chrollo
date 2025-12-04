import type { CollectionItem } from '@/types/collection';
import type { Connection } from '@/types/connection';
import type { Environment } from '@/types/environment';

export const BASE_MODEL_TYPE = {
  WORKSPACE: 'WORKSPACE',
  ENVIRONMENT: 'ENVIRONMENT',
  CONNECTION: 'CONNECTION',
  COLLECTION: 'COLLECTION',
  REQUEST_HISTORY: 'REQUEST_HISTORY',
} as const;

export type BaseModelType = (typeof BASE_MODEL_TYPE)[keyof typeof BASE_MODEL_TYPE];

export interface BaseModel {
  id: string;
  readonly modelType: BaseModelType;
}

export interface BaseAuditModel extends BaseModel {
  readonly createdBy?: string;
  readonly createdDate?: string;
  readonly updatedBy?: string;
  readonly updatedDate?: string;
}

export type BaseItem = Connection | CollectionItem | Environment;
