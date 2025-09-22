import { SidebarInset, SidebarProvider } from '@/components/common/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import Topbar from '@/components/layout/app-topbar';
import ConnectionMainContainer from '../components/connections/connection-main-container';
import Footer from '../components/layout/app-footer';

const LayoutConnection = () => {
  return (
    <>
      <SidebarProvider
        style={
          {
            '--sidebar-width': '400px',
          } as React.CSSProperties
        }
      >
        <Topbar></Topbar>
        <AppSidebar />
        <SidebarInset>
          <ConnectionMainContainer />
        </SidebarInset>
        <Footer></Footer>
      </SidebarProvider>
    </>
  );
};

export default LayoutConnection;
