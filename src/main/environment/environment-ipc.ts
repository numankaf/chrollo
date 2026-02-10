import path from 'path';
import { BASE_STORAGE_DIR } from '@/main/constants/storage-constants';
import { getMainWindow } from '@/main/index';
import logger from '@/main/lib/logger';
import { applyAuditFields } from '@/main/utils/audit-util';
import { sortByDate } from '@/main/utils/sort-util';
import { ipcMain } from 'electron';
import { Level } from 'level';

import type { Environment } from '@/types/environment';

const environmentDatabasePath = path.join(BASE_STORAGE_DIR, 'environment');
const environmentDb = new Level<string, Environment>(environmentDatabasePath, { valueEncoding: 'json' });

export function getGlobalId(workspaceId: string) {
  return `GLOBAL-${workspaceId}`;
}

async function saveEnvironment(environment: Environment) {
  await environmentDb.put(environment.id, environment);
}

async function getEnvironment(id: string): Promise<Environment | undefined> {
  try {
    return await environmentDb.get(id);
  } catch {
    return undefined;
  }
}

export async function ensureGlobalExist(workspaceId: string) {
  const globalId = getGlobalId(workspaceId);
  const existing = await getEnvironment(globalId);
  if (!existing) {
    const global: Environment = applyAuditFields({
      id: globalId,
      workspaceId,
      name: 'Globals',
      modelType: 'ENVIRONMENT',
      isGlobal: true,
      variables: [],
    } as Environment);
    await saveEnvironment(global);
    logger.info(`Created global environment for workspace: ${workspaceId}`);
  }
}

async function deleteEnvironment(id: string): Promise<void> {
  try {
    await environmentDb.del(id);
  } catch (error: unknown) {
    logger.error(error);
    return;
  }
}

async function loadEnvironments(workspaceId: string): Promise<Environment[]> {
  const results: Environment[] = [];
  const globalId = getGlobalId(workspaceId);

  for await (const [, value] of environmentDb.iterator()) {
    if (value.workspaceId !== workspaceId) continue;
    if (value.id === globalId) continue;
    results.push(value);
  }
  return sortByDate(results, 'createdDate');
}

async function clearEnvironments(): Promise<void> {
  await environmentDb.clear();
}

export async function deleteWorkspaceEnvironments(workspaceId: string): Promise<void> {
  const batch = environmentDb.batch();
  for await (const [key, value] of environmentDb.iterator()) {
    if (value.workspaceId === workspaceId) {
      batch.del(key);
    }
  }
  await batch.write();
}

export function initEnvironmentIpc() {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;

  ipcMain.handle('environments:save', async (_, environment) => {
    const auditedEnvironment = applyAuditFields(environment);
    return await saveEnvironment(auditedEnvironment);
  });

  ipcMain.handle('environments:get', async (_, id) => {
    return await getEnvironment(id);
  });

  ipcMain.handle('environments:getGlobal', async (_, workspaceId) => {
    await ensureGlobalExist(workspaceId);
    return await getEnvironment(getGlobalId(workspaceId));
  });

  ipcMain.handle('environments:delete', async (_, id) => {
    return await deleteEnvironment(id);
  });

  ipcMain.handle('environments:load', async (_, workspaceId) => {
    return await loadEnvironments(workspaceId);
  });

  ipcMain.handle('environments:clear', async () => {
    return await clearEnvironments();
  });
}
