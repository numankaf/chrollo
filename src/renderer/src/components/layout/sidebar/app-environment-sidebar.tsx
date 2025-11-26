import useTabsStore from '@/store/tab-store';
import { Container, Plus } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

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

function EnvironmentsSidebar() {
  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );

  const environments = useWorkspaceEnvironments();
  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarContent>
        <SidebarHeader className="m-0! p-0!">
          <div className="flex items-center justify-between p-1 gap-1">
            <Button size="sm" variant="ghost">
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
                  className="data-[active=true]:bg-transparent"
                  key={item.id}
                  size="sm"
                >
                  <Container size={16} />
                  <span className="text-sm">{item.name}</span>
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
