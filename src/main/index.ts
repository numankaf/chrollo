import fs from 'fs';
import https from 'https';
import { join } from 'path';
import { initCollectionIpc } from '@/main/collection/collection-ipc';
import { initConnectionIpc } from '@/main/connection/connection-ipc';
import { BASE_STORAGE_DIR } from '@/main/constants/storage-constants';
import { initEnvironmentIpc } from '@/main/environment/environment-ipc';
import { initInterceptionScriptIpc } from '@/main/interception-script/interception-script-ipc';
import { logger } from '@/main/lib/logger';
import { initStompIpc } from '@/main/socket/stomp-ipc';
import { initWorkspaceIpc } from '@/main/workspace/workspace-ipc';
import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { app, BrowserWindow, ipcMain, shell } from 'electron';

import icon from '../../resources/app-logo.png?asset';

logger.info('Chrollo application starting...');

//Disable https certificate validation
https.globalAgent.options.rejectUnauthorized = false;

if (!fs.existsSync(BASE_STORAGE_DIR)) {
  fs.mkdirSync(BASE_STORAGE_DIR, { recursive: true });
}

let mainWindow: BrowserWindow;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 850,
    minWidth: 800,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: 'hidden',
    trafficLightPosition: {
      x: 10,
      y: 15,
    },
    icon: icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  ipcMain.on('window:minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.minimize();
  });

  ipcMain.on('window:maximize', () => {
    if (!mainWindow.isMaximized()) {
      mainWindow.maximize();
    }
  });

  ipcMain.on('window:unmaximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    }
  });

  ipcMain.handle('window:isMaximized', () => {
    return mainWindow.isMaximized();
  });

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window:maximize-changed', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window:maximize-changed', false);
  });

  ipcMain.on('window:close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.close();
  });

  ipcMain.on('window:reload', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.reload();
  });

  ipcMain.on('devtools:toggle', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return;

    if (win.webContents.isDevToolsOpened()) {
      win.webContents.closeDevTools();
    } else {
      win.webContents.openDevTools({ mode: 'detach' });
    }
  });

  initStompIpc();
  initWorkspaceIpc();
  initConnectionIpc();
  initCollectionIpc();
  initEnvironmentIpc();
  initInterceptionScriptIpc();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  // We can't directly access renderer state here, need to ask renderer
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('app:shutdown');
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
