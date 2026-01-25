import { use, useEffect } from 'react';
import { SIDEBAR_TOP_OFFSET } from '@/constants/layout-constants';
import { AppContext } from '@/provider/app-init-provider';
import useGlobalSearchStore from '@/store/global-search-store';
import useWorkspaceStore from '@/store/workspace-store';
import { Outlet } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { COMMANDS } from '@/types/command';
import { commandBus } from '@/lib/command-bus';
import { useAppSubscriptions } from '@/hooks/app/use-app-subscriptions';
import { useGlobalShortcuts } from '@/hooks/common/use-global-shortcuts';
import { GlobalSearch } from '@/components/app/search/global-search';
import AppLoader from '@/components/layout/app-loader';
import Topbar from '@/components/layout/app-topbar';

function AppLayout() {
  const { appLoaded, workspacesLoaded, loadingText } = use(AppContext);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);

  const { isOpen, setIsOpen } = useGlobalSearchStore(
    useShallow((state) => ({ isOpen: state.isOpen, setIsOpen: state.setIsOpen }))
  );

  useEffect(() => {
    const unsubscribeGlobalSearch = commandBus.on(COMMANDS.GLOBAL_SEARCH, () => {
      setIsOpen(!isOpen);
    });
    return () => {
      unsubscribeGlobalSearch();
    };
  }, [setIsOpen, isOpen]);

  useAppSubscriptions();
  useGlobalShortcuts();

  const isReady = workspacesLoaded && (!activeWorkspaceId || appLoaded);

  return (
    <>
      <Topbar />
      {isOpen && <GlobalSearch />}
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
