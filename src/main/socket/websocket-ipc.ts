import { getMainWindow } from '@/main/index';
import logger from '@/main/lib/logger';
import { stripAllWhitespace } from '@/main/utils/common-util';
import { resolveVariables } from '@/main/utils/variable-resolver-util';
import { ipcMain } from 'electron';
import WS from 'ws';

import {
  CONNECTION_PREFIX,
  CONNECTION_STATUS,
  CONNECTION_TYPE,
  type ConnectionStatusData,
  type WebSocketConnection,
} from '@/types/connection';
import { SOCKET_MESSAGE_TYPE, type SocketMessage } from '@/types/socket';

let seq = 0;
const nextSeq = () => ++seq;

interface ManagedWebSocket {
  ws: WS;
  connection: WebSocketConnection;
  reconnectAttempts: number;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
  intentionalClose: boolean;
}

const webSockets: Record<string, ManagedWebSocket> = {};

function emitStatus(connectionId: string, status: (typeof CONNECTION_STATUS)[keyof typeof CONNECTION_STATUS]) {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;
  mainWindow.webContents.send('ws:status', {
    connectionId,
    status,
    timestamp: Date.now(),
  } as ConnectionStatusData);
}

function emitMessage(message: SocketMessage) {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;
  mainWindow.webContents.send('ws:message', message);
}

function connectWebSocket(connection: WebSocketConnection, existingManaged?: ManagedWebSocket) {
  const { id, name, url, connectHeaders, protocols, settings } = connection;

  const connectionUrl = stripAllWhitespace(resolveVariables(url));

  if (!connectionUrl.startsWith(CONNECTION_PREFIX.WS) && !connectionUrl.startsWith(CONNECTION_PREFIX.WSS)) {
    const mainWindow = getMainWindow();
    if (mainWindow) {
      mainWindow.webContents.send('console:error', `Unsupported URL scheme for raw WebSocket: ${connectionUrl}`);
    }
    return;
  }

  const headers = connectHeaders
    .filter((h) => h.enabled)
    .reduce(
      (acc, h) => ({ ...acc, [resolveVariables(h.key)]: resolveVariables(h.value.trim()) }),
      {} as Record<string, string>
    );

  const resolvedProtocols = protocols.map((p) => resolveVariables(p)).filter(Boolean);

  const ws = new WS(connectionUrl, resolvedProtocols, { headers });

  const managed: ManagedWebSocket = existingManaged
    ? { ...existingManaged, ws, intentionalClose: false }
    : { ws, connection, reconnectAttempts: 0, reconnectTimer: null, intentionalClose: false };

  webSockets[id] = managed;

  ws.on('open', () => {
    managed.reconnectAttempts = 0;
    emitStatus(id, CONNECTION_STATUS.CONNECTED);

    const message: SocketMessage = {
      id: nextSeq(),
      connectionId: id,
      connectionType: CONNECTION_TYPE.RAW_WEBSOCKET,
      type: SOCKET_MESSAGE_TYPE.CONNECTED,
      timestamp: Date.now(),
      data: `Connected to ${connectionUrl}`,
      meta: {
        protocol: ws.protocol || undefined,
      },
    };
    emitMessage(message);
    logger.info(`[${id}] [${name}] Connected to ${connectionUrl}`);
  });

  ws.on('message', (rawData) => {
    const data = rawData.toString();
    const size = Buffer.byteLength(rawData as Buffer);

    const message: SocketMessage = {
      id: nextSeq(),
      connectionId: id,
      connectionType: CONNECTION_TYPE.RAW_WEBSOCKET,
      type: SOCKET_MESSAGE_TYPE.RECEIVED,
      timestamp: Date.now(),
      data,
      meta: {
        size,
      },
    };
    emitMessage(message);
    logger.info(`[${id}] [${name}] Received: ${data.substring(0, 200)}`);
  });

  ws.on('error', (err) => {
    const message: SocketMessage = {
      id: nextSeq(),
      connectionId: id,
      connectionType: CONNECTION_TYPE.RAW_WEBSOCKET,
      type: SOCKET_MESSAGE_TYPE.ERROR,
      timestamp: Date.now(),
      data: `ERROR: ${err.message}`,
    };
    emitMessage(message);
    logger.info(`[${id}] [${name}] Error: ${err.message}`);
  });

  ws.on('close', (code, reason) => {
    const reasonStr = reason.toString() || undefined;

    const message: SocketMessage = {
      id: nextSeq(),
      connectionId: id,
      connectionType: CONNECTION_TYPE.RAW_WEBSOCKET,
      type: managed.intentionalClose ? SOCKET_MESSAGE_TYPE.DISCONNECTED : SOCKET_MESSAGE_TYPE.EVENT,
      timestamp: Date.now(),
      data: managed.intentionalClose ? `Disconnected from ${connectionUrl}` : `Connection closed (code: ${code})`,
      meta: {
        closeCode: code,
        closeReason: reasonStr,
      },
    };
    emitMessage(message);

    if (managed.intentionalClose) {
      emitStatus(id, CONNECTION_STATUS.DISCONNECTED);
      delete webSockets[id];
      return;
    }

    emitStatus(id, CONNECTION_STATUS.CLOSED);

    // Reconnect logic
    if (settings.reconnectOnClose) {
      const maxAttempts = settings.maxReconnectAttempts;
      if (maxAttempts === 0 || managed.reconnectAttempts < maxAttempts) {
        managed.reconnectAttempts++;
        logger.info(
          `[${id}] [${name}] Reconnecting (attempt ${managed.reconnectAttempts}${maxAttempts > 0 ? `/${maxAttempts}` : ''})...`
        );
        managed.reconnectTimer = setTimeout(() => {
          managed.reconnectTimer = null;
          if (webSockets[id]) {
            connectWebSocket(connection, managed);
          }
        }, settings.reconnectDelay);
      } else {
        logger.info(`[${id}] [${name}] Max reconnect attempts (${maxAttempts}) reached`);
        delete webSockets[id];
      }
    } else {
      delete webSockets[id];
    }
  });
}

