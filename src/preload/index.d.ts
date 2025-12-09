import { ElectronAPI } from '@electron-toolkit/preload';

import type { CollectionItem, Request } from '@/types/collection';
import type { Connection } from '@/types/connection';
import type { Environment } from '@/types/environment';
import type { SocketMessage } from '@/types/socket';
import type { Workspace, WorkspaceFile } from '@/types/workspace';

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
        send: (id: string, data: Request) => void;
      };
      workspace: {
        save: (workspace: Workspace) => Promise<void>;
        get: (id: string) => Promise<Workspace | undefined>;
        delete: (id: string) => Promise<void>;
        load: () => Promise<WorkspaceFile>;
        setActive: (workspaceId: string) => Promise<void>;
        getActive: () => Promise<string | undefined>;
      };
      connection: {
        save: (connection: Connection) => Promise<void>;
        get: (id: string) => Promise<Connection | undefined>;
        delete: (id: string) => Promise<void>;
        load: () => Promise<Connection[]>;
        clear: () => Promise<void>;
      };
      collection: {
        save: (collectionItem: CollectionItem) => Promise<void>;
        get: (id: string) => Promise<CollectionItem | undefined>;
        delete: (id: string) => Promise<void>;
        load: () => Promise<CollectionItem[]>;
        clear: () => Promise<void>;
      };
      environment: {
        save: (environment: Environment) => Promise<void>;
        get: (id: string) => Promise<Environment | undefined>;
        delete: (id: string) => Promise<void>;
        load: () => Promise<Environment[]>;
        clear: () => Promise<void>;
      };
    };
    listener: {
      stomp: {
        onStatus: (callback: (data: ConnectionStatusData) => void) => () => void;
        onMessage: (callback: (data: SocketMessage) => void) => () => void;
      };
      console: {
        log: (callback: (data: unknown) => void) => () => void;
      };
    };
    electron: ElectronAPI;
  }
}
