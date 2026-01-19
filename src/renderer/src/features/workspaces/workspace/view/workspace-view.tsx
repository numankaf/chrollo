import WorkspaceOverview from '@/features/workspaces/workspace/components/workspace-overview';
import WorkspaceSettings from '@/features/workspaces/workspace/components/workspace-settings';
import useWorkspaceStore from '@/store/workspace-store';
import { useShallow } from 'zustand/react/shallow';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/tabs';

function WorkspaceView() {
  const { activeWorkspaceId, workspaces } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
      workspaces: state.workspaces,
    }))
  );

  const workspace = workspaces.find((w) => w.id === activeWorkspaceId);

  if (!workspace) return null;

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="overview" className="w-full h-full" variant="link">
        <TabsList className="px-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <div className="flex-1 min-h-0 relative">
          <TabsContent value="overview" className="h-full absolute inset-0">
            <WorkspaceOverview />
          </TabsContent>
          <TabsContent value="settings" className="h-full absolute inset-0">
            <WorkspaceSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default WorkspaceView;