export function initWebSocketIpc() {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;

  // ------------------------------
  // CONNECT
  // ------------------------------
  ipcMain.on('ws:connect', (_, connection: WebSocketConnection) => {
    const { id } = connection;

    // Clean up existing connection if any
    const existing = webSockets[id];
    if (existing) {
      existing.intentionalClose = true;
      if (existing.reconnectTimer) {
        clearTimeout(existing.reconnectTimer);
        existing.reconnectTimer = null;
      }
      if (existing.ws.readyState === WS.OPEN || existing.ws.readyState === WS.CONNECTING) {
        existing.ws.close();
      }
      delete webSockets[id];
    }

    connectWebSocket(connection);
  });

  // ------------------------------
  // SEND
  // ------------------------------
  ipcMain.on('ws:send', (_, id: string, data: string) => {
    const managed = webSockets[id];
    if (!managed || managed.ws.readyState !== WS.OPEN) {
      logger.info(`WebSocket (${id}) not connected`);
      return;
    }

    managed.ws.send(data);
    const size = Buffer.byteLength(data);

    const message: SocketMessage = {
      id: nextSeq(),
      connectionId: id,
      connectionType: CONNECTION_TYPE.RAW_WEBSOCKET,
      type: SOCKET_MESSAGE_TYPE.SENT,
      timestamp: Date.now(),
      data,
      meta: {
        size,
      },
    };
    emitMessage(message);
  });

  // ------------------------------
  // DISCONNECT
  // ------------------------------
  ipcMain.on('ws:disconnect', (_, id: string) => {
    const managed = webSockets[id];
    if (managed) {
      managed.intentionalClose = true;
      if (managed.reconnectTimer) {
        clearTimeout(managed.reconnectTimer);
        managed.reconnectTimer = null;
      }
      if (managed.ws.readyState === WS.OPEN || managed.ws.readyState === WS.CONNECTING) {
        managed.ws.close(1000, 'Client disconnect');
      } else {
        emitStatus(id, CONNECTION_STATUS.DISCONNECTED);
        delete webSockets[id];
      }
    } else {
      emitStatus(id, CONNECTION_STATUS.DISCONNECTED);
    }
  });

  // ------------------------------
  // DISCONNECT ALL
  // ------------------------------
  ipcMain.on('ws:disconnectAll', () => {
    for (const [id, managed] of Object.entries(webSockets)) {
      managed.intentionalClose = true;
      if (managed.reconnectTimer) {
        clearTimeout(managed.reconnectTimer);
        managed.reconnectTimer = null;
      }
      if (managed.ws.readyState === WS.OPEN || managed.ws.readyState === WS.CONNECTING) {
        managed.ws.close(1000, 'Client disconnect');
      }
      delete webSockets[id];
    }
    logger.info('All WebSocket connections closed');
  });
}
