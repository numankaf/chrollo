import {
  makeInfo,
  REQUEST_TYPE,
  SOCKET_MESSAGE_TYPE,
  STOMP_CONNECTION_TYPE,
} from '@/components/app/editor/code-mirror/completions/api/shared';

export const STOMP_API = [
  {
    label: 'onPreConnect',
    type: 'function',
    info: () =>
      makeInfo(
        `
<p>Triggered before connecting.</p>
<pre>
({
  connection: StompConnection
}) => void;



${STOMP_CONNECTION_TYPE}
</pre>
      `.trim()
      ),
  },
  {
    label: 'onPreSubscribe',
    type: 'function',
    info: () =>
      makeInfo(
        `
<p>Triggered before subscribing.</p>
<pre>
({
  connectionId: string,
  subscriptionId: string,
  topic: string,
  subscribe(connectionId, subscriptionId, topic): void,
  disableDefault(): void
}) => void;
</pre>
      `.trim()
      ),
  },
  {
    label: 'onPreUnsubscribe',
    type: 'function',
    info: () =>
      makeInfo(
        `
<p>Triggered before unsubscribing.</p>
<pre>
({
  connectionId: string,
  subscriptionId: string,
  topic: string,
  unsubscribe(connectionId, subscriptionId, topic): void,
  disableDefault(): void
}) => void;
</pre>
      `.trim()
      ),
  },
  {
    label: 'onPreSend',
    type: 'function',
    info: () =>
      makeInfo(
        `
<p>Triggered before sending a message.</p>
<pre>
({
  connectionId: string,
  request: Request
}) => void;



${REQUEST_TYPE}
</pre>
      `.trim()
      ),
  },
  {
    label: 'onMessage',
    type: 'function',
    info: () =>
      makeInfo(
        `
<p>Triggered when a message is received.</p>
<pre>
({
  message: SocketMessage
}) => void;



${SOCKET_MESSAGE_TYPE}
</pre>
      `.trim()
      ),
  },
];
