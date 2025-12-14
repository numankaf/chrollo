import type { Request } from '@/types/collection';
import type { StompConnection } from '@/types/connection';
import type { PluginId } from '@/types/plugin';
import type { SocketMessage } from '@/types/socket';

export interface BasePlugin {
  id: PluginId;
  name: string;
  macros?: Record<string, () => string>;
}

export interface BaseStompPlugin extends BasePlugin {
  onPreConnect?(connection: StompConnection): StompConnection;

  onPreSubscribe?(subscriptionId: string, topic: string): { id: string; topic: string }[];

  onPreSend?(request: Request): Request;

  onReceiveMessage?(message: SocketMessage): void;
}
