import * as z from 'zod';

import type { Header } from '@/types/common';
import { CONNECTION_TYPE } from '@/types/connection';

const STOMP_VALIDATION_SCHEMA = z.object({
  prefix: z.string(),
  url: z.string().min(1, 'URL is required.'),
  settings: z.object({
    connectionTimeout: z
      .number('Connection timeout is required.')
      .int('Connection timeout must be an integer.')
      .min(0, 'Connection timeout cannot be negative.'),
    reconnectDelay: z
      .number('Reconnect delay is required.')
      .int('Reconnect delay must be an integer.')
      .min(0, 'Reconnect delay cannot be negative.'),
    maxReconnectDelay: z
      .number('Maximum reconnect is required.')
      .int('Maximum reconnect must be an integer.')
      .min(0, 'Maximum reconnect cannot be negative.'),
    heartbeatIncoming: z
      .number('Incoming heartbeat interval is required.')
      .int('Incoming heartbeat interval must be an integer.')
      .min(0, 'Incoming heartbeat interval cannot be negative.'),
    heartbeatOutgoing: z
      .number('Outgoing heartbeat interval is required.')
      .int('Outgoing heartbeat interval be an integer.')
      .min(0, 'Outgoing heartbeat interval cannot be negative.'),
    splitLargeFrames: z.boolean(),
    maxWebSocketChunkSize: z
      .number('Max WS chunk size is required.')
      .int('Max WS chunk size must be an integer.')
      .min(0, 'Max WS chunk size cannot be negative.'),
  }),
});

const STOMP_DEFAULT_VALUES = {
  name: 'New STOMP Connection',
  connectionType: CONNECTION_TYPE.STOMP,
  prefix: 'ws://',
  url: '',
  settings: {
    connectionTimeout: 0,
    reconnectDelay: 5000,
    maxReconnectDelay: 30000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    splitLargeFrames: false,
    maxWebSocketChunkSize: 8192,
  },
  headers: new Map<string, Header>(),
  subscriptions: [],
};

export { STOMP_DEFAULT_VALUES, STOMP_VALIDATION_SCHEMA };
