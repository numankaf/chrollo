import fs from 'fs';
import path from 'path';
import { BASE_STORAGE_DIR } from '@/main/constants/storage-constants';
import { getMainWindow } from '@/main/index';
import { ipcMain } from 'electron';

import type { TabsFile } from '@/types/layout';

const tabsFilePath = path.join(BASE_STORAGE_DIR, 'tabs.json');

function loadTabs(): TabsFile {
  if (fs.existsSync(tabsFilePath)) {
    const data = fs.readFileSync(tabsFilePath, 'utf-8');
    return JSON.parse(data) as TabsFile;
  }
  return { tabs: [] };
}

function saveTabs(tabsFile: TabsFile) {
  try {
    fs.writeFileSync(tabsFilePath, JSON.stringify(tabsFile, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save tabs:', err);
  }
}

export function initTabsIpc() {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;

  ipcMain.handle('tabs:load', () => {
    return loadTabs();
  });

  ipcMain.handle('tabs:save', (_, tabsFile) => {
    saveTabs(tabsFile);
  });
}
