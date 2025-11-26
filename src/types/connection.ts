import type { BaseAuditModel } from '@/types/base';
import type { Header } from '@/types/common';

export const CONNECTION_TYPE = {
  RAW_WEBSOCKET: 'RAW_WEBSOCKET',
  STOMP: 'STOMP',
  SOCKETIO: 'SOCKETIO',
} as const;

export type ConnectionType = (typeof CONNECTION_TYPE)[keyof typeof CONNECTION_TYPE];

export const WS_URL_SCHEME = {
  WS: 'ws://',
  WSS: 'wss://',
  HTTP: 'http://',
  HTTPS: 'https://',
} as const;

export type WsUrlScheme = (typeof WS_URL_SCHEME)[keyof typeof WS_URL_SCHEME];

export interface Connection extends BaseAuditModel {
  modelType: 'CONNECTION';
  workspaceId: string;
  connectionType: ConnectionType;
  name: string;
  prefix: WsUrlScheme;
  url: string;
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

export type ConnectionFile = {
  connections: Connection[];
};
