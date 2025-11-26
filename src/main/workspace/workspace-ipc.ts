import fs from 'fs';
import path from 'path';
import { BASE_STORAGE_DIR } from '@/main/constants/storage-constants';
import { getMainWindow } from '@/main/index';
import { ipcMain } from 'electron';

import { BASE_MODEL_TYPE } from '@/types/base';
import { DEFAULT_WORKSPACE_ID, WORKSPACE_TYPE, type Workspace, type WorkspaceFile } from '@/types/workspace';

const workspaceFilePath = path.join(BASE_STORAGE_DIR, 'workspaces.json');

function loadWorkspaces(): WorkspaceFile {
  if (fs.existsSync(workspaceFilePath)) {
    const data = fs.readFileSync(workspaceFilePath, 'utf-8');
    return JSON.parse(data) as WorkspaceFile;
  } else {
    const defaultWorkspace: Workspace = {
      id: DEFAULT_WORKSPACE_ID,
      modelType: BASE_MODEL_TYPE.WORKSPACE,
      name: 'My Workspace',
      type: WORKSPACE_TYPE.INTERNAL,
      description: null,
    };
    const defaultWorkspace2: Workspace = {
      id: DEFAULT_WORKSPACE_ID + '2',
      modelType: BASE_MODEL_TYPE.WORKSPACE,
      name: 'My Workspace2',
      type: WORKSPACE_TYPE.INTERNAL,
      description: null,
    };

    const fileData: WorkspaceFile = {
      workspaces: [defaultWorkspace, defaultWorkspace2],
      workspaceSelection: {},
      activeWorkspaceId: DEFAULT_WORKSPACE_ID,
    };

    fs.writeFileSync(workspaceFilePath, JSON.stringify(fileData, null, 2), 'utf-8');
    return fileData;
  }
}

function saveWorkspaces(workspaceFile: WorkspaceFile) {
  try {
    fs.writeFileSync(workspaceFilePath, JSON.stringify(workspaceFile, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save workspaces:', err);
  }
}

export function initWorkspaceIpc() {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;

  ipcMain.handle('workspaces:load', () => {
    return loadWorkspaces();
  });

  ipcMain.handle('workspaces:save', (_, workspaceFile) => {
    saveWorkspaces(workspaceFile);
  });
}
