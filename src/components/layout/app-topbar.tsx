import { ChevronDown } from 'lucide-react';
import { SIDEBAR_TOP_OFFSET } from '../../constants/layout-constants';
import { Button } from '../common/button';

const Topbar = () => {
  return (
    <nav
      style={
        {
          '--sidebar-top-offset': SIDEBAR_TOP_OFFSET,
        } as React.CSSProperties
      }
      className="h-[var(--sidebar-top-offset)] fixed w-full bg-sidebar border-1 flex items-center p-3 gap-2"
    >
      <div className="flex items-center gap-2 cursor-pointer">
        <img className="w-8 h-8" src="/app-logo.svg" alt="App Logo" />
        <span>Scope WS Inspector</span>
      </div>
      <Button variant="ghost">Home</Button>
      <Button variant="ghost">
        Workspaces <ChevronDown />
      </Button>
    </nav>
  );
};

export default Topbar;
