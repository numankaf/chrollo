import AppLogo from '@/resources/app-logo.svg';
import AppText from '@/resources/app-text.svg';
import useWorkspaceStore from '@/store/workspace-store';
import { PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/components/common/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card';
import { Item, ItemActions, ItemContent, ItemTitle } from '@/components/common/item';
import { ScrollArea } from '@/components/common/scroll-area';
import { WorkspaceTypeIcon } from '@/components/icon/workspace-type-icon';

function HomeView() {
  const navigate = useNavigate();
  const { workspaces, setActiveWorkspace } = useWorkspaceStore(
    useShallow((state) => ({
      workspaces: state.workspaces,
      setActiveWorkspace: state.setActiveWorkspace,
    }))
  );
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-3xl flex flex-col max-h-full">
        <div className="flex flex-col items-center shrink-0 mb-6">
          <div className="flex items-center gap-1 shrink-0">
            <img className="w-12 h-12 shrink-0" src={AppLogo} alt="App Logo" />
            <img className="h-16 shrink-0" src={AppText} alt="App Text" />
          </div>
          <p className="m-2 text-muted-foreground text-center line-clamp-2 md:line-clamp-none">
            Explore, test, and debug WebSocket APIs with support for raw WebSocket, STOMP, and Socket.IO. Manage
            multiple connections, organize requests into collections, configure environments, and intercept traffic with
            global scripts.
          </p>
        </div>
        <Card className="flex-1 flex flex-col overflow-hidden min-h-0">
          <CardHeader className="shrink-0">
            <CardTitle className="flex items-center justify-between">
              <div>Workspaces</div>
              <Button variant="outline" size="sm" onClick={() => navigate('/workspace/create')}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Workspace
              </Button>
            </CardTitle>
            <CardDescription>
              Select a workspace to start inspecting WebSocket traffic. Create separate workspaces for different
              projects, environments, or debugging sessions.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden min-h-0 p-1 flex flex-col">
            <ScrollArea className="h-[50vh] px-4">
              <div className="grid gap-3 p-1">
                {workspaces.map((ws) => (
                  <Item variant="outline" key={ws.id}>
                    <WorkspaceTypeIcon workspaceType={ws.type} />
                    <ItemContent>
                      <ItemTitle>{ws.name}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActiveWorkspace(ws.id);
                          navigate('/main/workspace/' + ws.id);
                        }}
                      >
                        Open
                      </Button>
                    </ItemActions>
                  </Item>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default HomeView;
