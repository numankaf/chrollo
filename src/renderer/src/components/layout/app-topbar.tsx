import { SIDEBAR_TOP_OFFSET } from '@/constants/layout-constants';
import AppLogo from '@/resources/app-logo.svg';
import { Maximize, Minus, Search, X } from 'lucide-react';

import { Button } from '@/components/common/button';
import ThemeSwitcher from '@/components/layout/theme-switch';
import WorkspaceSelector from '@/components/selector/workspace-selector';

function Topbar() {
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
        <div className="flex items-center gap-2 cursor-pointer hover:text-primary shrink-0">
          <img className="w-8 h-8 shrink-0" src={AppLogo} alt="App Logo" />
          <span className="whitespace-nowrap shrink-0 text-primary">Scope WS Inspector</span>
        </div>
        <Button variant="ghost">Home</Button>
        <WorkspaceSelector />
      </div>

      <div className="flex items-center justify-center flex-1 draggable">
        <Button variant="outline" className="bg-background! hover:border-primary!">
          <Search />
          <span>Search Inspector</span>
          <span className="text-xs bg-card! p-0.5 px-1 rounded-md">Ctrl</span>
          <span className="text-xs bg-card! py-0.5 px-1.5 rounded-md">K</span>
        </Button>
      </div>

      <div className="flex items-center justify-end flex-1 draggable">
        <ThemeSwitcher />
        <Button variant="ghost" size="icon" onClick={() => window.api.view.minimize()} aria-label="Minimize">
          <Minus />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => window.api.view.maximize()} aria-label="Maximize">
          <Maximize />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-red-400!"
          onClick={() => window.api.view.close()}
          aria-label="Close"
        >
          <X />
        </Button>
      </div>
    </nav>
  );
}

export default Topbar;
