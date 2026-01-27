export const STOMP_CONNECTION_TYPE = `interface StompConnection {
  name: string;
  url: string;
  settings: {
    connectionTimeout: number;
    reconnectDelay: number;
    maxReconnectDelay: number;
    heartbeatIncoming: number;
    heartbeatOutgoing: number;
    splitLargeFrames: boolean;
    maxWebSocketChunkSize: number;
  };
  connectHeaders: { key: string; value: string; active: boolean }[];
  subscriptions: {
    id: string;
    topic: string;
    enabled: boolean;
  }[];
}`;

export const REQUEST_TYPE = `interface Request {
  name: string;
  destination: string;
  body: {
    data: string;
  };
  headers: { key: string; value: string; active: boolean }[];
  scripts: {
    preRequest?: string;
    postResponse?: string;
  };
}`;

export const SOCKET_MESSAGE_TYPE = `interface SocketMessage {
  id: number;
  connectionId: string;
  connectionType: 'STOMP' | 'RAW_WEBSOCKET' | 'SOCKETIO';
  type: 'SENT' | 'RECEIVED' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'EVENT' | 'SUBSCRIBED' | 'UNSUBSCRIBED';
  timestamp: number;
  data: string;
  meta?: {
    command?: string;
    headers?: Record<string, string>;
    isBinaryBody?: boolean;
    binaryBody?: Uint8Array;
  };
}`;

export const makeInfo = (html: string) => {
  const el = document.createElement('div');
  el.className = 'cm-tooltip';
  el.innerHTML = html;
  return el;
};
