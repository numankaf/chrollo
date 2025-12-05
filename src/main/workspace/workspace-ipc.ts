import path from 'path';
import { BASE_STORAGE_DIR } from '@/main/constants/storage-constants';
import { getMainWindow } from '@/main/index';
import { applyAuditFields } from '@/main/utils/audit-util';
import { sortByDate } from '@/main/utils/sort-util';
import { ipcMain } from 'electron';
import { Level } from 'level';

import { BASE_MODEL_TYPE } from '@/types/base';
import {
  ACTIVE_WORKSPACE_ID_KEY,
  DEFAULT_WORKSPACE_ID,
  WORKSPACE_TYPE,
  type Workspace,
  type WorkspaceFile,
} from '@/types/workspace';

const workspaceDatabasePath = path.join(BASE_STORAGE_DIR, 'workspace');

const workspaceDb = new Level(workspaceDatabasePath);

const workspaceDataDb = workspaceDb.sublevel<string, Workspace>('data', {
  valueEncoding: 'json',
});

const workspaceMetaDb = workspaceDb.sublevel<string, string>('meta', {
  valueEncoding: 'utf8',
});

async function saveWorkspace(workspace: Workspace) {
  await workspaceDataDb.put(workspace.id, workspace);
}

async function getWorkspace(id: string): Promise<Workspace | undefined> {
  try {
    return await workspaceDataDb.get(id);
  } catch (error: unknown) {
    console.error(error);
    return undefined;
  }
}

async function deleteWorkspace(id: string): Promise<void> {
  try {
    await workspaceDb.del(id);
  } catch (error: unknown) {
    console.error(error);
    return;
  }
}

async function loadWorkspaces(): Promise<WorkspaceFile> {
  const now = new Date().toISOString();
  const results: Workspace[] = [];

  for await (const [, value] of workspaceDataDb.iterator()) {
    results.push(value);
  }

  if (results.length === 0) {
    const defaultWorkspace: Workspace = {
      id: DEFAULT_WORKSPACE_ID,
      modelType: BASE_MODEL_TYPE.WORKSPACE,
      name: 'My Workspace',
      type: WORKSPACE_TYPE.INTERNAL,
      description: null,
      createdDate: now,
      updatedDate: now,
    };
    results.push(defaultWorkspace);
    saveWorkspace(defaultWorkspace);
    setActiveWorkspace(DEFAULT_WORKSPACE_ID);
  }
  return {
    workspaces: sortByDate(results, 'createdDate'),
    activeWorkspaceId: DEFAULT_WORKSPACE_ID,
  };
}

async function setActiveWorkspace(id: string) {
  await workspaceMetaDb.put(ACTIVE_WORKSPACE_ID_KEY, id);
}

async function getActiveWorkspace(): Promise<string | undefined> {
  try {
    return await workspaceMetaDb.get(ACTIVE_WORKSPACE_ID_KEY);
  } catch {
    return undefined;
  }
}

export function initWorkspaceIpc() {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;

  ipcMain.handle('workspaces:save', async (_, workspace) => {
    const auditedWorkspace = applyAuditFields(workspace);
    return await saveWorkspace(auditedWorkspace);
  });

  ipcMain.handle('workspaces:get', async (_, id) => {
    return await getWorkspace(id);
  });

  ipcMain.handle('workspaces:delete', async (_, id) => {
    return await deleteWorkspace(id);
  });

  ipcMain.handle('workspaces:load', async () => {
    return await loadWorkspaces();
  });

  ipcMain.handle('workspaces:setActive', async (_, id) => {
    return await setActiveWorkspace(id);
  });

  ipcMain.handle('workspaces:getActive', async () => {
    return await getActiveWorkspace();
  });
}
