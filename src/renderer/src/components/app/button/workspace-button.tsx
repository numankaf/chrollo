import { useActiveItem } from '@/hooks/app/use-active-item';
import { useTabNavigation } from '@/hooks/app/use-tab-navigation';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/common/sidebar';
import { WorkspaceTypeIcon } from '@/components/icon/workspace-type-icon';

function WorkspaceButton() {
  const { activeWorkspace } = useActiveItem();
  const { openTab } = useTabNavigation();

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          className="flex flex-col items-center h-auto"
          onClick={() => {
            if (activeWorkspace) openTab(activeWorkspace);
          }}
        >
          <WorkspaceTypeIcon workspaceType={activeWorkspace?.type} size={16} />
          <span className="text-xs truncate">{activeWorkspace?.name || 'No Workspace Selected'}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );
}

export default WorkspaceButton;
