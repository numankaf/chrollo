import { SIDEBAR_WIDTH_ICON, SIDEBAR_WORKSPACE_OFFSET } from '@/constants/layout-constants';
import useWorkspaceStore from '@/store/workspace-store';
import { Download, Plus } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { useTabNavigation } from '@/hooks/use-tab-navigation';
import { Button } from '@/components/common/button';
import { useSidebar } from '@/components/common/sidebar';
import { WorkspaceTypeIcon } from '@/components/icon/workspace-type-icon';

function SidebarWorkspaceMainHeader() {
  const { selectedWorkspace } = useWorkspaceStore(
    useShallow((state) => ({
      selectedWorkspace: state.selectedWorkspace,
    }))
  );

  const { openAndNavigateToTab } = useTabNavigation();
  const { state } = useSidebar();
  return state === 'expanded' ? (
    <div
      style={{ width: 'var(--sidebar-width)' }}
      className="fixed top-(--sidebar-top-offset) h-10 border-b border-x bg-sidebar flex items-center  duration-300 justify-between p-1"
    >
      {selectedWorkspace && (
        <div
          onClick={() => openAndNavigateToTab(selectedWorkspace)}
          className="hover:text-primary cursor-pointer flex items-center justify-center gap-2 text-sm flex-1 min-w-0 [data-side=right][data-state=collapsed]&:hidden"
        >
          <WorkspaceTypeIcon workspaceType={selectedWorkspace.type} size={16} />
          <span className="flex-1 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
            {selectedWorkspace.name}
          </span>
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
      {selectedWorkspace && (
        <div
          onClick={() => openAndNavigateToTab(selectedWorkspace)}
          style={{ width: `${SIDEBAR_WIDTH_ICON}`, height: `${SIDEBAR_WORKSPACE_OFFSET}` }}
          className="hover:text-primary cursor-pointer fixed top-(--sidebar-top-offset) border-b border-x bg-sidebar flex items-center duration-300 justify-center p-1"
        >
          <WorkspaceTypeIcon workspaceType={selectedWorkspace.type} size={16} />
        </div>
      )}
    </>
  );
}

export default SidebarWorkspaceMainHeader;
