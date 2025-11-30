import fs from 'fs';
import path from 'path';
import { BASE_STORAGE_DIR } from '@/main/constants/storage-constants';
import { getMainWindow } from '@/main/index';
import { ipcMain } from 'electron';

import type { CollectionFile } from '@/types/collection';

const collectionFilePath = path.join(BASE_STORAGE_DIR, 'collections.json');

function loadCollections(): CollectionFile {
  if (fs.existsSync(collectionFilePath)) {
    const data = fs.readFileSync(collectionFilePath, 'utf-8');
    return JSON.parse(data) as CollectionFile;
  } else {
    const fileData: CollectionFile = {
      collectionItemMap: Object.fromEntries(new Map()),
    };

    fs.writeFileSync(collectionFilePath, JSON.stringify(fileData, null, 2), 'utf-8');
    return fileData;
  }
}

function saveCollections(collectionFile: CollectionFile) {
  try {
    fs.writeFileSync(collectionFilePath, JSON.stringify(collectionFile, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save collections:', err);
  }
}

export function initCollectionIpc() {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;

  ipcMain.handle('collections:load', () => {
    return loadCollections();
  });

  ipcMain.handle('collections:save', (_, collectionFile) => {
    saveCollections(collectionFile);
  });
}
