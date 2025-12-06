import { electronAPI, type ElectronAPI } from '@electron-toolkit/preload';
import type { StompHeaders } from '@stomp/stompjs';
import { contextBridge, ipcRenderer } from 'electron';

import type { CollectionItem } from '@/types/collection';
import type { Connection, ConnectionStatusData, StompConnection } from '@/types/connection';
import type { Environment } from '@/types/environment';
import type { Workspace, WorkspaceFile } from '@/types/workspace';

interface Window {
  electron: ElectronAPI;
  api: unknown;
}

declare const window: Window & typeof globalThis;

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
    save: (workspace: Workspace) => ipcRenderer.invoke('workspaces:save', workspace) as Promise<void>,
    get: (id: string) => ipcRenderer.invoke('workspaces:get', id) as Promise<Workspace | undefined>,
    delete: (id: string) => ipcRenderer.invoke('workspaces:delete', id) as Promise<void>,
    load: () => ipcRenderer.invoke('workspaces:load') as Promise<WorkspaceFile>,
    setActive: (workspaceId: string) => ipcRenderer.invoke('workspaces:setActive', workspaceId) as Promise<void>,
    getActive: () => ipcRenderer.invoke('workspaces:getActive') as Promise<string | undefined>,
  },

  connection: {
    save: (connection: Connection) => ipcRenderer.invoke('connections:save', connection) as Promise<void>,
    get: (id: string) => ipcRenderer.invoke('connections:get', id) as Promise<Connection | undefined>,
    delete: (id: string) => ipcRenderer.invoke('connections:delete', id) as Promise<void>,
    load: () => ipcRenderer.invoke('connections:load') as Promise<Connection[]>,
    clear: () => ipcRenderer.invoke('connections:clear') as Promise<void>,
  },

  collection: {
    save: (collectionItem: CollectionItem) => ipcRenderer.invoke('collections:save', collectionItem) as Promise<void>,
    get: (id: string) => ipcRenderer.invoke('collections:get', id) as Promise<CollectionItem | undefined>,
    delete: (id: string) => ipcRenderer.invoke('collections:delete', id) as Promise<void>,
    load: () => ipcRenderer.invoke('collections:load') as Promise<CollectionItem[]>,
    clear: () => ipcRenderer.invoke('collections:clear') as Promise<void>,
  },

  environment: {
    save: (environment: Environment) => ipcRenderer.invoke('environments:save', environment) as Promise<void>,
    get: (id: string) => ipcRenderer.invoke('environments:get', id) as Promise<Environment | undefined>,
    delete: (id: string) => ipcRenderer.invoke('environments:delete', id) as Promise<void>,
    load: () => ipcRenderer.invoke('environments:load') as Promise<Environment[]>,
    clear: () => ipcRenderer.invoke('environments:clear') as Promise<void>,
  },
};

const listener = {
  stomp: {
    onStatus: (callback: (data: ConnectionStatusData) => void) => {
      const handler = (_: Electron.IpcRendererEvent, data: ConnectionStatusData) => callback(data);
      ipcRenderer.on('stomp:status', handler);
      return () => ipcRenderer.removeListener('stomp:status', handler);
    },
  },

  console: {
    log: (callback: (data: unknown) => void) => {
      const handler = (_: Electron.IpcRendererEvent, data: unknown) => callback(data);
      ipcRenderer.on('console:log', handler);
      return () => ipcRenderer.removeListener('console:log', handler);
    },
  },
};
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
    contextBridge.exposeInMainWorld('listener', listener);
  } catch (error) {
    console.error(error);
  }
} else {
  // fallback for disabled contextIsolation
  window.electron = electronAPI;
  window.api = api;
}
