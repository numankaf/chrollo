import type { BaseStompPlugin } from '@/plugins/base-plugin';
import { nanoid } from 'nanoid';

import type { Request } from '@/types/collection';
import type { StompConnection } from '@/types/connection';
import { PLUGIN_ID } from '@/types/plugin';

export class ScopePlatformPlugin implements BaseStompPlugin {
  id = PLUGIN_ID.SCOPE_PLATFORM;
  name = 'SCOPE Platform Plugin';

  private clientSessionIds = new Map<string, string>();

  private getClientSessionId(connectionId: string) {
    let id = this.clientSessionIds.get(connectionId);
    if (!id) {
      id = nanoid();
      this.clientSessionIds.set(connectionId, id);
    }
    return id;
  }

  macros = {
    clientSessionId: (connectionId?: string) => (connectionId ? this.getClientSessionId(connectionId) : ''),
    requestId: () => nanoid(),
  };

  onPreConnect(connection: StompConnection): StompConnection {
    const clientSessionId = this.getClientSessionId(connection.id);

    return {
      ...connection,
      connectHeaders: [
        ...connection.connectHeaders,
        {
          id: nanoid(),
          key: '_clientSessionId',
          value: clientSessionId,
          enabled: true,
        },
      ],
    };
  }

  onPreSubscribe(connectionId: string, subscriptionId: string, topic: string) {
    const clientSessionId = this.getClientSessionId(connectionId);

    return [
      {
        id: `${subscriptionId}-broadcast`,
        topic: `/topic/${topic}/broadcast/`,
      },
      {
        id: `${subscriptionId}-client-broadcast`,
        topic: `/topic/${topic}/${clientSessionId}/broadcast/`,
      },
      {
        id: `${subscriptionId}-client`,
        topic: `/topic/${topic}/${clientSessionId}`,
      },
    ];
  }

  onPreSend(connectionId: string, request: Request): Request {
    const clientSessionId = this.getClientSessionId(connectionId);

    return {
      ...request,
      headers: [
        ...request.headers,
        {
          id: nanoid(),
          key: 'clientSessionId',
          value: clientSessionId,
          enabled: true,
        },
      ],
    };
  }
}
