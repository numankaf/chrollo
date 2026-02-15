import { use, useEffect, useState } from 'react';
import { SIDEBAR_TOP_OFFSET } from '@/constants/layout-constants';
import { AppContext } from '@/provider/app-init-provider';
import useCommandSearchStore from '@/store/command-search-store';
import useWorkspaceStore from '@/store/workspace-store';
import { Maximize, Minimize, Minus, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { SHORTCUTS } from '@/lib/command';
import { getPlatform } from '@/lib/platform';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/button';
import { Shortcut } from '@/components/common/shortcut';
import SettingsButton from '@/components/app/button/settings-button';
import ConnectionSelector from '@/components/selector/connection-selector';
import WorkspaceSelector from '@/components/selector/workspace-selector';

const { isMac } = getPlatform();

function WindowControls() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    window.api.window.isMaximized().then(setIsMaximized);
    window.listener.window.onMaximizeChange(setIsMaximized);
  }, []);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => window.api.window.minimize()} aria-label="Minimize">
        <Minus />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => (isMaximized ? window.api.window.unmaximize() : window.api.window.maximize())}
        aria-label={isMaximized ? 'Restore' : 'Maximize'}
      >
        {isMaximized ? <Minimize /> : <Maximize />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-red-400!"
        onClick={() => window.api.window.close()}
        aria-label="Close"
      >
        <X />
      </Button>
    </>
  );
}

function Topbar() {
  const navigate = useNavigate();
  const { appLoaded, workspacesLoaded } = use(AppContext);
  const { activeWorkspaceId, setActiveWorkspace } = useWorkspaceStore(
    useShallow((state) => ({
      setActiveWorkspace: state.setActiveWorkspace,
      activeWorkspaceId: state.activeWorkspaceId,
    }))
  );
  const setIsOpen = useCommandSearchStore((state) => state.setIsOpen);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    window.listener.window.onFullscreenChange(setIsFullscreen);
  }, []);

  const showTrafficLightPadding = isMac && !isFullscreen;

  return (
    <nav
      style={
        {
          '--sidebar-top-offset': SIDEBAR_TOP_OFFSET,
        } as React.CSSProperties
      }
      className="h-(--sidebar-top-offset) fixed w-full bg-sidebar border flex items-center justify-between"
    >
      <div className={cn('flex items-center gap-2 px-2 flex-1 draggable', showTrafficLightPadding && 'pl-20')}>
        {workspacesLoaded && (
          <Button
            variant="ghost"
            onClick={() => {
              navigate('/home');
              setActiveWorkspace(undefined);
            }}
          >
            Home
          </Button>
        )}
        {workspacesLoaded && <WorkspaceSelector />}
        {appLoaded && activeWorkspaceId && <ConnectionSelector />}
      </div>

      {workspacesLoaded && (
        <div className="flex items-center justify-center flex-1 draggable">
          <Button
            variant="outline"
            className="bg-background! hover:border-primary! text-muted-foreground gap-4"
            onClick={() => setIsOpen(true)}
          >
            <Search />
            <span>Search Chrollo</span>
            <Shortcut shortcut={SHORTCUTS.SEARCH_COMMANDS} />
          </Button>
        </div>
      )}

      <div className={cn('flex items-center justify-end flex-1 draggable', isMac && 'pr-2')}>
        <SettingsButton />
        {!isMac && <WindowControls />}
      </div>
    </nav>
  );
}

export default Topbar;
