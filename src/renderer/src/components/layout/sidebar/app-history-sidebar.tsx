import { Button } from '@/components/common/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/common/collapsible';
import { SearchBar } from '@/components/common/search-input';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from '@/components/common/sidebar';
import { ChevronRight, Plus, Zap } from 'lucide-react';
import { nanoid } from 'nanoid';
import type { HistoryItem } from '../../../types/layout';

const data: HistoryItem[] = [
  {
    id: nanoid(8),
    date: 'Today',
    requests: [
      {
        id: nanoid(8),
        name: 'queryCandidateTarget',
        type: 'request',
        path: '/oppplan/queryCandidateTarget',
        commandType: 'query',
      },
    ],
  },
  {
    id: nanoid(8),
    date: 'August 10',
    requests: [
      { id: nanoid(8), name: 'getUnit', type: 'request', path: '/bsi/unit/getUnit', commandType: 'query' },
      { id: nanoid(8), name: 'getUnit', type: 'request', path: '/bsi/unit/getUnit', commandType: 'query' },
      {
        id: nanoid(8),
        name: 'queryCandidateTarget',
        type: 'request',
        path: '/oppplan/queryCandidateTarget',
        commandType: 'query',
      },
    ],
  },
];

function Tree({ item }: { item: HistoryItem }) {
  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen={true}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton size="sm">
            <ChevronRight className="transition-transform" />
            <span>{item.date}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.requests!.map((child) => (
              <SidebarMenuButton key={child.id} size="sm">
                <Zap className="w-4! h-4! text-green-500!" />
                <span>{child.name}</span>
              </SidebarMenuButton>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

const HistorySidebar = () => {
  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarContent>
        <SidebarHeader className="m-0! p-0!">
          <div className="flex items-center justify-between p-1 gap-1">
            <Button size="sm" variant="ghost">
              <Plus className="w-4! h-4!" />
            </Button>
            <SearchBar placeholder="Search history" className="flex-1" onSearchChange={() => {}} />
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.map((item) => (
                <Tree key={item.id} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default HistorySidebar;
