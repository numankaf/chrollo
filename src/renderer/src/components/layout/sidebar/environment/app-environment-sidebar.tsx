import { useEffect, useState } from 'react';
import { confirmDialog } from '@/store/confirm-dialog-store';
import useEnvironmentStore from '@/store/environment-store';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { applyTextSearch } from '@/utils/search-util';
import { getTabItem } from '@/utils/tab-util';
import { Container, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import { COMMANDS } from '@/types/command';
import type { Environment } from '@/types/environment';
import { ENVIRONMENT_DEFAULT_VALUES } from '@/types/environment';
import { commandBus } from '@/lib/command-bus';
import { useActiveItem } from '@/hooks/app/use-active-item';
import useDebouncedValue from '@/hooks/common/use-debounced-value';
import { useWorkspaceEnvironments } from '@/hooks/workspace/use-workspace-environments';
import { Button } from '@/components/common/button';
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
import { AddItemDialog } from '@/components/app/dialog/add-item-dialog';
import NoEnvironmentFound from '@/components/app/empty/no-environment-found';
import NoResultsFound from '@/components/app/empty/no-results-found';

function EnvironmentsSidebar() {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [operationsMenuOpenItemId, setOperationsMenuOpenItemId] = useState<string | null>(null);
  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );
  const { activeTab } = useActiveItem();

  const environments = useWorkspaceEnvironments();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue<string>(search, 300);
  const filteredEnvironments = applyTextSearch(environments, debouncedSearch, (environment) => environment.name);

  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);

  const { activeWorkspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
    }))
  );

  const { saveEnvironment, deleteEnvironment, cloneEnvironment, updateEnvironment } = useEnvironmentStore(
    useShallow((state) => ({
      saveEnvironment: state.saveEnvironment,
      deleteEnvironment: state.deleteEnvironment,
      cloneEnvironment: state.cloneEnvironment,
      updateEnvironment: state.updateEnvironment,
    }))
  );

  async function onAddSubmit(values: { name: string }) {
    if (!activeWorkspaceId) {
      return;
    }
    try {
      const environmentPayload: Environment = {
        id: nanoid(),
        name: values.name,
        workspaceId: activeWorkspaceId,
        ...ENVIRONMENT_DEFAULT_VALUES,
      };
      const newEnvironment = await saveEnvironment(environmentPayload);
      openTab(newEnvironment);
      setAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to submit environment:', error);
      toast.error('Failed to submit environment.');
    }
  }

  useEffect(() => {
    const unsubscribeItemRename = commandBus.on(COMMANDS.ITEM_RENAME, () => {
      if (activeTab) setEditingItemId(activeTab.id);
    });

    const unsubscribeItemDuplicate = commandBus.on(COMMANDS.ITEM_DUPLICATE, () => {
      if (activeTab) cloneEnvironment(activeTab.id);
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
          },
        });
      }
    });

    return () => {
      unsubscribeItemRename?.();
      unsubscribeItemDuplicate?.();
      unsubscribeItemDelete?.();
    };
  }, [activeTab, cloneEnvironment, deleteEnvironment]);

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
              await cloneEnvironment(item.id);
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
              onPrimaryAction: async () => {
                await deleteEnvironment(item.id);
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
          {addDialogOpen && (
            <AddItemDialog
              title="Create Environment"
              inputLabel="Environment Name"
              inputRequiredLabel="Environment name is required."
              inputPlaceholder="Enter a environment name"
              defaultValue="New Environment"
              open={addDialogOpen}
              onOpenChange={(open) => setAddDialogOpen(open)}
              onSubmit={onAddSubmit}
            />
          )}
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
                  <Container size={16} />
                  <InlineEditText
                    value={item.name}
                    editing={item.id === editingItemId}
                    onComplete={(value) => {
                      updateEnvironment({ ...item, name: value }, { persist: true });
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

export default EnvironmentsSidebar;
