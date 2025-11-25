import fs from 'fs';
import path from 'path';
import { getMainWindow } from '@/main/index';
import { app, ipcMain } from 'electron';

import type { Tab, TabsFile } from '@/types/layout';

const storageDir = path.join(app.getPath('userData'), 'appdata');

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

const tabsFilePath = path.join(storageDir, 'tabs.json');

function loadTabs(): TabsFile {
  if (fs.existsSync(tabsFilePath)) {
    const data = fs.readFileSync(tabsFilePath, 'utf-8');
    return JSON.parse(data) as TabsFile;
  }
  return { tabs: [], activeTabId: undefined };
}

function saveTabs(activeTabId: string | undefined, tabs: Tab[]) {
  try {
    const fileData: TabsFile = {
      tabs,
      activeTabId,
    };

    fs.writeFileSync(tabsFilePath, JSON.stringify(fileData, null, 2), 'utf-8');
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

  ipcMain.handle('tabs:save', (_, activeTabId, tabs) => {
    saveTabs(activeTabId, tabs);
  });
}
