import { BASE_MODEL_TYPE, type BaseAuditModel } from '@/types/base';
import type { Header, Scripts } from '@/types/common';
import type { EnvironmentVariable } from '@/types/environment';

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
  variables: EnvironmentVariable[];
  overview?: string;
  scripts?: Scripts;
  children: string[];
}

export interface Folder extends CollectionItem {
  collectionItemType: 'FOLDER';
  overview?: string;
  scripts?: Scripts;
  parentId: string;
  children: string[];
}

export interface RequestHeader extends Header {
  id: string;
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
  headers: RequestHeader[];
  scripts?: Scripts;
  parentId: string;
  children: string[];
}

export interface RequestResponse extends CollectionItem {
  collectionItemType: 'REQUEST_RESPONSE';
  request: Request;
  headers: RequestHeader[];
  body: RequestBody;
  parentId: string;
}

export type CollectionFile = {
  collectionItemMap: Record<string, CollectionItem>;
};

export const COLLECTION_DEFAULT_VALUES: Omit<Collection, 'id' | 'name' | 'workspaceId'> = {
  modelType: BASE_MODEL_TYPE.COLLECTION,
  collectionItemType: COLLECTION_TYPE.COLLECTION,
  variables: [],
  children: [],
};
