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
import { ChevronRight, FolderOpen, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import type { CollectionTreeItem } from '../../../types/layout';

const dataTree: CollectionTreeItem[] = [
  {
    id: nanoid(8),
    name: 'scope-corec2',
    type: 'collection',
    children: [
      {
        id: nanoid(8),
        name: 'bsi',
        type: 'folder',
        children: [
          {
            id: nanoid(8),
            name: 'unit',
            type: 'folder',
            children: [
              { id: nanoid(8), name: 'getUnit', commandType: 'query', type: 'request', path: '/bsi/unit/getUnit' },
              {
                id: nanoid(8),
                name: 'createUnit',
                commandType: 'command',
                type: 'request',
                path: '/bsi/unit/createUnit',
              },
            ],
          },
        ],
      },
      {
        id: nanoid(8),
        name: 'oppplan',
        type: 'folder',
        children: [
          {
            id: nanoid(8),
            name: 'queryCandidateTarget',
            commandType: 'query',
            type: 'request',
            path: '/oppplan/queryCandidateTarget',
          },
          {
            id: nanoid(8),
            name: 'createCandidateTarget',
            commandType: 'command',
            type: 'request',
            path: '/oppplan/createCandidateTarget',
          },
        ],
      },
    ],
  },
  {
    id: nanoid(8),
    name: 'scope-land-rgp',
    type: 'collection',
    children: [
      {
        id: nanoid(8),
        name: 'overlay',
        type: 'folder',
        children: [
          {
            id: nanoid(8),
            name: 'addToContext',
            commandType: 'command',
            type: 'request',
            path: '/overlay/addToContext',
          },
        ],
      },
    ],
  },
];

function RequestIcon({ commandType }: { commandType: 'command' | 'query' }) {
  return (
    <div className="text-3xs w-[40px] text-end">
      {commandType === 'command' ? (
        <span className="text-yellow-600">COMMAND</span>
      ) : (
        <span className="text-green-600">QUERY</span>
      )}
    </div>
  );
}

function Tree({ item }: { item: CollectionTreeItem }) {
  const hasChildren = (item.type === 'folder' || item.type === 'collection') && item.children?.length > 0;

  if (!hasChildren) {
    return (
      <SidebarMenuButton className="data-[active=true]:bg-transparent">
        {item.type === 'request' && <RequestIcon commandType={item.commandType} />}
        {item.type === 'folder' && <FolderOpen />}
        <span className="text-xs">{item.name}</span>
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem className="p-0!">
      <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRight className="transition-transform" />
            {item.type === 'folder' && <FolderOpen />}
            <span className="text-xs">{item.name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="p-0! mr-0!">
            {item.children?.map((child) => (
              <Tree key={child.id} item={child} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

const CollectionSidebar = () => {
  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarContent>
        <SidebarHeader className="m-0! p-0!">
          <div className="flex items-center justify-between p-1 gap-1">
            <Button size="sm" variant="ghost">
              <Plus className="w-4! h-4!" />
            </Button>
            <SearchBar placeholder="Search collections" className="flex-1" onSearchChange={() => {}} />
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {dataTree.map((item, index) => (
                <Tree key={index} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default CollectionSidebar;
