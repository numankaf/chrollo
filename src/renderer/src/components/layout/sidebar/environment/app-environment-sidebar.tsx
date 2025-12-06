import { useState } from 'react';
import { confirmDialog } from '@/store/confirm-dialog-store';
import useEnvironmentStore from '@/store/environment-store';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { applyTextSearch } from '@/utils/search-util';
import { Container, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import type { Environment } from '@/types/environment';
import { ENVIRONMENT_DEFAULT_VALUES } from '@/types/environment';
import { useActiveItem } from '@/hooks/use-active-item';
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

function EnvironmentsSidebar() {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );
  const { activeTab } = useActiveItem();

  const environments = useWorkspaceEnvironments();
  const [search, setSearch] = useState('');

  const filteredEnvironments = applyTextSearch(environments, search, (environment) => environment.name);

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
        id: nanoid(8),
        name: values.name,
        workspaceId: activeWorkspaceId,
        ...ENVIRONMENT_DEFAULT_VALUES,
      };
      const newEnvironment = saveEnvironment(environmentPayload);
      openTab(newEnvironment);
      setAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to submit environment:', error);
      toast.error('Failed to submit environment.');
    }
  }

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
          onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
            try {
              cloneEnvironment(item.id);
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
              actionLabel: 'Delete',
              accept: () => {
                deleteEnvironment(item.id);
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
              {filteredEnvironments.map((item) => (
                <SidebarMenuButton
                  onClick={() => openTab(item)}
                  className={`${activeTab?.id === item.id && 'border-l-primary! bg-sidebar-accent'} border-l border-l-transparent data-[active=true]:bg-transparent [&:hover>#operations-trigger]:block [&>#operations-trigger[data-state=open]]:inline-block`}
                  key={item.id}
                  size="sm"
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

export default EnvironmentsSidebar;
