import path from 'path';
import { BASE_STORAGE_DIR } from '@/main/constants/storage-constants';
import { getMainWindow } from '@/main/index';
import { applyAuditFields } from '@/main/utils/audit-util';
import { sortByDate } from '@/main/utils/sort-util';
import { ipcMain } from 'electron';
import { Level } from 'level';

import type { CollectionItem } from '@/types/collection';

const collectionItemDatabasePath = path.join(BASE_STORAGE_DIR, 'collection');
const collectionItemDb = new Level<string, CollectionItem>(collectionItemDatabasePath, { valueEncoding: 'json' });

async function saveCollectionItem(collectionItem: CollectionItem) {
  await collectionItemDb.put(collectionItem.id, collectionItem);
}

async function getCollectionItem(id: string): Promise<CollectionItem | undefined> {
  try {
    return await collectionItemDb.get(id);
  } catch (error: unknown) {
    console.error(error);
    return undefined;
  }
}

async function deleteCollectionItem(id: string): Promise<void> {
  try {
    await collectionItemDb.del(id);
  } catch (error: unknown) {
    console.error(error);
    return;
  }
}

async function loadCollectionItems(workspaceId: string): Promise<CollectionItem[]> {
  const results: CollectionItem[] = [];

  for await (const [, value] of collectionItemDb.iterator()) {
    if (value.workspaceId !== workspaceId) continue;
    results.push(value);
  }

  return sortByDate(results, 'createdDate');
}

async function clearCollectionItems(): Promise<void> {
  await collectionItemDb.clear();
}

export function initCollectionIpc() {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;

  ipcMain.handle('collections:save', async (_, collectionItem) => {
    const auditedCollectionItem = applyAuditFields(collectionItem);
    return await saveCollectionItem(auditedCollectionItem);
  });

  ipcMain.handle('collections:get', async (_, id) => {
    return await getCollectionItem(id);
  });

  ipcMain.handle('collections:delete', async (_, id) => {
    return await deleteCollectionItem(id);
  });

  ipcMain.handle('collections:load', async (_, workspaceId) => {
    return await loadCollectionItems(workspaceId);
  });

  ipcMain.handle('collections:clear', async () => {
    return await clearCollectionItems();
  });
}
