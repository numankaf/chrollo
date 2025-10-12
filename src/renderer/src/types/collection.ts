import type { BaseAuditModel } from './base';
import type { Header, Scripts } from './common';
import type { EnvironmentVariable } from './environment';

export const COLLECTION_TYPE = {
  COLLECTION: 'COLLECTION',
  FOLDER: 'FOLDER',
  REQUEST: 'REQUEST',
  REQUEST_RESPONSE: 'REQUEST_RESPONSE',
} as const;

export const REQUEST_BODY_TYPE = {
  TEXT: 'TEXT',
  JSON: 'JSON',
} as const;

export type CollectionType = (typeof COLLECTION_TYPE)[keyof typeof COLLECTION_TYPE];

export type RequestBodyType = (typeof REQUEST_BODY_TYPE)[keyof typeof REQUEST_BODY_TYPE];

export interface CollectionItem extends BaseAuditModel {
  modelType: 'COLLECTION';
  workspaceId: string;
  name: string;
  collectionItemType: CollectionType;
}

export interface Collection extends CollectionItem {
  collectionItemType: 'COLLECTION';
  variables: Map<String, EnvironmentVariable>;
  overview: string;
  scripts: Scripts;
  children: string[];
}

export interface Folder extends CollectionItem {
  collectionItemType: 'FOLDER';
  overview?: string;
  scripts?: Scripts;
  parentId?: string;
  children?: string[];
}

export interface RequestHeader extends Header {
  required: boolean;
  deprecated: boolean;
}

export interface RequestBody {
  body: string;
  type: RequestBodyType;
}

export interface Request extends CollectionItem {
  collectionItemType: 'REQUEST';
  documentation: string;
  destination: string;
  body: RequestBody;
  headers: Map<string, RequestHeader>;
  scripts: Scripts;
  parentId: string;
  children: string[];
}

export interface RequestResponse extends CollectionItem {
  collectionItemType: 'REQUEST_RESPONSE';
  request: Request;
  headers: Map<string, RequestHeader>;
  body: RequestBody;
  parentId: string;
}
