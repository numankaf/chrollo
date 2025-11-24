import type { BaseAuditModel } from './base';
import type { Header } from './common';

export const CONNECTION_TYPE = {
  RAW_WEBSOCKET: 'RAW_WEBSOCKET',
  STOMP: 'STOMP',
  SOCKETIO: 'SOCKETIO',
} as const;

export type ConnectionType = (typeof CONNECTION_TYPE)[keyof typeof CONNECTION_TYPE];

export interface Connection extends BaseAuditModel {
  modelType: 'CONNECTION';
  workspaceId: string;
  connectionType: ConnectionType;
  name: string;
  url?: string;
}

export interface StompSettings {
  connectionTimeout: number;
  reconnectDelay: number;
  maxReconnectDelay: number;
  heartbeatIncoming: number;
  heartbeatOutgoing: number;
  splitLargeFrames: boolean;
  maxWebSocketChunkSize: number;
}

export interface StompSubscription {
  topic: string;
  description?: string;
}

export interface StompConnection extends Connection {
  connectionType: 'STOMP';
  settings: StompSettings;
  headers: Map<string, Header>;
  subscriptions: StompSubscription[];
}
