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
  modelType: BaseModelType;
}

export interface BaseAuditModel extends BaseModel {
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
}
