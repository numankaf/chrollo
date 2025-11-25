import fs from 'fs';
import path from 'path';
import { getMainWindow } from '@/main/index';
import { app, ipcMain } from 'electron';

import type { Connection, ConnectionFile } from '@/types/connection';

const storageDir = path.join(app.getPath('userData'), 'appdata');

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

const connectionFilePath = path.join(storageDir, 'connections.json');

function loadConnections(): ConnectionFile {
  if (fs.existsSync(connectionFilePath)) {
    const data = fs.readFileSync(connectionFilePath, 'utf-8');
    return JSON.parse(data) as ConnectionFile;
  } else {
    const fileData: ConnectionFile = {
      connections: [],
      selectedConnectionId: undefined,
    };

    fs.writeFileSync(connectionFilePath, JSON.stringify(fileData, null, 2), 'utf-8');
    return fileData;
  }
}

function saveConnections(selectedConnectionId: string | undefined, connections: Connection[]) {
  try {
    const fileData: ConnectionFile = {
      connections,
      selectedConnectionId,
    };

    fs.writeFileSync(connectionFilePath, JSON.stringify(fileData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save connections:', err);
  }
}

export function initConnectionIpc() {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;

  ipcMain.handle('connections:load', () => {
    return loadConnections();
  });

  ipcMain.handle('connections:save', (_, selectedConnectionId, connections) => {
    saveConnections(selectedConnectionId, connections);
  });
}
