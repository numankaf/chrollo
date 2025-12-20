import { APP_BREADCRUMB_OFFSET, SIDEBAR_WIDTH_ICON, SIDEBAR_WORKSPACE_OFFSET } from '@/constants/layout-constants';
import { LayoutProvider } from '@/provider/layout-provider';
import { Outlet } from 'react-router';

import { useAppSubscriptions } from '@/hooks/app/use-app-subscriptions';
import { useLayout } from '@/hooks/layout/use-layout';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/common/resizeable';
import { SidebarInset, SidebarProvider } from '@/components/common/sidebar';
import AppBreadcrumb from '@/components/layout/app-breadcrumb';
import Footer from '@/components/layout/app-footer';
import AppTabs from '@/components/layout/app-tabs';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';

function AppMainLayoutInner() {
  useAppSubscriptions();
  const { activeItem, sidebarRef } = useLayout();

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': SIDEBAR_WIDTH_ICON,
        } as React.CSSProperties
      }
    >
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
                height: `calc(100% - ${APP_BREADCRUMB_OFFSET} - ${SIDEBAR_WORKSPACE_OFFSET})`,
              }}
              className="flex flex-col overflow-hidden"
            >
              <Outlet />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarInset>
      <Footer />
    </SidebarProvider>
  );
}

function AppMainLayout() {
  return (
    <LayoutProvider>
      <AppMainLayoutInner />
    </LayoutProvider>
  );
}

export default AppMainLayout;
