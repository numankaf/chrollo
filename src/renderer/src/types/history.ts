import type { BaseModel } from './base';
import type { Request } from './collection';

export interface RequestHistory extends BaseModel {
  modelType: 'REQUEST_HISTORY';
  workspaceId: string;
  createdBy: string;
  createdDate: string;
  request: Request;
}
