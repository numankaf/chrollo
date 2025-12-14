import { Separator } from '@radix-ui/react-select';

import { Badge } from '@/components/common/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/card';

function ScopePlatformPlugin() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Scope Platform Plugin
          <Badge variant="secondary">STOMP</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <p className="text-muted-foreground">
          Client-side plugin for STOMP WebSocket connections that manages session isolation and request–response
          correlation automatically.
        </p>

        <Separator />

        <div className="space-y-2">
          <h4 className="font-medium">Connection Headers</h4>
          <ul className="list-disc pl-5 text-muted-foreground">
            <li>
              <code>login</code> — Bearer token (optional)
            </li>
            <li>
              <code>_clientSessionId</code> — Auto-generated, immutable per connection
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Subscription Expansion</h4>
          <p className="text-muted-foreground">A single topic subscription is expanded into:</p>
          <ul className="list-disc pl-5 text-muted-foreground">
            <li>
              <code>/topic/&lt;topic&gt;/broadcast/</code>
            </li>
            <li>
              <code>/topic/&lt;topic&gt;/&lt;clientSessionId&gt;/broadcast/</code>
            </li>
            <li>
              <code>/topic/&lt;topic&gt;/&lt;clientSessionId&gt;</code>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Outgoing Messages</h4>
          <ul className="list-disc pl-5 text-muted-foreground">
            <li>Adds clientSessionId to message headers</li>
            <li>
              Injects a generated <code>requestId</code> into destination:
              <br />
              <code className="block mt-1">app/secure/&lt;requestId&gt;</code>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default ScopePlatformPlugin;
