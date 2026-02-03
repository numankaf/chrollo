import { electronAPI, type ElectronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';

import type { CollectionItem, Request } from '@/types/collection';
import type { Connection, ConnectionStatusData, StompConnection } from '@/types/connection';
import type { Environment } from '@/types/environment';
import type { InterceptionScript } from '@/types/interception-script';
import type { RequestPendingEvent, RequestResolvedEvent } from '@/types/request-response';
import type { SocketMessage } from '@/types/socket';
import type { Workspace, WorkspaceFile, WorkspaceSelectionValue } from '@/types/workspace';

interface Window {
  electron: ElectronAPI;
  api: unknown;
}

declare const window: Window & typeof globalThis;

const api = {
  about: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
    arch: process.arch,
    platform: process.platform,
    osVersion: process.getSystemVersion(),
  },
  devtools: {
    toggleDevTools: () => ipcRenderer.send('devtools:toggle'),
  },

  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    unmaximize: () => ipcRenderer.send('window:unmaximize'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
    close: () => ipcRenderer.send('window:close'),
    reload: () => ipcRenderer.send('window:reload'),
  },

  stomp: {
    connect: (connection: StompConnection) => ipcRenderer.send('stomp:connect', connection),
    disconnect: (id: string) => ipcRenderer.send('stomp:disconnect', id),
    disconnectAll: () => ipcRenderer.send('stomp:disconnectAll'),
    subscribe: (connectionId: string, subscriptionId: string, topic: string) =>
      ipcRenderer.send('stomp:subscribe', { connectionId, subscriptionId, topic }),
    unsubscribe: (connectionId: string, subscriptionId: string, topic: string) =>
      ipcRenderer.send('stomp:unsubscribe', { connectionId, subscriptionId, topic }),
    send: (id: string, data: Request) => ipcRenderer.send('stomp:send', id, data),
  },

  workspace: {
    save: (workspace: Workspace) => ipcRenderer.invoke('workspaces:save', workspace) as Promise<void>,
    get: (id: string) => ipcRenderer.invoke('workspaces:get', id) as Promise<Workspace | undefined>,
    delete: (id: string) => ipcRenderer.invoke('workspaces:delete', id) as Promise<void>,
    load: () => ipcRenderer.invoke('workspaces:load') as Promise<WorkspaceFile>,
    setActive: (workspaceId: string | undefined) =>
      ipcRenderer.invoke('workspaces:setActive', workspaceId) as Promise<void>,
    getActive: () => ipcRenderer.invoke('workspaces:getActive') as Promise<string | undefined>,
    updateSelection: (workspaceId: string, values: Partial<WorkspaceSelectionValue>) =>
      ipcRenderer.invoke('workspaces:updateSelection', workspaceId, values) as Promise<void>,
  },

  connection: {
    save: (connection: Connection) => ipcRenderer.invoke('connections:save', connection) as Promise<void>,
    get: (id: string) => ipcRenderer.invoke('connections:get', id) as Promise<Connection | undefined>,
    delete: (id: string) => ipcRenderer.invoke('connections:delete', id) as Promise<void>,
    load: (workspaceId: string) => ipcRenderer.invoke('connections:load', workspaceId) as Promise<Connection[]>,
    clear: () => ipcRenderer.invoke('connections:clear') as Promise<void>,
  },

  collection: {
    save: (collectionItem: CollectionItem) => ipcRenderer.invoke('collections:save', collectionItem) as Promise<void>,
    get: (id: string) => ipcRenderer.invoke('collections:get', id) as Promise<CollectionItem | undefined>,
    delete: (id: string) => ipcRenderer.invoke('collections:delete', id) as Promise<void>,
    load: (workspaceId: string) => ipcRenderer.invoke('collections:load', workspaceId) as Promise<CollectionItem[]>,
    clear: () => ipcRenderer.invoke('collections:clear') as Promise<void>,
  },

  environment: {
    save: (environment: Environment) => ipcRenderer.invoke('environments:save', environment) as Promise<void>,
    get: (id: string) => ipcRenderer.invoke('environments:get', id) as Promise<Environment | undefined>,
    delete: (id: string) => ipcRenderer.invoke('environments:delete', id) as Promise<void>,
    load: (workspaceId: string) => ipcRenderer.invoke('environments:load', workspaceId) as Promise<Environment[]>,
    clear: () => ipcRenderer.invoke('environments:clear') as Promise<void>,
  },

  interceptionScript: {
    save: (interceptionScript: InterceptionScript) =>
      ipcRenderer.invoke('interception-script:save', interceptionScript) as Promise<void>,
    get: (id: string) => ipcRenderer.invoke('interception-script:get', id) as Promise<InterceptionScript | undefined>,
    delete: (id: string) => ipcRenderer.invoke('interception-script:delete', id) as Promise<void>,
    load: (workspaceId: string) =>
      ipcRenderer.invoke('interception-script:load', workspaceId) as Promise<InterceptionScript[]>,
    clear: () => ipcRenderer.invoke('interception-script:clear') as Promise<void>,
  },
};

const listener = {
  window: {
    onMaximizeChange: (callback: (maximized: boolean) => void) => {
      ipcRenderer.on('window:maximize-changed', (_, value) => callback(value));
    },
  },
  stomp: {
    onStatus: (callback: (data: ConnectionStatusData) => void) => {
      const handler = (_: Electron.IpcRendererEvent, data: ConnectionStatusData) => callback(data);
      ipcRenderer.on('stomp:status', handler);
      return () => ipcRenderer.removeListener('stomp:status', handler);
    },
    onMessage: (callback: (data: SocketMessage) => void) => {
      const handler = (_: Electron.IpcRendererEvent, data: SocketMessage) => callback(data);
      ipcRenderer.on('stomp:message', handler);
      return () => ipcRenderer.removeListener('stomp:message', handler);
    },
    onRequestPending: (callback: (data: RequestPendingEvent) => void) => {
      const handler = (_: Electron.IpcRendererEvent, data: RequestPendingEvent) => callback(data);
      ipcRenderer.on('stomp:request-pending', handler);
      return () => ipcRenderer.removeListener('stomp:request-pending', handler);
    },
    onRequestResolved: (callback: (data: RequestResolvedEvent) => void) => {
      const handler = (_: Electron.IpcRendererEvent, data: RequestResolvedEvent) => callback(data);
      ipcRenderer.on('stomp:request-resolved', handler);
      return () => ipcRenderer.removeListener('stomp:request-resolved', handler);
    },
  },

  console: {
    log: (callback: (data: unknown) => void) => {
      const handler = (_: Electron.IpcRendererEvent, data: unknown) => callback(data);
      ipcRenderer.on('console:log', handler);
      return () => ipcRenderer.removeListener('console:log', handler);
    },
    error: (callback: (data: unknown) => void) => {
      const handler = (_: Electron.IpcRendererEvent, data: unknown) => callback(data);
      ipcRenderer.on('console:error', handler);
      return () => ipcRenderer.removeListener('console:error', handler);
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
