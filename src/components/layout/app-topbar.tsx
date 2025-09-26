import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
import { Button } from '@/components/common/button';
import { Search } from 'lucide-react';
import { SIDEBAR_TOP_OFFSET } from '../../constants/layout-constants';
import WorkspaceSelector from '../workspace/workspace-selector';
import ThemeSwitcher from './theme-switch';

const Topbar = () => {
  return (
    <nav
      style={
        {
          '--sidebar-top-offset': SIDEBAR_TOP_OFFSET,
        } as React.CSSProperties
      }
      className="h-[var(--sidebar-top-offset)] fixed w-full bg-sidebar border-1 flex items-center justify-between p-3 "
    >
      <div className="flex items-center gap-2">
        {' '}
        {/* removed flex-1 */}
        <div className="flex items-center gap-2 cursor-pointer hover:text-primary flex-shrink-0">
          <img className="w-8 h-8 flex-shrink-0" src="/app-logo.svg" alt="App Logo" />
          <span className="whitespace-nowrap flex-shrink-0">Scope WS Inspector</span>
        </div>
        <Button variant="ghost">Home</Button>
        <WorkspaceSelector />
      </div>

      <div className="flex items-center justify-center flex-1">
        <Button variant="outline" className="bg-background! hover:border-primary!">
          <Search />
          <span>Search Inspector</span>
          <span className="text-2xs bg-card! p-0.5 px-1 rounded-md">Ctrl</span>
          <span className="text-2xs bg-card! py-0.5 px-1.5 rounded-md">K</span>
        </Button>
      </div>

      <div className="flex items-center justify-end gap-2 flex-1">
        <ThemeSwitcher />
        <Avatar>
          <AvatarImage src="BROKEN_URL" />
          <AvatarFallback>AN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};

export default Topbar;
