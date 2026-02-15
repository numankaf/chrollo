import { useEffect, useRef } from 'react';
import type { ImperativePanelHandle } from 'react-resizable-panels';
import { Outlet } from 'react-router';

import { COMMANDS } from '@/lib/command';
import { commandBus } from '@/lib/command-bus';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/common/resizeable';
import SocketConsole from '@/components/app/socket/console/socket-console';

function AppConsoleLayout() {
  const consolePanelRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    const unsubscribeToggleRequestConsole = commandBus.on(COMMANDS.TOGGLE_REQUEST_CONSOLE, () => {
      const panel = consolePanelRef.current;
      if (!panel) return;

      if (panel.isCollapsed()) {
        panel.expand();
      } else {
        panel.collapse();
      }
    });

    return () => {
      unsubscribeToggleRequestConsole();
    };
  }, []);

  return (
    <ResizablePanelGroup direction="vertical" autoSaveId="resizeable-console-group">
      <ResizablePanel collapsible minSize={10}>
        <Outlet />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel ref={consolePanelRef} collapsible className="min-h-8">
        <SocketConsole />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default AppConsoleLayout;
