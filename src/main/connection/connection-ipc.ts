import path from 'path';
import { BASE_STORAGE_DIR } from '@/main/constants/storage-constants';
import { getMainWindow } from '@/main/index';
import { applyAuditFields } from '@/main/utils/audit-util';
import { sortByDate } from '@/main/utils/sort-util';
import { ipcMain } from 'electron';
import { Level } from 'level';

import type { Connection } from '@/types/connection';

const connectionDatabasePath = path.join(BASE_STORAGE_DIR, 'connection');
const connectionDb = new Level<string, Connection>(connectionDatabasePath, { valueEncoding: 'json' });

async function saveConnection(connection: Connection) {
  await connectionDb.put(connection.id, connection);
}

async function getConnection(id: string): Promise<Connection | undefined> {
  try {
    return await connectionDb.get(id);
  } catch (error: unknown) {
    console.error(error);
    return undefined;
  }
}

async function deleteConnection(id: string): Promise<void> {
  try {
    await connectionDb.del(id);
  } catch (error: unknown) {
    console.error(error);
    return;
  }
}

async function listAllConnections(): Promise<Connection[]> {
  const results: Connection[] = [];

  for await (const [, value] of connectionDb.iterator()) {
    results.push(value);
  }

  return sortByDate(results, 'createdDate');
}

async function clearConnections(): Promise<void> {
  await connectionDb.clear();
}

export function initConnectionIpc() {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;

  ipcMain.handle('connections:save', async (_, connection) => {
    const auditedConnection = applyAuditFields(connection);
    return await saveConnection(auditedConnection);
  });

  ipcMain.handle('connections:get', async (_, id) => {
    return await getConnection(id);
  });

  ipcMain.handle('connections:delete', async (_, id) => {
    return await deleteConnection(id);
  });

  ipcMain.handle('connections:list', async () => {
    return await listAllConnections();
  });

  ipcMain.handle('connections:clear', async () => {
    return await clearConnections();
  });
}
