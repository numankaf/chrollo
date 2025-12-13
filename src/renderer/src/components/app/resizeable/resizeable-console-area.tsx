import type { ReactNode } from 'react';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/common/resizeable';

function ResizeableConsoleArea({ children }: { children: ReactNode }) {
  return (
    <>
      <ResizablePanelGroup direction="vertical" autoSaveId="resizeable-console-group">
        <ResizablePanel collapsible minSize={10}>
          {children}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel collapsible className="min-h-8">
          {/* <SocketMessageConsole /> */}
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}

export default ResizeableConsoleArea;
