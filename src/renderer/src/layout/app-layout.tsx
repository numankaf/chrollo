import { use } from 'react';
import { SIDEBAR_TOP_OFFSET } from '@/constants/layout-constants';
import { AppContext } from '@/provider/app-init-provider';
import { Outlet } from 'react-router';

import { useAppSubscriptions } from '@/hooks/app/use-app-subscriptions';
import { useGlobalShortcuts } from '@/hooks/common/use-global-shortcuts';
import AppLoader from '@/components/layout/app-loader';
import Topbar from '@/components/layout/app-topbar';

function AppLayout() {
  const { appLoaded, loadingText } = use(AppContext);
  useAppSubscriptions();
  useGlobalShortcuts();
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
        {!appLoaded && <AppLoader text={loadingText} />}
        {appLoaded && <Outlet />}
      </div>
    </>
  );
}

export default AppLayout;
