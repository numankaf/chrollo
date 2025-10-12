import type { CollectionItem } from './collection';
import type { Connection } from './connection';
import type { Environment } from './environment';
import type { RequestHistory } from './history';
import type { Workspace } from './workspace';

export type TabItem = Workspace | Connection | CollectionItem | Environment | RequestHistory;

export interface Tab {
  id: string;
  item: TabItem;
}
