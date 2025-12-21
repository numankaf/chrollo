import { type CompletionContext, type CompletionResult } from '@codemirror/autocomplete';

const CHROLLO_API = {
  stomp: {
    label: 'stomp',
    type: 'class',
    info: 'Stomp API for intercepting and handling STOMP messages',
  },
  variables: {
    label: 'variables',
    type: 'class',
    info: 'Variables API for managing environment variables',
  },
  utils: {
    label: 'utils',
    type: 'class',
    info: 'Utility functions',
  },
};

const STOMP_CONNECTION_TYPE = `interface StompConnection {
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

const REQUEST_TYPE = `interface Request {
  name: string;
  destination: string;
  body: {
    data: string;
  };
  headers: { key: string; value: string; active: boolean }[];
  scripts: {
    preRequest: string;
    postRequest: string;
  };
}`;

const SOCKET_MESSAGE_TYPE = `interface SocketMessage {
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

const STOMP_API = [
  {
    label: 'onPreConnect',
    type: 'function',
    info: `Triggered before connecting.\n\nctx: { connection: StompConnection }\n\n${STOMP_CONNECTION_TYPE}`,
  },
  {
    label: 'onPreSubscribe',
    type: 'function',
    info: 'Triggered before subscribing.\n\nctx: {\n  connectionId: string,\n  subscriptionId: string,\n  topic: string,\n  subscribe(connectionId, subscriptionId, topic): void,\n  disableDefault(): void\n}',
  },
  {
    label: 'onPreUnsubscribe',
    type: 'function',
    info: 'Triggered before unsubscribing.\n\nctx: {\n  connectionId: string,\n  subscriptionId: string,\n  topic: string,\n  unsubscribe(connectionId, subscriptionId, topic): void,\n  disableDefault(): void\n}',
  },
  {
    label: 'onPreSend',
    type: 'function',
    info: `Triggered before sending a message.\n\nctx: {\n  connectionId: string,\n  request: Request\n}\n\n${REQUEST_TYPE}`,
  },
  {
    label: 'onMessage',
    type: 'function',
    info: `Triggered when a message is received.\n\nctx: {\n  message: SocketMessage\n}\n\n${SOCKET_MESSAGE_TYPE}`,
  },
];

const VARIABLES_API = [
  { label: 'get', type: 'function', info: '(key: string) => any' },
  { label: 'set', type: 'function', info: '(key: string, value: any) => void' },
  { label: 'unset', type: 'function', info: '(key: string) => void' },
  { label: 'all', type: 'function', info: '() => Record<string, any>' },
];

const UTILS_API = [
  { label: 'randomId', type: 'function', info: '(size?: number) => string' },
  { label: 'now', type: 'function', info: '() => number' },
];

export function chrolloCompletions(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/[\w.]*/);
  if (!word) return null;

  if (word.text === 'chrollo.') {
    return {
      from: word.to,
      options: Object.values(CHROLLO_API),
    };
  }

  if (word.text.startsWith('chrollo.stomp.')) {
    return {
      from: word.to,
      options: STOMP_API,
    };
  }

  if (word.text.startsWith('chrollo.variables.')) {
    return {
      from: word.to,
      options: VARIABLES_API,
    };
  }

  if (word.text.startsWith('chrollo.utils.')) {
    return {
      from: word.to,
      options: UTILS_API,
    };
  }

  // Completing property names partially typed
  const lastDotIndex = word.text.lastIndexOf('.');
  if (lastDotIndex > -1) {
    const parent = word.text.slice(0, lastDotIndex);

    if (parent === 'chrollo') {
      return {
        from: word.from + lastDotIndex + 1,
        options: Object.values(CHROLLO_API),
      };
    }
    if (parent === 'chrollo.stomp') {
      return {
        from: word.from + lastDotIndex + 1,
        options: STOMP_API,
      };
    }
    if (parent === 'chrollo.variables') {
      return {
        from: word.from + lastDotIndex + 1,
        options: VARIABLES_API,
      };
    }
    if (parent === 'chrollo.utils') {
      return {
        from: word.from + lastDotIndex + 1,
        options: UTILS_API,
      };
    }
  }

  if ('chrollo'.startsWith(word.text) && word.text.length > 0) {
    return {
      from: word.from,
      options: [{ label: 'chrollo', type: 'class', info: 'Chrollo Scripting API' }],
    };
  }

  return null;
}
