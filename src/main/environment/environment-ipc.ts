import fs from 'fs';
import path from 'path';
import { BASE_STORAGE_DIR } from '@/main/constants/storage-constants';
import { getMainWindow } from '@/main/index';
import { ipcMain } from 'electron';

import type { EnvironmentFile } from '@/types/environment';

const environmentFilePath = path.join(BASE_STORAGE_DIR, 'environments.json');

function loadEnvironments(): EnvironmentFile {
  if (fs.existsSync(environmentFilePath)) {
    const data = fs.readFileSync(environmentFilePath, 'utf-8');
    return JSON.parse(data) as EnvironmentFile;
  } else {
    const environmentFile: EnvironmentFile = {
      environments: [],
    };

    fs.writeFileSync(environmentFilePath, JSON.stringify(environmentFile, null, 2), 'utf-8');
    return environmentFile;
  }
}

function saveEnvironments(environmentFile: EnvironmentFile) {
  try {
    fs.writeFileSync(environmentFilePath, JSON.stringify(environmentFile, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save environments:', err);
  }
}

export function initEnvironmentIpc() {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;

  ipcMain.handle('environments:load', () => {
    return loadEnvironments();
  });

  ipcMain.handle('environments:save', (_, environmentFile) => {
    saveEnvironments(environmentFile);
  });
}
