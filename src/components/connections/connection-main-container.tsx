import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/common/breadcrumb';
import { Button } from '@/components/common/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/tabs';
import { Waypoints } from 'lucide-react';
import { Input } from '../common/input';

const ConnectionMainContainer = () => {
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
        <Button>Connect</Button>
      </div>
      <Tabs defaultValue="settings" className="w-full mt-3" variant="link">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <div className="mt-3 mx-5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex-1 space-y-1">
                <p className="text-sm">Reconnection Delay</p>
                <p className="text-muted-foreground text-xs">
                  Time (ms) to wait before trying to reconnect after connection loss.
                </p>
              </div>
              <Input className="w-30 h-8" type="number" value={5000} onChange={() => {}} />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex-1 space-y-1">
                <p className="text-sm">Max Reconnect Attempts</p>
                <p className="text-muted-foreground text-xs">
                  Maximum reconnection attempts when the connection closes abruptly.
                </p>
              </div>
              <Input className="w-30 h-8" type="number" value={10} onChange={() => {}} />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex-1 space-y-1">
                <p className="text-sm">Connection Timeout</p>
                <div className="text-muted-foreground text-xs">
                  <p className="text-sm">Max time to wait for CONNECT frame before failing.</p>
                </div>
              </div>
              <Input className="w-30 h-8" type="number" value={10000} onChange={() => {}} />
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
