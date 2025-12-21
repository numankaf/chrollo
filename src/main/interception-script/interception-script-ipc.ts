import path from 'path';
import { BASE_STORAGE_DIR } from '@/main/constants/storage-constants';
import { getMainWindow } from '@/main/index';
import { applyAuditFields } from '@/main/utils/audit-util';
import { sortByDate } from '@/main/utils/sort-util';
import { ipcMain } from 'electron';
import { Level } from 'level';

import type { InterceptionScript } from '@/types/interception-script';

const interceptionScriptDatabasePath = path.join(BASE_STORAGE_DIR, 'interception-script');
const interceptionScriptDb = new Level<string, InterceptionScript>(interceptionScriptDatabasePath, {
  valueEncoding: 'json',
});

async function saveInterceptionScript(interceptionScript: InterceptionScript) {
  await interceptionScriptDb.put(interceptionScript.id, interceptionScript);
}

async function getInterceptionScript(id: string): Promise<InterceptionScript | undefined> {
  try {
    return await interceptionScriptDb.get(id);
  } catch (error: unknown) {
    console.error(error);
    return undefined;
  }
}

async function deleteInterceptionScript(id: string): Promise<void> {
  try {
    await interceptionScriptDb.del(id);
  } catch (error: unknown) {
    console.error(error);
    return;
  }
}

async function loadInterceptionScripts(): Promise<InterceptionScript[]> {
  const results: InterceptionScript[] = [];

  for await (const [, value] of interceptionScriptDb.iterator()) {
    results.push(value);
  }
  return sortByDate(results, 'createdDate');
}

async function clearInterceptionScripts(): Promise<void> {
  await interceptionScriptDb.clear();
}

export function initInterceptionScriptIpc() {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;

  ipcMain.handle('interception-script:save', async (_, interceptionScript) => {
    const auditedInterceptionScript = applyAuditFields(interceptionScript);
    return await saveInterceptionScript(auditedInterceptionScript);
  });

  ipcMain.handle('interception-script:get', async (_, id) => {
    return await getInterceptionScript(id);
  });

  ipcMain.handle('interception-script:delete', async (_, id) => {
    return await deleteInterceptionScript(id);
  });

  ipcMain.handle('interception-script:load', async () => {
    return await loadInterceptionScripts();
  });

  ipcMain.handle('interception-script:clear', async () => {
    return await clearInterceptionScripts();
  });
}
