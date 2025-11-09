import useConnectionStore from '@/store/connection-store';
import { Plus } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { useTabNavigation } from '@/hooks/use-tab-navigation';
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
import { WebSocketIcon } from '@/components/icon/websocket-icon';

function ConnectionSidebar() {
  const { openAndNavigateToTab } = useTabNavigation();
  const { connections } = useConnectionStore(
    useShallow((state) => ({
      connections: state.connections,
    }))
  );
  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarContent>
        <SidebarHeader className="m-0! p-0!">
          <div className="flex items-center justify-between p-1 gap-1">
            <Button size="sm" variant="ghost">
              <Plus className="w-4! h-4!" />
            </Button>
            <SearchBar placeholder="Search socket connections" className="flex-1" onSearchChange={() => {}} />
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {connections.map((item) => (
                <SidebarMenuButton
                  size="sm"
                  className="data-[active=true]:bg-transparent"
                  key={item.id}
                  onClick={() => openAndNavigateToTab(item)}
                >
                  <WebSocketIcon />
                  <span>{item.name}</span>
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

export default ConnectionSidebar;
