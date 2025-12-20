import { Outlet } from 'react-router';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/common/resizeable';
import SocketMessageConsole from '@/components/app/socket/socket-message-console';

function AppConsoleLayout() {
  return (
    <ResizablePanelGroup direction="vertical" autoSaveId="resizeable-console-group">
      <ResizablePanel collapsible minSize={10}>
        <Outlet />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel collapsible className="min-h-8">
        <SocketMessageConsole />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default AppConsoleLayout;
