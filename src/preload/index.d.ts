import { ElectronAPI } from '@electron-toolkit/preload';

import type { CollectionItem } from '@/types/collection';
import type { Connection } from '@/types/connection';
import type { Environment } from '@/types/environment';
import type { TabsFile } from '@/types/layout';
import type { WorkspaceFile } from '@/types/workspace';

declare global {
  interface Window {
    api: {
      view: {
        minimize: () => void;
        maximize: () => void;
        close: () => void;
        reload: () => void;
      };
      stomp: {
        connect: (connection: StompConnection) => void;
        disconnect: (id: string) => void;
        disconnectAll: () => void;
        subscribe: (id: string, topic: string) => void;
        unsubscribe: (id: string, topic: string) => void;
        send: (data: { id: string; destination: string; body: string; headers?: StompHeaders }) => void;
      };
      workspace: {
        load: () => Promise<WorkspaceFile>;
        save: (workspaceFile: WorkspaceFile) => Promise<void>;
      };
      connection: {
        save: (connection: Connection) => Promise<void>;
        get: (id: string) => Promise<Connection | undefined>;
        delete: (id: string) => Promise<void>;
        list: () => Promise<Connection[]>;
        clear: () => Promise<void>;
      };
      collection: {
        save: (collectionItem: CollectionItem) => Promise<void>;
        get: (id: string) => Promise<CollectionItem | undefined>;
        delete: (id: string) => Promise<void>;
        list: () => Promise<CollectionItem[]>;
        clear: () => Promise<void>;
      };
      tab: {
        load: () => Promise<TabsFile>;
        save: (tabsFile: TabsFile) => Promise<void>;
      };
      environment: {
        save: (environment: Environment) => Promise<void>;
        get: (id: string) => Promise<Environment | undefined>;
        delete: (id: string) => Promise<void>;
        list: () => Promise<Environment[]>;
        clear: () => Promise<void>;
      };
    };
    listener: {
      stomp: {
        onStatus: (callback: (data: ConnectionStatusData) => void) => () => void;
      };
      console: {
        log: (callback: (data: unknown) => void) => () => void;
      };
    };
    electron: ElectronAPI;
  }
}
