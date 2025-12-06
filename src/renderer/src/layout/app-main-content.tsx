import { FOOTER_BOTTOM_OFFSET, SIDEBAR_TOP_OFFSET, SIDEBAR_WORKSPACE_OFFSET } from '@/constants/layout-constants';
import { Outlet } from 'react-router';

import { useAppSubscriptions } from '@/hooks/use-app-subscriptions';
import { useLayout } from '@/hooks/use-layout';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/common/resizeable';
import AppBreadcrumb from '@/components/layout/app-breadcrumb';
import AppTabs from '@/components/layout/app-tabs';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';

function AppMainContent() {
  useAppSubscriptions();
  const { activeItem, sidebarRef } = useLayout();

  return (
    <>
      <main
        style={{
          width: `calc(100%)`,
          height: `calc(100vh - ${SIDEBAR_TOP_OFFSET} - ${FOOTER_BOTTOM_OFFSET})`,
        }}
        className="flex flex-row bg-background relative  w-full flex-1 top-(--sidebar-top-offset)"
      >
        <AppSidebar />
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
              <Outlet />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </>
  );
}

export default AppMainContent;
