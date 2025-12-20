import { use } from 'react';
import { SIDEBAR_TOP_OFFSET } from '@/constants/layout-constants';
import { AppContext } from '@/provider/app-init-provider';
import { Outlet } from 'react-router';

import AppLoader from '@/components/layout/app-loader';
import Topbar from '@/components/layout/app-topbar';

function AppLayout() {
  const { appLoaded } = use(AppContext);

  return (
    <>
      <Topbar />
      <div
        className="relative"
        style={{
          height: `calc(100vh - ${SIDEBAR_TOP_OFFSET})`,
          top: SIDEBAR_TOP_OFFSET,
        }}
      >
        {!appLoaded && <AppLoader />}
        {appLoaded && <Outlet />}
      </div>
    </>
  );
}

export default AppLayout;
