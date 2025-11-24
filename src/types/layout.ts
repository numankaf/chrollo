import type { CollectionItem } from '@/types/collection';
import type { Connection } from '@/types/connection';
import type { Environment } from '@/types/environment';
import type { RequestHistory } from '@/types/history';
import type { Workspace } from '@/types/workspace';

export type TabItem = Workspace | Connection | CollectionItem | Environment | RequestHistory;

export interface Tab {
  id: string;
  item: TabItem;
}
