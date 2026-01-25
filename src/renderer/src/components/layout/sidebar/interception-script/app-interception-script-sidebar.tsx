import { useEffect, useState } from 'react';
import { confirmDialog } from '@/store/confirm-dialog-store';
import useInterceptionScriptStore from '@/store/interception-script-store';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { exportAsJson } from '@/utils/download-util';
import { applyTextSearch } from '@/utils/search-util';
import { getTabItem } from '@/utils/tab-util';
import { CircleCheck, FileCode, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import { BASE_MODEL_TYPE } from '@/types/base';
import { COMMANDS } from '@/types/command';
import type { InterceptionScript } from '@/types/interception-script';
import { commandBus } from '@/lib/command-bus';
import { useActiveItem } from '@/hooks/app/use-active-item';
import useDebouncedValue from '@/hooks/common/use-debounced-value';
import { useWorkspaceInterceptionScripts } from '@/hooks/workspace/use-workspace-interception-scripts';
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
import NoInterceptionScriptsFound from '@/components/app/empty/no-interception-scripts-found';
import NoResultsFound from '@/components/app/empty/no-results-found';

function AppInterceptionScriptSidebar() {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );
  const { activeTab } = useActiveItem();

  const [operationsMenuOpenItemId, setOperationsMenuOpenItemId] = useState<string | null>(null);

  const interceptionScripts = useWorkspaceInterceptionScripts();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue<string>(search, 300);
  const filteredInterceptionScripts = applyTextSearch(interceptionScripts, debouncedSearch, (script) => script.name);

  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);

  const { activeWorkspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
    }))
  );

  const { saveInterceptionScript, deleteInterceptionScript, cloneInterceptionScript, updateInterceptionScript } =
    useInterceptionScriptStore(
      useShallow((state) => ({
        saveInterceptionScript: state.saveInterceptionScript,
        deleteInterceptionScript: state.deleteInterceptionScript,
        cloneInterceptionScript: state.cloneInterceptionScript,
        updateInterceptionScript: state.updateInterceptionScript,
      }))
    );

  async function onAddSubmit(values: { name: string }) {
    if (!activeWorkspaceId) {
      return;
    }
    try {
      const scriptPayload: InterceptionScript = {
        id: nanoid(),
        name: values.name,
        workspaceId: activeWorkspaceId,
        modelType: BASE_MODEL_TYPE.INTERCEPTION_SCRIPT,
        enabled: false,
        script: '',
      };
      const newScript = await saveInterceptionScript(scriptPayload);
      openTab(newScript);
      setAddDialogOpen(false);
    } catch {
      toast.error('Failed to submit interception script.');
    }
  }

  useEffect(() => {
    const unsubscribeItemRename = commandBus.on(COMMANDS.ITEM_RENAME, () => {
      if (activeTab) setEditingItemId(activeTab.id);
    });

    const unsubscribeItemDuplicate = commandBus.on(COMMANDS.ITEM_DUPLICATE, () => {
      if (activeTab) cloneInterceptionScript(activeTab.id);
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
            await deleteInterceptionScript(tabItem.id);
          },
        });
      }
    });

    return () => {
      unsubscribeItemRename?.();
      unsubscribeItemDuplicate?.();
      unsubscribeItemDelete?.();
    };
  }, [activeTab, cloneInterceptionScript, deleteInterceptionScript]);

  function getOperationItems(item: InterceptionScript): OperationButtonItem[] {
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
              await cloneInterceptionScript(item.id);
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
                await deleteInterceptionScript(item.id);
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
              title="Create Interception Script"
              inputLabel="Script Name"
              inputRequiredLabel="Script name is required."
              inputPlaceholder="Enter a script name"
              defaultValue="New Script"
              open={addDialogOpen}
              onOpenChange={(open) => setAddDialogOpen(open)}
              onSubmit={onAddSubmit}
            />
          )}
          <Button size="sm" variant="ghost" onClick={() => setAddDialogOpen(true)}>
            <Plus size={16} />
          </Button>
          <SearchBar
            placeholder="Search scripts"
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
              {interceptionScripts.length === 0 && <NoInterceptionScriptsFound />}
              {interceptionScripts.length !== 0 && filteredInterceptionScripts.length === 0 && (
                <NoResultsFound searchTerm={debouncedSearch} />
              )}
              {filteredInterceptionScripts.map((item) => (
                <SidebarMenuButton
                  onClick={() => openTab(item)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setOperationsMenuOpenItemId(item.id);
                  }}
                  className="[&:hover>.operations-trigger]:block [&>.operations-trigger[data-state=open]]:inline-block"
                  isActive={item.id === activeTab?.id}
                  key={item.id}
                  size="sm"
                >
                  <FileCode size={16} />
                  <InlineEditText
                    value={item.name}
                    editing={item.id === editingItemId}
                    onComplete={(value) => {
                      updateInterceptionScript({ ...item, name: value }, { persist: true });
                      setEditingItemId(null);
                    }}
                  />
                  {item.enabled && <CircleCheck size={12} color="var(--primary)" />}
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

export default AppInterceptionScriptSidebar;
