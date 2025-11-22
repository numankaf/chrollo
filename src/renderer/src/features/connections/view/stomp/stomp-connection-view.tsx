import StompConnectionSettings from '@/features/connections/components/stomp/stomp-connection-settings';
import useConnectionStore from '@/store/connection-store';
import { openStompSocket } from '@/utils/socket-util';
import { useParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/tabs';

function StompConnectionView() {
  const { id } = useParams<{ id: string }>();
  const { getConnection } = useConnectionStore(
    useShallow((state) => ({
      getConnection: state.getConnection,
    }))
  );

  const connection = id ? getConnection(id) : undefined;

  if (!connection) return <div>Connection not found</div>;

  return (
    <div className="m-2">
      <div className="flex gap-2 ">
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
          <StompConnectionSettings />
        </TabsContent>
        <TabsContent value="headers">Headers</TabsContent>
        <TabsContent value="subscriptions">Subscriptions</TabsContent>
      </Tabs>
    </div>
  );
}

export default StompConnectionView;
