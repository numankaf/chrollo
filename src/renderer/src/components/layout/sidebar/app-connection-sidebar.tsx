import { useState } from 'react';
import AddConnectionPanel from '@/features/connections/components/common/add-connection-panel';
import ConnectionStatusBadge from '@/features/connections/components/common/connection-status-badge';
import { confirmDialog } from '@/store/confirm-dialog-store';
import useConnectionStore from '@/store/connection-store';
import useTabsStore from '@/store/tab-store';
import { applyTextSearch } from '@/utils/search-util';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import type { Connection } from '@/types/connection';
import { useActiveItem } from '@/hooks/workspace/use-active-item';
import { useWorkspaceConnections } from '@/hooks/workspace/use-workspace-connections';
import { ScrollArea } from '@/components/common/scroll-area';
import { SearchBar } from '@/components/common/search-input';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/common/sidebar';
import OperationsButton, { type OperationButtonItem } from '@/components/app/operations-button';
import { ConnectionIcon } from '@/components/icon/connection-icon';

function ConnectionSidebar() {
  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );
  const { activeTab } = useActiveItem();
  const connections = useWorkspaceConnections();
  const [search, setSearch] = useState('');
  const filteredConnections = applyTextSearch(connections, search, (connection) => connection.name);

  const { deleteConnection, cloneConnection } = useConnectionStore(
    useShallow((state) => ({
      deleteConnection: state.deleteConnection,
      cloneConnection: state.cloneConnection,
    }))
  );

  function getOperationItems(item: Connection): OperationButtonItem[] {
    return [
      {
        id: 'rename',
        content: 'Rename',
        props: { className: 'text-sm' },
      },
      {
        id: 'duplicate',
        content: 'Duplicate',
        props: {
          className: 'text-sm',
          onClick: async (e) => {
            e.stopPropagation();
            try {
              await cloneConnection(item.id);
            } catch (error) {
              if (error instanceof Error) {
                toast.error(error?.message);
              }
            }
          },
        },
      },
      {
        id: 'delete',
        content: 'Delete',
        props: {
          className: 'text-red-500 text-sm hover:bg-red-500! hover:text-white!',
          onClick: (e) => {
            e.stopPropagation();
            confirmDialog({
              header: `Delete "${item.name}"`,
              message: `Are you sure you want to delete "${item.name}"?`,
              actionLabel: 'Delete',
              accept: async () => {
                await deleteConnection(item.id);
              },
            });
          },
        },
      },
    ];
  }

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarContent className="w-(--sidebar-width-content)!">
        <SidebarHeader className="m-0! p-0!">
          <div className="flex items-center justify-between p-1 gap-1">
            <AddConnectionPanel />
            <SearchBar
              placeholder="Search socket connections"
              className="flex-1"
              onSearchChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
        </SidebarHeader>
        <ScrollArea style={{ height: 'calc(100% - 3.5rem)' }}>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredConnections.map((item) => (
                  <SidebarMenuButton
                    size="sm"
                    className={`${activeTab?.id === item.id && 'border-l-primary! bg-sidebar-accent'} border-l border-l-transparent data-[active=true]:bg-transparent [&:hover>#operations-trigger]:block [&>#operations-trigger[data-state=open]]:inline-block`}
                    key={item.id}
                    onClick={() => openTab(item)}
                  >
                    <ConnectionIcon connectionType={item.connectionType} />
                    <ConnectionStatusBadge connectionId={item.id} />
                    <span className="flex-1 overflow-hidden text-nowrap text-ellipsis">{item.name}</span>
                    <OperationsButton items={getOperationItems(item)} />
                  </SidebarMenuButton>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export default ConnectionSidebar;
