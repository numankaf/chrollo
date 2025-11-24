import StompHeaders from '@/features/connections/components/stomp/stomp-headers';
import StompSettings from '@/features/connections/components/stomp/stomp-settings';
import StompSubsciptions from '@/features/connections/components/stomp/stomp-subscriptions';
import useConnectionStore from '@/store/connection-store';
import { openStompSocket } from '@/utils/socket-util';
import { useParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { ScrollArea } from '@/components/common/scroll-area';
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
    <div className="h-full">
      <div className="flex gap-2 mx-2">
        <Input placeholder="Enter Url" />
        <Button onClick={() => openStompSocket('http://localhost:8080/ws')}>Connect</Button>
      </div>
      <Tabs defaultValue="settings" className="w-full mt-3" variant="link" style={{ height: 'calc(100% - 6.25rem)' }}>
        <TabsList className="mx-2">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-full">
          <TabsContent className="mx-2" value="settings">
            <StompSettings />
          </TabsContent>
          <TabsContent value="headers">
            <StompHeaders />
          </TabsContent>
          <TabsContent value="subscriptions">
            <StompSubsciptions />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

export default StompConnectionView;
