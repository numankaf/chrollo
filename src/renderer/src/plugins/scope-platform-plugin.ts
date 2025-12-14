import type { BaseStompPlugin } from '@/plugins/base-plugin';
import { nanoid } from 'nanoid';

import type { Request } from '@/types/collection';
import type { StompConnection } from '@/types/connection';
import { PLUGIN_ID } from '@/types/plugin';

export class ScopePlatformPlugin implements BaseStompPlugin {
  id = PLUGIN_ID.SCOPE_PLATFORM;

  name = 'SCOPE Platform Plugin';

  private clientSessionId = nanoid();

  macros = {
    clientSessionId: () => this.clientSessionId,
    requestId: () => nanoid(),
  };

  onPreConnect(connection: StompConnection): StompConnection {
    return {
      ...connection,
      connectHeaders: [
        ...connection.connectHeaders,
        {
          id: nanoid(),
          key: '_clientSessionId',
          value: this.clientSessionId,
          enabled: true,
        },
      ],
    };
  }

  onPreSubscribe(subscriptionId: string, topic: string) {
    return [
      { id: `${subscriptionId}-broadcast`, topic: `/topic/${topic}/broadcast/` },
      { id: `${subscriptionId}-client-broadcast`, topic: `/topic/${topic}/${this.clientSessionId}/broadcast/` },
      { id: `${subscriptionId}-client`, topic: `/topic/${topic}/${this.clientSessionId}` },
    ];
  }

  onPreSend(request: Request) {
    return {
      ...request,
      headers: [
        ...request.headers,
        {
          id: nanoid(),
          key: 'clientSessionId',
          value: this.clientSessionId,
          enabled: true,
        },
      ],
    };
  }
}
