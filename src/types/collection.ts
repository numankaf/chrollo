import { BASE_MODEL_TYPE, type BaseAuditModel } from '@/types/base';
import type { Header, Scripts } from '@/types/common';
import type { EnvironmentVariable } from '@/types/environment';

export const NULL_PARENT_ID = 'NULL_PARENT_ID';

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
  scripts: Scripts;
  children: string[];
}

export interface Folder extends CollectionItem {
  collectionItemType: 'FOLDER';
  overview?: string;
  scripts: Scripts;
  parentId: string;
  children: string[];
}

export interface RequestBody {
  data: string;
  type: RequestBodyType;
}

export interface Request extends CollectionItem {
  collectionItemType: 'REQUEST';
  documentation?: string;
  destination: string;
  body: RequestBody;
  headers: Header[];
  scripts: Scripts;
  parentId: string;
  children: string[];
}

export interface RequestResponse extends CollectionItem {
  collectionItemType: 'REQUEST_RESPONSE';
  request: Request;
  headers: Header[];
  body: RequestBody;
  parentId: string;
}

export const COLLECTION_DEFAULT_VALUES: Omit<Collection, 'id' | 'name' | 'workspaceId'> = {
  modelType: BASE_MODEL_TYPE.COLLECTION,
  collectionItemType: COLLECTION_TYPE.COLLECTION,
  variables: [],
  children: [],
  scripts: {
    preRequest: '',
    postRequest: '',
  },
};

export const FOLDER_DEFAULT_VALUES: Omit<Folder, 'id' | 'name' | 'workspaceId' | 'parentId'> = {
  modelType: BASE_MODEL_TYPE.COLLECTION,
  collectionItemType: COLLECTION_TYPE.FOLDER,
  children: [],
  scripts: {
    preRequest: '',
    postRequest: '',
  },
};

export const REQUEST_DEFAULT_VALUES: Omit<Request, 'id' | 'name' | 'workspaceId' | 'parentId'> = {
  modelType: BASE_MODEL_TYPE.COLLECTION,
  collectionItemType: COLLECTION_TYPE.REQUEST,
  children: [],
  destination: '',
  documentation: '',
  body: {
    data: '',
    type: REQUEST_BODY_TYPE.JSON,
  },
  headers: [],
  scripts: {
    preRequest: '',
    postRequest: '',
  },
};

export const COLLECTION_TREE_OPEN_STATE_KEY = 'collection-tree-open-state';

export type ExportableCollectionItem = Omit<CollectionItem, 'children'> & {
  children?: ExportableCollectionItem[];
};
