export type ItemType = 'request' | 'folder' | 'collection' | 'connection' | 'environment';

export type CommandType = 'command' | 'query';

export type ConnectionType = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

export interface BaseItem {
  id: string;
  name: string;
  type: ItemType;
}

export interface RequestItem extends BaseItem {
  type: 'request';
  commandType: CommandType;
  path: string;
}

export interface FolderItem extends BaseItem {
  type: 'folder';
  children?: CollectionTreeItem[];
}

export interface CollectionItem extends BaseItem {
  type: 'collection';
  children?: CollectionTreeItem[];
}

export type CollectionTreeItem = RequestItem | FolderItem | CollectionItem;

export interface SocketConnetionItem extends BaseItem {
  state: ConnectionType;
  type: 'connection';
}

export interface EnvironmentItem extends BaseItem {
  type: 'environment';
}

export interface HistoryItem {
  id: string;
  date: string;
  requests?: RequestItem[];
}

export type TabItem = RequestItem | FolderItem | CollectionItem | SocketConnetionItem | EnvironmentItem;

export interface Tab {
  id: string;
  item: TabItem;
}
