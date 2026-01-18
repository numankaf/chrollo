import WorkspaceOverview from '@/features/workspaces/workspace/components/workspace-overview';
import WorkspaceSettings from '@/features/workspaces/workspace/components/workspace-settings';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/tabs';

function WorkspaceView() {
  return (
    <div className="m-2 h-full overflow-hidden">
      <Tabs defaultValue="overview" className="w-full h-full" variant="link">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <WorkspaceOverview />
        </TabsContent>
        <TabsContent value="settings">
          <WorkspaceSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default WorkspaceView;
