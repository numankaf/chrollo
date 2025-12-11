import type { ReactNode } from 'react';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/common/resizeable';
import SocketMessageConsole from '@/components/app/socket/socket-message-console';

function ResizeableConsoleArea({ children }: { children: ReactNode }) {
  return (
    <>
      <ResizablePanelGroup direction="vertical" autoSaveId="resizeable-console-group">
        <ResizablePanel collapsible minSize={10}>
          {children}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel collapsible collapsedSize={5} className="min-h-8">
          <SocketMessageConsole />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}

export default ResizeableConsoleArea;
