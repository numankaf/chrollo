import { use, useEffect, useEffectEvent, useRef } from 'react';
import { SIDEBAR_TOP_OFFSET } from '@/constants/layout-constants';
import { AppContext } from '@/provider/app-init-provider';
import useCommandSearchStore from '@/store/command-search-store';
import useWorkspaceStore from '@/store/workspace-store';
import { Outlet } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { COMMANDS } from '@/lib/command';
import { commandBus } from '@/lib/command-bus';
import { useAppSubscriptions } from '@/hooks/app/use-app-subscriptions';
import { useNavigationSync } from '@/hooks/app/use-navigation-sync';
import { useGlobalShortcuts } from '@/hooks/common/use-global-shortcuts';
import { useLoadAndNavigateWorkspace } from '@/hooks/workspace/use-load-and-navigate-workspace';
import CommandSearchDialog from '@/components/app/search/command-search-dialog';
import AppLoader from '@/components/layout/app-loader';
import Topbar from '@/components/layout/app-topbar';

function AppLayout() {
  const { appLoaded, workspacesLoaded, loadingText } = use(AppContext);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);

  const { isOpen, setIsOpen } = useCommandSearchStore(
    useShallow((state) => ({ isOpen: state.isOpen, setIsOpen: state.setIsOpen }))
  );

  const loadAndNavigateWorkspace = useLoadAndNavigateWorkspace();

  const didInitRef = useRef(false);

  const loadWorkspaceInitialData = useEffectEvent(async (id: string) => {
    await loadAndNavigateWorkspace(id);
  });

  useEffect(() => {
    if (didInitRef.current) return;
    if (!activeWorkspaceId) return;

    didInitRef.current = true;
    loadWorkspaceInitialData(activeWorkspaceId);
  }, [activeWorkspaceId]);

  useEffect(() => {
    const unsubscribeGlobalSearch = commandBus.on(COMMANDS.GLOBAL_SEARCH, () => {
      setIsOpen(!isOpen);
    });
    return () => {
      unsubscribeGlobalSearch();
    };
  }, [setIsOpen, isOpen]);

  useAppSubscriptions();
  useNavigationSync();
  useGlobalShortcuts();

  const isReady = workspacesLoaded && (!activeWorkspaceId || appLoaded);
  return (
    <>
      <Topbar />
      {isOpen && <CommandSearchDialog />}
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
