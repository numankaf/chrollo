import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/tabs';
import ComingSoon from '@/components/app/empty/coming-soon';

function WorkspaceView() {
  return (
    <div className="m-2">
      <Tabs defaultValue="overview" className="w-full" variant="link" style={{ height: 'calc(100% - 6.5rem)' }}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ComingSoon />
        </TabsContent>
        <TabsContent value="settings">
          <ComingSoon />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default WorkspaceView;
