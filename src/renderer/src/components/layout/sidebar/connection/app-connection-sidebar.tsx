import { useEffect, useState } from 'react';
import AddConnectionPanel from '@/features/connections/components/common/add-connection-panel';
import ConnectionStatusBadge from '@/features/connections/components/common/connection-status-badge';
import { confirmDialog } from '@/store/confirm-dialog-store';
import useConnectionStore from '@/store/connection-store';
import { exportAsJson } from '@/utils/download-util';
import { applyTextSearch } from '@/utils/search-util';
import { getTabItem } from '@/utils/tab-util';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import { COMMANDS } from '@/types/command';
import type { Connection } from '@/types/connection';
import { commandBus } from '@/lib/command-bus';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { useTabNavigation } from '@/hooks/app/use-tab-navigation';
import useDebouncedValue from '@/hooks/common/use-debounced-value';
import { useWorkspaceConnections } from '@/hooks/workspace/use-workspace-connections';
import InlineEditText from '@/components/common/inline-edit-text';
import { ScrollArea } from '@/components/common/scroll-area';
import { SearchBar } from '@/components/common/search-input';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from '@/components/common/sidebar';
import OperationsButton, { type OperationButtonItem } from '@/components/app/button/operations-button';
import NoConnectionFound from '@/components/app/empty/no-connection-found';
import NoResultsFound from '@/components/app/empty/no-results-found';
import { ConnectionIcon } from '@/components/icon/connection-icon';

function ConnectionSidebar() {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [operationsMenuOpenItemId, setOperationsMenuOpenItemId] = useState<string | null>(null);

  const { openTab, closeTab } = useTabNavigation();
  const { activeTab } = useActiveItem();
  const connections = useWorkspaceConnections();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue<string>(search, 300);
  const filteredConnections = applyTextSearch(connections, debouncedSearch, (connection) => connection.name);

  const { deleteConnection, cloneConnection, updateConnection } = useConnectionStore(
    useShallow((state) => ({
      deleteConnection: state.deleteConnection,
      cloneConnection: state.cloneConnection,
      updateConnection: state.updateConnection,
    }))
  );

  useEffect(() => {
    const unsubscribeItemRename = commandBus.on(COMMANDS.ITEM_RENAME, () => {
      if (activeTab) setEditingItemId(activeTab.id);
    });

    const unsubscribeItemDuplicate = commandBus.on(COMMANDS.ITEM_DUPLICATE, async () => {
      if (activeTab) {
        const clonedConnection = await cloneConnection(activeTab.id);
        openTab(clonedConnection);
      }
    });

    const unsubscribeItemDelete = commandBus.on(COMMANDS.ITEM_DELETE, () => {
      if (activeTab) {
        const tabItem = getTabItem(activeTab);
        if (!tabItem) return;

        confirmDialog({
          header: `Delete "${tabItem.name}"`,
          message: `Are you sure you want to delete "${tabItem.name}"?`,
          primaryLabel: 'Delete',
          onPrimaryAction: async () => {
            await deleteConnection(tabItem.id);
            closeTab(tabItem.id);
          },
        });
      }
    });

    return () => {
      unsubscribeItemRename?.();
      unsubscribeItemDuplicate?.();
      unsubscribeItemDelete?.();
    };
  }, [activeTab, cloneConnection, deleteConnection, closeTab, openTab]);

  function getOperationItems(item: Connection): OperationButtonItem[] {
    return [
      {
        id: 'rename',
        content: 'Rename',
        props: {
          className: 'text-sm',
          onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
            setEditingItemId(item.id);
          },
        },
      },
      {
        id: 'duplicate',
        content: 'Duplicate',
        props: {
          className: 'text-sm',
          onClick: async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
            try {
              const clonedConnection = await cloneConnection(item.id);
              openTab(clonedConnection);
            } catch (error) {
              if (error instanceof Error) {
                toast.error(error?.message);
              }
            }
          },
        },
      },
      {
        id: 'export',
        content: 'Export',
        props: {
          className: 'text-sm',
          onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
            exportAsJson(item, item.name);
          },
        },
      },
      {
        id: 'delete',
        content: 'Delete',
        props: {
          className: 'text-red-500 text-sm hover:bg-red-500! hover:text-white!',
          onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
            confirmDialog({
              header: `Delete "${item.name}"`,
              message: `Are you sure you want to delete "${item.name}"?`,
              primaryLabel: 'Delete',
              onPrimaryAction: async () => {
                await deleteConnection(item.id);
                closeTab(item.id);
              },
            });
          },
        },
      },
    ];
  }

  return (
    <SidebarContent className="h-full">
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
              {connections.length === 0 && <NoConnectionFound />}
              {connections.length !== 0 && filteredConnections.length === 0 && (
                <NoResultsFound searchTerm={debouncedSearch} />
              )}
              {filteredConnections.map((item) => (
                <SidebarMenuButton
                  size="sm"
                  className="[&:hover>.operations-trigger]:block [&>.operations-trigger[data-state=open]]:inline-block"
                  isActive={item.id === activeTab?.id}
                  key={item.id}
                  onClick={() => openTab(item)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setOperationsMenuOpenItemId(item.id);
                  }}
                >
                  <ConnectionIcon connectionType={item.connectionType} />
                  <ConnectionStatusBadge connectionId={item.id} />
                  <InlineEditText
                    value={item.name}
                    editing={item.id === editingItemId}
                    onComplete={(value) => {
                      updateConnection({ ...item, name: value }, { persist: true });
                      setEditingItemId(null);
                    }}
                  />
                  <OperationsButton
                    open={operationsMenuOpenItemId === item.id}
                    onOpenChange={(open) => setOperationsMenuOpenItemId(open ? item.id : null)}
                    items={getOperationItems(item)}
                  />
                </SidebarMenuButton>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </ScrollArea>
    </SidebarContent>
  );
}

export default ConnectionSidebar;
