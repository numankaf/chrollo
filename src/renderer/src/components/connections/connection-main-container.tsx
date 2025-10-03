import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/common/breadcrumb';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/tabs';
import { Waypoints } from 'lucide-react';
import { useState } from 'react';
import { openStompSocket } from '../../utils/socket-util';

const ConnectionMainContainer = () => {
  const [on, setOn] = useState(false);

  return (
    <div className="m-3">
      <Breadcrumb className="py-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Waypoints className="w-4 h-4" />
            <BreadcrumbLink>Connections</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>ws-connection-tukks</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex gap-2">
        <Input placeholder="Enter Url" />
        <Button onClick={() => openStompSocket('http://localhost:8080/ws')}>Connect</Button>
      </div>
      <Tabs defaultValue="settings" className="w-full mt-3" variant="link">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <div className="mt-3 mx-5 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-1">
                <p className="text-sm">Connection Timeout</p>
                <p className="text-muted-foreground text-xs">
                  Will retry if Stomp connection is not established in specified milliseconds.
                </p>
                <p className="text-muted-foreground text-xs"> Default 0, which switches off automatic reconnection.</p>
              </div>
              <Input className="w-25 h-8" type="number" value={0} onChange={() => {}} />
            </div>
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-1">
                <p className="text-sm">Reconnection Delay</p>
                <p className="text-muted-foreground text-xs">
                  Automatically reconnect with delay in milliseconds, set to 0 to disable.
                </p>
              </div>
              <Input className="w-25 h-8" type="number" value={5000} onChange={() => {}} />
            </div>
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-1">
                <p className="text-sm">Max Reconnect Delay</p>
                <p className="text-muted-foreground text-xs">
                  Maximum time to wait between reconnects, in milliseconds. Set to 0 for no limit on wait time.
                </p>
              </div>
              <Input className="w-25 h-8" type="number" value={30000} onChange={() => {}} />
            </div>
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-1">
                <p className="text-sm">Heartbeat Incoming</p>
                <div className="text-muted-foreground text-xs">
                  <p className="text-sm">Incoming heartbeat interval in milliseconds. Set to 0 to disable.</p>
                </div>
              </div>
              <Input className="w-25 h-8" type="number" value={10000} onChange={() => {}} />
            </div>
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-1">
                <p className="text-sm">Heartbeat Outgoing</p>
                <p className="text-muted-foreground text-xs">
                  Outgoing heartbeat interval in milliseconds. Set to 0 to disable.
                </p>
              </div>
              <Input className="w-25 h-8" type="number" value={10000} onChange={() => {}} />
            </div>
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-1">
                <p className="text-sm">Split Large Frames</p>
                <p className="text-muted-foreground text-xs">
                  This switches on a non-standard behavior while sending WebSocket packets.
                </p>
                <p className="text-muted-foreground text-xs">
                  It splits larger (text) packets into chunks of `Max WebSocket Chunk Size`.
                </p>
                <p className="text-muted-foreground text-xs">
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
                <p className="text-sm">Max WebSocket Chunk Size</p>
                <div className="text-muted-foreground text-xs">
                  <p className="text-sm">
                    Maximum allowed message size in MB. This has no effect if `Split Large Frames` is not enabled.
                  </p>
                </div>
              </div>
              <Input className="w-25 h-8" type="number" value={8192} onChange={() => {}} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="headers">Headers</TabsContent>
        <TabsContent value="subscriptions">Subscriptions</TabsContent>
      </Tabs>
    </div>
  );
};

export default ConnectionMainContainer;
