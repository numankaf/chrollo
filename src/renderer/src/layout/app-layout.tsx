import { use } from 'react';
import { SIDEBAR_WIDTH } from '@/constants/layout-constants';
import AppMainContent from '@/layout/app-main-content';
import { AppContext } from '@/provider/app-init-provider';

import { SidebarProvider } from '@/components/common/sidebar';
import Footer from '@/components/layout/app-footer';
import AppLoader from '@/components/layout/app-loader';
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
        {appLoaded && <AppMainContent />}
        <Footer />
      </SidebarProvider>
    </>
  );
}

export default AppLayout;
