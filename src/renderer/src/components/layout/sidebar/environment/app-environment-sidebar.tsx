import { useEffect, useState } from 'react';
import { confirmDialog } from '@/store/confirm-dialog-store';
import useEnvironmentStore from '@/store/environment-store';
import { exportAsJson } from '@/utils/download-util';
import { applyTextSearch } from '@/utils/search-util';
import { getTabItem } from '@/utils/tab-util';
import { CircleCheck, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import { COMMANDS } from '@/types/command';
import type { Environment } from '@/types/environment';
import { commandBus } from '@/lib/command-bus';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { useTabNavigation } from '@/hooks/app/use-tab-navigation';
import useDebouncedValue from '@/hooks/common/use-debounced-value';
import { useWorkspaceEnvironments } from '@/hooks/workspace/use-workspace-environments';
import { Button } from '@/components/common/button';
import InlineEditText from '@/components/common/inline-edit-text';
import { ScrollArea } from '@/components/common/scroll-area';
import { SearchBar } from '@/components/common/search-input';
import { Separator } from '@/components/common/separator';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from '@/components/common/sidebar';
import OperationsButton, { type OperationButtonItem } from '@/components/app/button/operations-button';
import { AddEnvironmentDialog } from '@/components/app/dialog/add-environment-dialog';
import NoEnvironmentFound from '@/components/app/empty/no-environment-found';
import NoResultsFound from '@/components/app/empty/no-results-found';
import { EnvironmentIcon } from '@/components/icon/environment-icon';

function EnvironmentsSidebar() {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [operationsMenuOpenItemId, setOperationsMenuOpenItemId] = useState<string | null>(null);

  const { openTab, closeTab } = useTabNavigation();
  const { activeTab, activeEnvironment } = useActiveItem();

  const { environments, globalEnvironment } = useWorkspaceEnvironments();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue<string>(search, 300);
  const filteredEnvironments = applyTextSearch(environments, debouncedSearch, (environment) => environment.name);

  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);

  const { deleteEnvironment, cloneEnvironment, updateEnvironment } = useEnvironmentStore(
    useShallow((state) => ({
      deleteEnvironment: state.deleteEnvironment,
      cloneEnvironment: state.cloneEnvironment,
      updateEnvironment: state.updateEnvironment,
    }))
  );

  useEffect(() => {
    const unsubscribeItemRename = commandBus.on(COMMANDS.ITEM_RENAME, () => {
      if (activeTab) setEditingItemId(activeTab.id);
    });

    const unsubscribeItemDuplicate = commandBus.on(COMMANDS.ITEM_DUPLICATE, async () => {
      if (activeTab) {
        const clonedEnvironment = await cloneEnvironment(activeTab.id);
        openTab(clonedEnvironment);
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
            await deleteEnvironment(tabItem.id);
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
  }, [activeTab, cloneEnvironment, closeTab, deleteEnvironment, openTab]);

  function getOperationItems(item: Environment): OperationButtonItem[] {
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
              const clonedEnvironment = await cloneEnvironment(item.id);
              openTab(clonedEnvironment);
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
                await deleteEnvironment(item.id);
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
          {addDialogOpen && <AddEnvironmentDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />}

          <Button size="sm" variant="ghost" onClick={() => setAddDialogOpen(true)}>
            <Plus size={16} />
          </Button>
          <SearchBar
            placeholder="Search environments"
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
              {globalEnvironment && (
                <SidebarMenuButton
                  onClick={() => openTab(globalEnvironment)}
                  className="[&:hover>.operations-trigger]:block [&>.operations-trigger[data-state=open]]:inline-block"
                  isActive={globalEnvironment.id === activeTab?.id}
                  key={globalEnvironment.id}
                  size="sm"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setOperationsMenuOpenItemId(globalEnvironment.id);
                  }}
                >
                  <EnvironmentIcon isGlobal size={16} />
                  <InlineEditText
                    value={globalEnvironment.name}
                    editing={globalEnvironment.id === editingItemId}
                    onComplete={(value) => {
                      updateEnvironment({ ...globalEnvironment, name: value }, { persist: true });
                      setEditingItemId(null);
                    }}
                  />
                </SidebarMenuButton>
              )}

              <Separator className="my-1" />

              {environments.length === 0 && <NoEnvironmentFound />}

              {environments.length !== 0 && filteredEnvironments.length === 0 && (
                <NoResultsFound searchTerm={debouncedSearch} />
              )}

              {filteredEnvironments.map((item) => (
                <SidebarMenuButton
                  onClick={() => openTab(item)}
                  className="[&:hover>.operations-trigger]:block [&>.operations-trigger[data-state=open]]:inline-block"
                  isActive={item.id === activeTab?.id}
                  key={item.id}
                  size="sm"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setOperationsMenuOpenItemId(item.id);
                  }}
                >
                  <EnvironmentIcon size={16} />
                  <InlineEditText
                    value={item.name}
                    editing={item.id === editingItemId}
                    onComplete={(value) => {
                      updateEnvironment({ ...item, name: value }, { persist: true });
                      setEditingItemId(null);
                    }}
                  />
                  {activeEnvironment?.id === item.id && <CircleCheck size={12} color="var(--primary)" />}
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

export default EnvironmentsSidebar;
