import { Outlet } from 'react-router';

import { SidebarInset, SidebarProvider } from '@/components/common/sidebar';
import Footer from '@/components/layout/app-footer';
import { AppSidebar } from '@/components/layout/app-sidebar';
import AppTabs from '@/components/layout/app-tabs';
import Topbar from '@/components/layout/app-topbar';

import AppBreadCrumb from '../components/layout/app-breadcrumb';
import { SIDEBAR_WIDTH } from '../constants/layout-constants';

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
          <Outlet />
        </SidebarInset>
        <Footer />
      </SidebarProvider>
    </>
  );
}

export default AppLayout;
