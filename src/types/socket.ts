import type { StompHeaders } from '@stomp/stompjs';

import type { ConnectionType } from '@/types/connection';

export const SOCKET_MESSAGE_TYPE = {
  SENT: 'SENT',
  RECEIVED: 'RECEIVED',

  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',

  SUBSCRIBED: 'SUBSCRIBED',
  UNSUBSCRIBED: 'UNSUBSCRIBED',
} as const;

export type SocketMessageType = (typeof SOCKET_MESSAGE_TYPE)[keyof typeof SOCKET_MESSAGE_TYPE];

export type SocketMessage = {
  connectionId: string;
  connectionType: ConnectionType;
  type: SocketMessageType;
  timestamp: number;
  data: string;
  meta?: {
    // STOMP specific fields
    command?: string;
    headers?: StompHeaders;
    isBinaryBody?: boolean;
    binaryBody?: Uint8Array<ArrayBufferLike>;
  };
};
