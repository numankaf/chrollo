import { useEffect, useRef, useState } from 'react';
import type { PanelImperativeHandle } from 'react-resizable-panels';
import { useDefaultLayout } from 'react-resizable-panels';
import { Outlet } from 'react-router';

import { COMMANDS } from '@/lib/command';
import { commandBus } from '@/lib/command-bus';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/common/resizeable';
import SocketConsole from '@/components/app/socket/console/socket-console';

const CONSOLE_EXPANDED_SIZE_KEY = 'console-expanded-size';
const DEFAULT_EXPANDED_SIZE = 50;

function AppConsoleLayout() {
  const consolePanelRef = useRef<PanelImperativeHandle>(null);
  const lastExpandedSize = useRef(Number(localStorage.getItem(CONSOLE_EXPANDED_SIZE_KEY)) || DEFAULT_EXPANDED_SIZE);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: 'resizeable-console-group',
    storage: localStorage,
  });

  useEffect(() => {
    const unsubscribeToggleRequestConsole = commandBus.on(COMMANDS.TOGGLE_REQUEST_CONSOLE, () => {
      const panel = consolePanelRef.current;
      if (!panel) return;

      if (panel.isCollapsed()) {
        panel.resize(`${lastExpandedSize.current}%`);
      } else {
        lastExpandedSize.current = panel.getSize().asPercentage;
        localStorage.setItem(CONSOLE_EXPANDED_SIZE_KEY, String(lastExpandedSize.current));
        panel.collapse();
      }
    });

    return () => {
      unsubscribeToggleRequestConsole();
    };
  }, []);

  const handleConsoleResize = () => {
    const panel = consolePanelRef.current;
    if (!panel) return;

    const collapsed = panel.isCollapsed();
    setIsConsoleCollapsed(collapsed);

    if (!collapsed) {
      const size = panel.getSize().asPercentage;
      lastExpandedSize.current = size;
      localStorage.setItem(CONSOLE_EXPANDED_SIZE_KEY, String(size));
    }
  };

  return (
    <ResizablePanelGroup orientation="vertical" defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged}>
      <ResizablePanel id="console-main" minSize="10%" defaultSize="50%">
        <Outlet />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        id="console-panel"
        panelRef={consolePanelRef}
        collapsible
        collapsedSize="2.5rem"
        defaultSize="50%"
        maxSize="90%"
        minSize="2.5rem"
        onResize={handleConsoleResize}
      >
        <SocketConsole isCollapsed={isConsoleCollapsed} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default AppConsoleLayout;
