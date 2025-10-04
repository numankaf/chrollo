import { SidebarInset, SidebarProvider } from '@/components/common/sidebar';
import Footer from '@/components/layout/app-footer';
import { AppSidebar } from '@/components/layout/app-sidebar';
import Topbar from '@/components/layout/app-topbar';
import { Outlet } from 'react-router';
import { SIDEBAR_WIDTH } from '../constants/layout-constants';

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
        <Topbar></Topbar>
        <AppSidebar />
        <SidebarInset>
          <Outlet></Outlet>
        </SidebarInset>
        <Footer></Footer>
      </SidebarProvider>
    </>
  );
};

export default AppLayout;
