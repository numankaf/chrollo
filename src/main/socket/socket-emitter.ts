import { getMainWindow } from '@/main/index';

import type { ConnectionStatusData } from '@/types/connection';
import { CONNECTION_STATUS } from '@/types/connection';
import type { SocketMessage } from '@/types/socket';

export function emitStatus(connectionId: string, status: (typeof CONNECTION_STATUS)[keyof typeof CONNECTION_STATUS]) {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;
  mainWindow.webContents.send('socket:status', {
    connectionId,
    status,
    timestamp: Date.now(),
  } as ConnectionStatusData);
}

export function emitMessage(message: SocketMessage) {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;
  mainWindow.webContents.send('socket:message', message);
}
