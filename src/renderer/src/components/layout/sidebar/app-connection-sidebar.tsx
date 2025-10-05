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
import { ChevronsLeftRightEllipsis, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useShallow } from 'zustand/react/shallow';
import useTabsStore from '../../../store/tabs-store';
import type { SocketConnetionItem } from '../../../types/layout';

const data: SocketConnetionItem[] = [
  {
    id: nanoid(8),
    name: 'ws-connection-tukks',
    state: 'connected',
    type: 'connection',
  },
  {
    id: nanoid(8),
    name: 'ws-connection-tukks-hq200',
    state: 'idle',
    type: 'connection',
  },
  {
    id: nanoid(8),
    name: 'ws-connection-ehkks',
    state: 'error',
    type: 'connection',
  },
];

const ConnectionSidebar = () => {
  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
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
              {data.map((item) => (
                <SidebarMenuButton
                  size="sm"
                  className="data-[active=true]:bg-transparent"
                  key={item.id}
                  onClick={() => openTab(item)}
                >
                  <ChevronsLeftRightEllipsis className="w-4 h-4 text-orange-500" />
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
};

export default ConnectionSidebar;
