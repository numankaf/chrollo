export type CollectionItemType = 'request' | 'folder' | 'collection';

export type CommandType = 'command' | 'query';

export type ConnectionType = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

export interface BaseItem {
  id: string;
  name: string;
  type: CollectionItemType;
}

export interface RequestItem extends BaseItem {
  type: 'request';
  commandType: CommandType;
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
  state: ConnectionType;
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

export type TabItemType = 'connection' | 'collection' | 'history' | 'enviroment';

export interface Tab {
  id: string;
  itemId: string;
  itemType: TabItemType;
  title: string;
}
