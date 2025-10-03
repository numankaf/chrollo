export interface StompConfig {
  connectHeaders?: { [key: string]: string };
  connectionTimeout?: number;
  reconnectDelay: number;
  maxReconnectDelay?: number;
  heartbeatIncoming?: number;
  heartbeatOutgoing?: number;
  splitLargeFrames?: boolean;
  maxWebSocketChunkSize?: number;
}
