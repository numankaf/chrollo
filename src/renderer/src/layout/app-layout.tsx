import { use } from 'react';
import { SIDEBAR_TOP_OFFSET, SIDEBAR_WIDTH, SIDEBAR_WORKSPACE_OFFSET } from '@/constants/layout-constants';
import { AppContext } from '@/provider/app-init-provider';
import { Outlet } from 'react-router';

import { SidebarInset, SidebarProvider } from '@/components/common/sidebar';
import AppLoader from '@/components/app/app-loader';
import AppBreadCrumb from '@/components/layout/app-breadcrumb';
import Footer from '@/components/layout/app-footer';
import { AppSidebar } from '@/components/layout/app-sidebar';
import AppTabs from '@/components/layout/app-tabs';
import Topbar from '@/components/layout/app-topbar';

function AppLayout() {
  const { appLoaded } = use(AppContext);
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
        {!appLoaded && <AppLoader />}
        {appLoaded && (
          <>
            <AppSidebar />
            <SidebarInset>
              <AppTabs />
              <AppBreadCrumb />
              <div
                style={{
                  height: `calc(100% - ${SIDEBAR_TOP_OFFSET} - ${SIDEBAR_WORKSPACE_OFFSET})`,
                }}
                className="flex flex-col overflow-hidden"
              >
                <Outlet />
              </div>
            </SidebarInset>
          </>
        )}
        <Footer />
      </SidebarProvider>
    </>
  );
}

export default AppLayout;
