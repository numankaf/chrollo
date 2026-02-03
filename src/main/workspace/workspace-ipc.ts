import EventEmitter from 'events';
import path from 'path';
import { deleteWorkspaceCollections } from '@/main/collection/collection-ipc';
import { deleteWorkspaceConnections } from '@/main/connection/connection-ipc';
import { BASE_STORAGE_DIR } from '@/main/constants/storage-constants';
import { deleteWorkspaceEnvironments } from '@/main/environment/environment-ipc';
import { getMainWindow } from '@/main/index';
import { deleteWorkspaceInterceptionScripts } from '@/main/interception-script/interception-script-ipc';
import logger from '@/main/lib/logger';
import { applyAuditFields } from '@/main/utils/audit-util';
import { sortByDate } from '@/main/utils/sort-util';
import { ipcMain } from 'electron';
import { Level } from 'level';

import {
  ACTIVE_WORKSPACE_ID_KEY,
  WORKSPACE_SELECTION_KEY,
  type Workspace,
  type WorkspaceFile,
  type WorkspaceSelection,
  type WorkspaceSelectionValue,
} from '@/types/workspace';

const workspaceDatabasePath = path.join(BASE_STORAGE_DIR, 'workspace');

const workspaceDb = new Level(workspaceDatabasePath);

const workspaceDataDb = workspaceDb.sublevel<string, Workspace>('data', {
  valueEncoding: 'json',
});

const workspaceMetaDb = workspaceDb.sublevel<string, string>('meta', {
  valueEncoding: 'utf8',
});

const workspaceEvents = new EventEmitter();

async function saveWorkspace(workspace: Workspace) {
  await workspaceDataDb.put(workspace.id, workspace);
}

async function getWorkspace(id: string): Promise<Workspace | undefined> {
  try {
    return await workspaceDataDb.get(id);
  } catch (error: unknown) {
    logger.error(error);
    return undefined;
  }
}

async function deleteWorkspace(id: string): Promise<void> {
  try {
    await deleteWorkspaceConnections(id);
    await deleteWorkspaceEnvironments(id);
    await deleteWorkspaceCollections(id);
    await deleteWorkspaceInterceptionScripts(id);

    await workspaceDataDb.del(id);
  } catch (error: unknown) {
    logger.error(error);
    return;
  }
}

async function getWorkspaceSelection(): Promise<WorkspaceSelection> {
  try {
    const data = await workspaceMetaDb.get(WORKSPACE_SELECTION_KEY);
    if (!data) return {};
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function saveWorkspaceSelection(workspaceId: string, values: Partial<WorkspaceSelectionValue>) {
  const selection = await getWorkspaceSelection();
  selection[workspaceId] = {
    ...(selection[workspaceId] ?? {}),
    ...values,
  };
  await workspaceMetaDb.put(WORKSPACE_SELECTION_KEY, JSON.stringify(selection));
}

async function loadWorkspaces(): Promise<WorkspaceFile> {
  const results: Workspace[] = [];

  for await (const [, value] of workspaceDataDb.iterator()) {
    results.push(value);
  }

  const activeWorkspaceId = await getActiveWorkspace();
  const workspaceSelection = await getWorkspaceSelection();

  return {
    workspaces: sortByDate(results, 'createdDate'),
    activeWorkspaceId,
    workspaceSelection,
  };
}

async function setActiveWorkspace(id: string | undefined) {
  if (id) {
    await workspaceMetaDb.put(ACTIVE_WORKSPACE_ID_KEY, id);
  } else {
    try {
      await workspaceMetaDb.del(ACTIVE_WORKSPACE_ID_KEY);
    } catch {
      // Ignored if key doesn't exist
    }
  }
  workspaceEvents.emit('active-workspace-changed', id);
}

async function getActiveWorkspace(): Promise<string | undefined> {
  try {
    return await workspaceMetaDb.get(ACTIVE_WORKSPACE_ID_KEY);
  } catch {
    return undefined;
  }
}

export async function getActiveWorkspaceId() {
  return await getActiveWorkspace();
}

export function onWorkspaceChanged(callback: (workspaceId: string | undefined) => void) {
  workspaceEvents.on('active-workspace-changed', callback);
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

  ipcMain.handle('workspaces:updateSelection', async (_, workspaceId, values) => {
    return await saveWorkspaceSelection(workspaceId, values);
  });
}
