import { useState } from 'react';
import ConnectionStatusBadge from '@/features/connections/components/common/connection-status-badge';
import useTabsStore from '@/store/tab-store';
import { applyTextSearch } from '@/utils/search-util';
import { useShallow } from 'zustand/react/shallow';

import { useWorkspaceConnections } from '@/hooks/workspace/use-workspace-connections';
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
  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );
  const connections = useWorkspaceConnections();
  const [search, setSearch] = useState('');
  const filteredConnections = applyTextSearch(connections, search, (connection) => connection.name);

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarContent className="w-(--sidebar-width-content)!">
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
                  onClick={() => openTab(item)}
                >
                  <ConnectionIcon connectionType={item.connectionType} />
                  <span className="flex-1 overflow-hidden text-nowrap text-ellipsis">{item.name}</span>
                  <ConnectionStatusBadge connectionId={item.id} />
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
