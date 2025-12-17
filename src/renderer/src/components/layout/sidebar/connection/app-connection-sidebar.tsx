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
import { useActiveItem } from '@/hooks/app/use-active-item';
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
  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );
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
          onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
            try {
              cloneConnection(item.id);
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
          onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
            confirmDialog({
              header: `Delete "${item.name}"`,
              message: `Are you sure you want to delete "${item.name}"?`,
              primaryLabel: 'Delete',
              onPrimaryAction: () => {
                deleteConnection(item.id);
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
                  className="[&:hover>#operations-trigger]:block [&>#operations-trigger[data-state=open]]:inline-block"
                  isActive={item.id === activeTab?.id}
                  key={item.id}
                  onClick={() => openTab(item)}
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
                  <OperationsButton items={getOperationItems(item)} />
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
