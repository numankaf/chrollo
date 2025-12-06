import { SIDEBAR_WIDTH_ICON, SIDEBAR_WORKSPACE_OFFSET } from '@/constants/layout-constants';
import useTabsStore from '@/store/tab-store';
import { Download, Plus } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { useActiveItem } from '@/hooks/use-active-item';
import { Button } from '@/components/common/button';
import { useSidebar } from '@/components/common/sidebar';
import { WorkspaceTypeIcon } from '@/components/icon/workspace-type-icon';

function SidebarWorkspaceMainHeader() {
  const { activeWorkspace } = useActiveItem();

  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );
  const { state } = useSidebar();
  return state === 'expanded' ? (
    <div
      style={{ width: 'var(--sidebar-width)' }}
      className="fixed top-(--sidebar-top-offset) h-10 border-b border-x bg-sidebar flex items-center  duration-300 justify-between p-1"
    >
      {activeWorkspace && (
        <div
          onClick={() => openTab(activeWorkspace)}
          className="hover:text-primary cursor-pointer flex items-center justify-center gap-2 text-sm flex-1 min-w-0 [data-side=right][data-state=collapsed]&:hidden"
        >
          <WorkspaceTypeIcon workspaceType={activeWorkspace.type} size={16} />
          <span className="flex-1 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">{activeWorkspace.name}</span>
        </div>
      )}
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
    <>
      {activeWorkspace && (
        <div
          onClick={() => openTab(activeWorkspace)}
          style={{ width: `${SIDEBAR_WIDTH_ICON}`, height: `${SIDEBAR_WORKSPACE_OFFSET}` }}
          className="hover:text-primary cursor-pointer fixed top-(--sidebar-top-offset) border-b border-x bg-sidebar flex items-center duration-300 justify-center p-1"
        >
          <WorkspaceTypeIcon workspaceType={activeWorkspace.type} size={16} />
        </div>
      )}
    </>
  );
}

export default SidebarWorkspaceMainHeader;
