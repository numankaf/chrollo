import { useState } from 'react';
import { AddItemDialog } from '@/features/connections/components/common/add-item-dialog';
import useEnvironmentStore from '@/store/environment-store';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { Container, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import type { Environment } from '@/types/environment';
import { ENVIRONMENT_DEFAULT_VALUES } from '@/types/environment';
import { useActiveItem } from '@/hooks/workspace/use-active-item';
import { useWorkspaceEnvironments } from '@/hooks/workspace/use-workspace-environments';
import { Button } from '@/components/common/button';
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
import OperationsButton from '@/components/app/operations-button';

function EnvironmentsSidebar() {
  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );
  const { activeTab } = useActiveItem();

  const environments = useWorkspaceEnvironments();

  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);

  const { activeWorkspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
    }))
  );

  const { saveEnvironment } = useEnvironmentStore(
    useShallow((state) => ({
      saveEnvironment: state.saveEnvironment,
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
      const newEnvironment = await saveEnvironment(environmentPayload);
      openTab(newEnvironment);
      setAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to submit environment:', error);
      toast.error('Failed to submit environment.');
    }
  }

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarContent className="w-(--sidebar-width-content)!">
        <SidebarHeader className="m-0! p-0!">
          <div className="flex items-center justify-between p-1 gap-1">
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
            <Button size="sm" variant="ghost" onClick={() => setAddDialogOpen(true)}>
              <Plus size={16} />
            </Button>
            <SearchBar placeholder="Search environments" className="flex-1" onSearchChange={() => {}} />
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {environments.map((item) => (
                <SidebarMenuButton
                  onClick={() => openTab(item)}
                  className={`${activeTab?.id === item.id && 'border-l-primary! bg-sidebar-accent'} border-l border-l-transparent data-[active=true]:bg-transparent [&:hover>#operations-trigger]:block [&>#operations-trigger[data-state=open]]:inline-block`}
                  key={item.id}
                  size="sm"
                >
                  <Container size={16} />
                  <span className="flex-1 overflow-hidden text-nowrap text-ellipsis">{item.name}</span>
                  <OperationsButton item={item} />
                </SidebarMenuButton>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export default EnvironmentsSidebar;
