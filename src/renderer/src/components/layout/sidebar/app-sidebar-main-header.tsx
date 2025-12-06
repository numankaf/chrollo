import useTabsStore from '@/store/tab-store';
import { ArrowRight, Download, Plus } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { useActiveItem } from '@/hooks/use-active-item';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/common/sidebar';
import { WorkspaceTypeIcon } from '@/components/icon/workspace-type-icon';

function WorkspaceButton() {
  const { activeWorkspace } = useActiveItem();
  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );

  return (
    <>
      <SidebarSeparator className="mx-0" />
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex flex-col items-center h-auto">
                  <WorkspaceTypeIcon workspaceType={activeWorkspace?.type} size={16} />
                  <span className="text-xs truncate">{activeWorkspace?.name || 'No Workspace Selected'}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-30 rounded-lg"
              align="end"
              side="right"
              sideOffset={10}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="text-sm"
                  onClick={() => {
                    if (activeWorkspace) openTab(activeWorkspace);
                  }}
                >
                  <ArrowRight />
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm">
                  <Plus />
                  New
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm">
                  <Download />
                  Import
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}

export default WorkspaceButton;
