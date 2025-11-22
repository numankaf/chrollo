import {
  APP_BREADCRUMB_OFFSET,
  FOOTER_BOTTOM_OFFSET,
  SIDEBAR_TOP_OFFSET,
  SIDEBAR_WIDTH,
  SIDEBAR_WORKSPACE_OFFSET,
} from '@/constants/layout-constants';
import { Outlet } from 'react-router';

import { SidebarInset, SidebarProvider } from '@/components/common/sidebar';
import AppBreadCrumb from '@/components/layout/app-breadcrumb';
import Footer from '@/components/layout/app-footer';
import { AppSidebar } from '@/components/layout/app-sidebar';
import AppTabs from '@/components/layout/app-tabs';
import Topbar from '@/components/layout/app-topbar';

function AppLayout() {
  return (
    <>
      <SidebarProvider
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH,
          } as React.CSSProperties
        }
      >
        <Topbar />
        <AppSidebar />
        <SidebarInset>
          <AppTabs />
          <AppBreadCrumb />
          {/* <ScrollArea
            style={{
              height: `calc(100vh - ${SIDEBAR_TOP_OFFSET} - ${SIDEBAR_WORKSPACE_OFFSET} - ${APP_BREADCRUMB_OFFSET} - ${FOOTER_BOTTOM_OFFSET})`,
            }}
          >
            <Outlet></Outlet>
          </ScrollArea> */}
          <div
            style={{
              height: `calc(100% - ${SIDEBAR_TOP_OFFSET} - ${SIDEBAR_WORKSPACE_OFFSET} - ${APP_BREADCRUMB_OFFSET} - ${FOOTER_BOTTOM_OFFSET})`,
            }}
          >
            <Outlet />
          </div>
        </SidebarInset>
        <Footer />
      </SidebarProvider>
    </>
  );
}

export default AppLayout;
