import { use } from 'react';
import { SIDEBAR_TOP_OFFSET } from '@/constants/layout-constants';
import { AppContext } from '@/provider/app-init-provider';
import AppLogo from '@/resources/app-logo.svg';
import AppText from '@/resources/app-text.svg';
import useCommandSearchStore from '@/store/command-search-store';
import useWorkspaceStore from '@/store/workspace-store';
import { Minus, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/components/common/button';
import { Kbd, KbdGroup } from '@/components/common/kbd';
import SettingsButton from '@/components/app/button/settings-button';
import { WindowMaximizeButton } from '@/components/app/button/window-maximize-button';
import ConnectionSelector from '@/components/selector/connection-selector';
import WorkspaceSelector from '@/components/selector/workspace-selector';

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
  return (
    <nav
      style={
        {
          '--sidebar-top-offset': SIDEBAR_TOP_OFFSET,
        } as React.CSSProperties
      }
      className="h-(--sidebar-top-offset) fixed w-full bg-sidebar border flex items-center justify-between"
    >
      <div className="flex items-center gap-2 px-2 flex-1 draggable">
        <div className="flex items-center gap-1 shrink-0">
          <img className="w-8 h-8 shrink-0" src={AppLogo} alt="App Logo" />
          <img className="h-8 shrink-0" src={AppText} alt="App Text" />
        </div>

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
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </Button>
        </div>
      )}

      <div className="flex items-center justify-end flex-1 draggable">
        <SettingsButton />
        <Button variant="ghost" size="icon" onClick={() => window.api.window.minimize()} aria-label="Minimize">
          <Minus />
        </Button>
        <WindowMaximizeButton />
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-red-400!"
          onClick={() => window.api.window.close()}
          aria-label="Close"
        >
          <X />
        </Button>
      </div>
    </nav>
  );
}

export default Topbar;
