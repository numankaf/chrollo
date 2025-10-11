import type { BaseModel } from './base';
import type { Request } from './collection';

export interface RequestHistory extends BaseModel {
  workspaceId: string;
  createdBy: string;
  createdDate: string;
  request: Request;
}
