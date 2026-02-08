import { useState } from 'react';
import { ArrowRight, Download } from 'lucide-react';

import { useActiveItem } from '@/hooks/app/use-active-item';
import { useTabNavigation } from '@/hooks/app/use-tab-navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';
import { SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/common/sidebar';
import { ImportItemDialog } from '@/components/app/dialog/import-item-dialog';
import { WorkspaceTypeIcon } from '@/components/icon/workspace-type-icon';

function WorkspaceButton() {
  const { activeWorkspace } = useActiveItem();
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const { openTab } = useTabNavigation();

  return (
    <>
      <SidebarSeparator className="mx-0" />
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
            <DropdownMenuItem className="text-sm" onClick={() => setImportDialogOpen(true)}>
              <Download />
              Import
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ImportItemDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} />
    </>
  );
}

export default WorkspaceButton;
