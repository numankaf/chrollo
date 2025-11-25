import { useState } from 'react';
import useConnectionStore from '@/store/connection-store';
import { applyTextSearch } from '@/utils/search-util';
import { useShallow } from 'zustand/react/shallow';

import { useTabNavigation } from '@/hooks/use-tab-navigation';
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
import AddConnectionPanel from '@/components/connection/add-connection-panel';
import { ConnectionIcon } from '@/components/icon/connection-icon';

function ConnectionSidebar() {
  const { openAndNavigateToTab } = useTabNavigation();
  const { connections } = useConnectionStore(
    useShallow((state) => ({
      connections: state.connections,
    }))
  );
  const [search, setSearch] = useState('');
  const filteredConnections = applyTextSearch(connections, search, (connection) => connection.name);

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarContent>
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
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredConnections.map((item) => (
                <SidebarMenuButton
                  size="sm"
                  className="data-[active=true]:bg-transparent"
                  key={item.id}
                  onClick={() => openAndNavigateToTab(item)}
                >
                  <ConnectionIcon connectionType={item.connectionType} />
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
