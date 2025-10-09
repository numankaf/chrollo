import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { useState } from 'react';
const ConnectionSettings = () => {
  const [on, setOn] = useState(false);
  return (
    <div className="mt-3 mx-5 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-1">
          <p className="">Connection Timeout</p>
          <p className="text-muted-foreground text-sm">
            Will retry if Stomp connection is not established in specified milliseconds.
          </p>
          <p className="text-muted-foreground text-sm"> Default 0, which switches off automatic reconnection.</p>
        </div>
        <Input className="w-25 h-8" type="number" value={0} onChange={() => {}} />
      </div>
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-1">
          <p className="">Reconnection Delay</p>
          <p className="text-muted-foreground text-sm">
            Automatically reconnect with delay in milliseconds, set to 0 to disable.
          </p>
        </div>
        <Input className="w-25 h-8" type="number" value={5000} onChange={() => {}} />
      </div>
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-1">
          <p className="">Max Reconnect Delay</p>
          <p className="text-muted-foreground text-sm">
            Maximum time to wait between reconnects, in milliseconds. Set to 0 for no limit on wait time.
          </p>
        </div>
        <Input className="w-25 h-8" type="number" value={30000} onChange={() => {}} />
      </div>
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-1">
          <p className="">Heartbeat Incoming</p>
          <div className="text-muted-foreground text-sm">
            <p className="">Incoming heartbeat interval in milliseconds. Set to 0 to disable.</p>
          </div>
        </div>
        <Input className="w-25 h-8" type="number" value={10000} onChange={() => {}} />
      </div>
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-1">
          <p className="">Heartbeat Outgoing</p>
          <p className="text-muted-foreground text-sm">
            Outgoing heartbeat interval in milliseconds. Set to 0 to disable.
          </p>
        </div>
        <Input className="w-25 h-8" type="number" value={10000} onChange={() => {}} />
      </div>
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-1">
          <p className="">Split Large Frames</p>
          <p className="text-muted-foreground text-sm">
            This switches on a non-standard behavior while sending WebSocket packets.
          </p>
          <p className="text-muted-foreground text-sm">
            It splits larger (text) packets into chunks of `Max WebSocket Chunk Size`.
          </p>
          <p className="text-muted-foreground text-sm">
            Only Java Spring brokers seem to support this mode. WebSockets, by itself, split large (text) packets.
          </p>
        </div>
        <Button
          className="w-25 h-8"
          variant="toggle"
          data-state={on ? 'on' : 'off'}
          onClick={() => setOn((prev) => !prev)}
        >
          {on ? 'Enabled' : 'Disabled'}
        </Button>
      </div>
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-1">
          <p className="">Max WebSocket Chunk Size</p>
          <div className="text-muted-foreground text-sm">
            <p className="">
              Maximum allowed message size in MB. This has no effect if `Split Large Frames` is not enabled.
            </p>
          </div>
        </div>
        <Input className="w-25 h-8" type="number" value={10} onChange={() => {}} />
      </div>
    </div>
  );
};

export default ConnectionSettings;
