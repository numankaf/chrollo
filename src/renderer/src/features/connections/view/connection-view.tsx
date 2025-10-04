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
import { openStompSocket } from '../../../utils/socket-util';
import ConnectionSettings from '../components/connection-settings';

const ConnectionView = () => {
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
          <ConnectionSettings />
        </TabsContent>
        <TabsContent value="headers">Headers</TabsContent>
        <TabsContent value="subscriptions">Subscriptions</TabsContent>
      </Tabs>
    </div>
  );
};

export default ConnectionView;
