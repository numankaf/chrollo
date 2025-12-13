import { SIDEBAR_TOP_OFFSET, SIDEBAR_WORKSPACE_OFFSET } from '@/constants/layout-constants';
import { Outlet } from 'react-router';

import { useAppSubscriptions } from '@/hooks/app/use-app-subscriptions';
import { useLayout } from '@/hooks/layout/use-layout';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/common/resizeable';
import { SidebarInset } from '@/components/common/sidebar';
import SocketMessageConsole from '@/components/app/socket/socket-message-console';
import AppBreadcrumb from '@/components/layout/app-breadcrumb';
import AppTabs from '@/components/layout/app-tabs';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';

function AppMainContent() {
  useAppSubscriptions();
  const { activeItem, sidebarRef } = useLayout();
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <ResizablePanelGroup direction="horizontal" autoSaveId="main-content-group">
          <ResizablePanel
            ref={sidebarRef}
            collapsible
            defaultSize={20}
            minSize={20}
            maxSize={50}
            className="bg-sidebar relative h-full"
          >
            {activeItem.component && <activeItem.component />}
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <AppTabs />
            <AppBreadcrumb />
            <div
              style={{
                height: `calc(100% - ${SIDEBAR_TOP_OFFSET} - ${SIDEBAR_WORKSPACE_OFFSET})`,
              }}
              className="flex flex-col overflow-hidden"
            >
              <ResizablePanelGroup direction="vertical" autoSaveId="resizeable-console-group">
                <ResizablePanel collapsible minSize={10}>
                  <Outlet />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel collapsible className="min-h-8">
                  <SocketMessageConsole />
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarInset>
    </>
  );
}

export default AppMainContent;
