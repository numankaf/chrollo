import { electronAPI } from '@electron-toolkit/preload';
import type { StompHeaders } from '@stomp/stompjs';
import { contextBridge, ipcRenderer } from 'electron';

import type { ConnectionFile, StompConnection } from '@/types/connection';
import type { EnvironmentFile } from '@/types/environment';
import type { TabsFile } from '@/types/layout';
import type { WorkspaceFile } from '@/types/workspace';

const api = {
  view: {
    minimize: () => ipcRenderer.send('view:minimize'),
    maximize: () => ipcRenderer.send('view:maximize'),
    close: () => ipcRenderer.send('view:close'),
    reload: () => ipcRenderer.send('view:reload'),
  },

  stomp: {
    connect: (connection: StompConnection) => ipcRenderer.send('stomp:connect', connection),

    disconnect: (id: string) => ipcRenderer.send('stomp:disconnect', id),

    disconnectAll: () => ipcRenderer.send('stomp:disconnectAll'),

    subscribe: (id: string, topic: string) => ipcRenderer.send('stomp:subscribe', { id, topic }),

    unsubscribe: (id: string, topic: string) => ipcRenderer.send('stomp:unsubscribe', { id, topic }),

    send: (data: { id: string; destination: string; body: string; headers?: StompHeaders }) =>
      ipcRenderer.send('stomp:send', data),
  },
  workspace: {
    load: () => ipcRenderer.invoke('workspaces:load') as Promise<WorkspaceFile>,
    save: (workspaceFile: WorkspaceFile) => ipcRenderer.invoke('workspaces:save', workspaceFile),
  },
  connection: {
    load: () => ipcRenderer.invoke('connections:load') as Promise<ConnectionFile>,
    save: (connectionFile: ConnectionFile) => ipcRenderer.invoke('connections:save', connectionFile),
  },
  tab: {
    load: () => ipcRenderer.invoke('tabs:load') as Promise<TabsFile>,
    save: (tabsFile: TabsFile) => ipcRenderer.invoke('tabs:save', tabsFile),
  },
  environment: {
    load: () => ipcRenderer.invoke('environments:load') as Promise<EnvironmentFile>,
    save: (environmentFile: EnvironmentFile) => ipcRenderer.invoke('environments:save', environmentFile),
  },
};
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // fallback for disabled contextIsolation
  window.electron = electronAPI;
  window.api = api;
}
