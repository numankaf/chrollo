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
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import type { SocketConnetionItem } from '../../../types/layout';

const data: SocketConnetionItem[] = [
  {
    id: nanoid(8),
    name: 'ws-connection-tukks',
    state: 'connected',
  },
  {
    id: nanoid(8),
    name: 'ws-connection-tukks-hq200',
    state: 'idle',
  },
  {
    id: nanoid(8),
    name: 'ws-connection-ehkks',
    state: 'error',
  },
];

const ConnectionSidebar = () => {
  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarContent>
        <SidebarHeader className="m-0! p-0!">
          <div className="flex items-center justify-between gap-1 pt-1 px-1">
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
                <SidebarMenuButton className="data-[active=true]:bg-transparent" key={item.id}>
                  <span className="text-xs">{item.name}</span>
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
