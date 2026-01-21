import { use } from 'react';
import { SIDEBAR_TOP_OFFSET } from '@/constants/layout-constants';
import { AppContext } from '@/provider/app-init-provider';
import useWorkspaceStore from '@/store/workspace-store';
import { Outlet } from 'react-router';

import { useAppSubscriptions } from '@/hooks/app/use-app-subscriptions';
import { useGlobalShortcuts } from '@/hooks/common/use-global-shortcuts';
import AppLoader from '@/components/layout/app-loader';
import Topbar from '@/components/layout/app-topbar';

function AppLayout() {
  const { appLoaded, workspacesLoaded, loadingText } = use(AppContext);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);

  useAppSubscriptions();
  useGlobalShortcuts();

  const isReady = workspacesLoaded && (!activeWorkspaceId || appLoaded);

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
        {!isReady && <AppLoader text={loadingText} />}
        {isReady && <Outlet />}
      </div>
    </>
  );
}

export default AppLayout;
