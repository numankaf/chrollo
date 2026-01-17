import AppLogo from '@/resources/app-logo.svg';
import AppText from '@/resources/app-text.svg';
import { PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/common/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/common/card';

import { WorkspaceList } from '../components/workspace-list';

function HomeView() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-3xl flex flex-col h-full overflow-hidden">
        <div className="flex flex-col items-center shrink-0 mb-8 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-1 shrink-0">
            <img className="w-14 h-14 shrink-0 shadow-lg rounded-xl" src={AppLogo} alt="App Logo" />
            <img className="h-14 shrink-0" src={AppText} alt="App Text" />
          </div>
          <p className="mt-4 text-muted-foreground text-center max-w-xl text-balance">
            Explore, test, and debug WebSocket APIs with support for raw WebSocket, STOMP, and Socket.IO. Manage
            multiple connections, organize requests into collections, configure environments, and intercept traffic with
            global scripts.
          </p>
        </div>
        <Card className="flex-1 flex flex-col overflow-hidden min-h-0 border-muted/50 shadow-xl animate-in zoom-in-95 duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-xl">
              <div>Workspaces</div>
              <Button variant="outline" size="sm" onClick={() => navigate('/workspace/create')}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Workspace
              </Button>
            </CardTitle>
            <CardDescription className="text-sm">
              Select a workspace to start inspecting WebSocket traffic. Create separate workspaces for different
              projects, environments, or debugging sessions.
            </CardDescription>
          </CardHeader>

          <WorkspaceList />
        </Card>
      </div>
    </div>
  );
}

export default HomeView;
