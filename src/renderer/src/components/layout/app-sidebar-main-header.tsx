import { SIDEBAR_WIDTH_ICON, SIDEBAR_WORKSPACE_OFFSET } from '@/constants/layout-constants';
import { Container, Download, Plus } from 'lucide-react';

import { Button } from '@/components/common/button';
import { useSidebar } from '@/components/common/sidebar';

function SidebarWorkspaceMainHeader() {
  const { state } = useSidebar();
  return state === 'expanded' ? (
    <div
      style={{ width: 'var(--sidebar-width)' }}
      className="fixed top-[var(--sidebar-top-offset)] h-[40px] border-b-1 border-x-1 bg-sidebar flex items-center  duration-300 justify-between p-1"
    >
      <div className="hover:text-primary cursor-pointer flex items-center justify-center gap-2 text-sm flex-1 min-w-0 [data-side=right][data-state=collapsed]&:hidden">
        <Container className="w-4 h-4" />
        <span className="flex-1 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">My Workspace</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="xs">
          <Plus />
          New
        </Button>
        <Button variant="outline" size="xs">
          <Download />
          Import
        </Button>
      </div>
    </div>
  ) : (
    <div
      style={{ width: `${SIDEBAR_WIDTH_ICON}`, height: `${SIDEBAR_WORKSPACE_OFFSET}` }}
      className="fixed top-[var(--sidebar-top-offset)] border-b-1 border-x-1 bg-sidebar flex items-center duration-300 justify-center p-1"
    >
      <Container className="w-4 h-4" />
    </div>
  );
}

export default SidebarWorkspaceMainHeader;
