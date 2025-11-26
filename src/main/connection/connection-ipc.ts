import fs from 'fs';
import path from 'path';
import { BASE_STORAGE_DIR } from '@/main/constants/storage-constants';
import { getMainWindow } from '@/main/index';
import { ipcMain } from 'electron';

import type { ConnectionFile } from '@/types/connection';

const connectionFilePath = path.join(BASE_STORAGE_DIR, 'connections.json');

function loadConnections(): ConnectionFile {
  if (fs.existsSync(connectionFilePath)) {
    const data = fs.readFileSync(connectionFilePath, 'utf-8');
    return JSON.parse(data) as ConnectionFile;
  } else {
    const fileData: ConnectionFile = {
      connections: [],
    };

    fs.writeFileSync(connectionFilePath, JSON.stringify(fileData, null, 2), 'utf-8');
    return fileData;
  }
}

function saveConnections(connectionFile: ConnectionFile) {
  try {
    fs.writeFileSync(connectionFilePath, JSON.stringify(connectionFile, null, 2), 'utf-8');
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

  ipcMain.handle('connections:save', (_, connectionFile) => {
    saveConnections(connectionFile);
  });
}
