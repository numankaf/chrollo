import { electronAPI } from '@electron-toolkit/preload';
import type { StompHeaders } from '@stomp/stompjs';
import { contextBridge, ipcRenderer } from 'electron';

import type { StompConnection } from '@/types/connection';

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
