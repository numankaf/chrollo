export const SOCKET_MESSAGE_TYPE = {
  SENT: 'SENT',
  RECEIVED: 'RECEIVED',
  CONNECTED: 'OPEN',
  DISCONNECTED: 'CLOSED',
} as const;

export type SocketMessageType = (typeof SOCKET_MESSAGE_TYPE)[keyof typeof SOCKET_MESSAGE_TYPE];

export type SocketMessage = {
  type: SocketMessageType;
  timestamp: string;
  data: string;
};
