import { SidebarInset, SidebarProvider } from '@/components/common/sidebar';
import Footer from '@/components/layout/app-footer';
import { AppSidebar } from '@/components/layout/app-sidebar';
import AppTabs from '@/components/layout/app-tabs';
import Topbar from '@/components/layout/app-topbar';
import { Outlet } from 'react-router';
import { ScrollArea } from '../components/common/scroll-area';
import AppBreadCrumb from '../components/layout/app-breadcrumb';
import {
  APP_BREADCRUMB_OFFSET,
  FOOTER_BOTTOM_OFFSET,
  SIDEBAR_TOP_OFFSET,
  SIDEBAR_WIDTH,
  SIDEBAR_WORKSPACE_OFFSET,
} from '../constants/layout-constants';

const AppLayout = () => {
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
          <ScrollArea
            className="mx-2"
            style={{
              height: `calc(100vh - ${SIDEBAR_TOP_OFFSET} - ${SIDEBAR_WORKSPACE_OFFSET} - ${APP_BREADCRUMB_OFFSET} - ${FOOTER_BOTTOM_OFFSET})`,
            }}
          >
            <Outlet></Outlet>
          </ScrollArea>
        </SidebarInset>
        <Footer />
      </SidebarProvider>
    </>
  );
};

export default AppLayout;
