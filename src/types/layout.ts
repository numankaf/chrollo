export interface BaseItem {
  id: string;
  name: string;
  type: 'request' | 'folder' | 'collection';
}

export interface RequestItem extends BaseItem {
  type: 'request';
  commandType: 'command' | 'query';
  path: string;
}

export interface FolderItem extends BaseItem {
  type: 'folder';
  children: CollectionTreeItem[];
}

export interface CollectionItem extends BaseItem {
  type: 'collection';
  children: CollectionTreeItem[];
}

export type CollectionTreeItem = RequestItem | FolderItem | CollectionItem;

export interface SocketConnetionItem {
  id: string;
  name: string;
  state: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
}

export interface EnviromentItem {
  id: string;
  name: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  requests?: RequestItem[];
}
