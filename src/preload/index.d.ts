import { ElectronAPI } from '@electron-toolkit/preload';

import type { ConnectionFile } from '@/types/connection';
import type { EnvironmentFile } from '@/types/environment';
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
        load: () => Promise<ConnectionFile>;
        save: (connectionFile: ConnectionFile) => Promise<void>;
      };
      tab: {
        load: () => Promise<TabsFile>;
        save: (tabsFile: TabsFile) => Promise<void>;
      };
      environment: {
        load: () => Promise<EnvironmentFile>;
        save: (environmentFile: EnvironmentFile) => Promise<void>;
      };
    };
    listener: {
      stomp: {
        onStatus: (callback: (data: ConnectionStatusData) => void) => () => void;
      };
    };
    electron: ElectronAPI;
  }
}
