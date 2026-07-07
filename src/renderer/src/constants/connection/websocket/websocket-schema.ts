import * as z from 'zod';

import { BASE_MODEL_TYPE } from '@/types/base';
import { CONNECTION_TYPE, type WebSocketConnection } from '@/types/connection';

const WEBSOCKET_VALIDATION_SCHEMA = z.object({
  id: z.string(),
  name: z.string(),
  workspaceId: z.string(),
  url: z.string().min(1, 'URL is required.'),
  settings: z.object({
    reconnectOnClose: z.boolean(),
    reconnectDelay: z
      .number('Reconnect delay is required.')
      .int('Reconnect delay must be an integer.')
      .min(0, 'Reconnect delay cannot be negative.'),
    maxReconnectAttempts: z
      .number('Max reconnect attempts is required.')
      .int('Max reconnect attempts must be an integer.')
      .min(0, 'Max reconnect attempts cannot be negative.'),
  }),
  connectHeaders: z.array(
    z.object({
      id: z.string(),
      key: z.string(),
      value: z.string(),
      description: z.string().optional(),
      enabled: z.boolean(),
    })
  ),
  protocols: z.array(z.string()),
});

const WEBSOCKET_DEFAULT_VALUES: Omit<WebSocketConnection, 'id' | 'name' | 'workspaceId'> = {
  connectionType: CONNECTION_TYPE.RAW_WEBSOCKET,
  url: '',
  modelType: BASE_MODEL_TYPE.CONNECTION,
  settings: {
    reconnectOnClose: false,
    reconnectDelay: 5000,
    maxReconnectAttempts: 0,
  },
  connectHeaders: [],
  protocols: [],
};

export { WEBSOCKET_DEFAULT_VALUES, WEBSOCKET_VALIDATION_SCHEMA };
