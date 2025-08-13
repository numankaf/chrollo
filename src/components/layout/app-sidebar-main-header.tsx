import { Button } from '@/components/common/button';
import { Container, Download, Plus } from 'lucide-react';
import { useSidebar } from '../common/sidebar';

const SidebarWorkspaceMainHeader = () => {
  const { state } = useSidebar();
  return (
    <div
      style={{ width: state === 'expanded' ? 'var(--sidebar-width)' : '90px' }}
      className="fixed top-[var(--sidebar-top-offset)] h-[40px] border-b-1 border-x-1 bg-sidebar  flex items-center transition-[width] duration-300  justify-between p-1"
    >
      <div className="hover:text-primary cursor-pointer flex items-center justify-center gap-2 text-xs flex-1 min-w-0 [data-side=right][data-state=collapsed]&:hidden">
        <Container className="w-4 h-4" />
        {state === 'expanded' && (
          <span className="flex-1 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">My Workspace</span>
        )}
      </div>
      {state === 'expanded' && (
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
      )}
    </div>
  );
};

export default SidebarWorkspaceMainHeader;
