import { SIDEBAR_TOP_OFFSET, SIDEBAR_WORKSPACE_OFFSET } from '@/constants/layout-constants';
import { Outlet } from 'react-router';

import { useAppSubscriptions } from '@/hooks/use-app-subscriptions';
import { useLayout } from '@/hooks/use-layout';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/common/resizeable';
import { SidebarInset } from '@/components/common/sidebar';
import AppBreadcrumb from '@/components/layout/app-breadcrumb';
import AppTabs from '@/components/layout/app-tabs';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import SidebarWorkspaceMainHeader from '@/components/layout/sidebar/app-sidebar-main-header';

function AppMainContent() {
  useAppSubscriptions();
  const { activeItem, sidebarRef } = useLayout();
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <SidebarWorkspaceMainHeader />
        <ResizablePanelGroup direction="horizontal" autoSaveId="main-content-group">
          <ResizablePanel
            ref={sidebarRef}
            collapsible
            defaultSize={20}
            minSize={20}
            maxSize={50}
            className="bg-sidebar relative"
            style={{
              height: `calc(100% - ${SIDEBAR_WORKSPACE_OFFSET})`,
              top: SIDEBAR_WORKSPACE_OFFSET,
            }}
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
      </SidebarInset>
    </>
  );
}

export default AppMainContent;
