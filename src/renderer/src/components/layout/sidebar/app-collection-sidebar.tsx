import { Button } from '@/components/common/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/common/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';
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
import { ChevronRight, Ellipsis, FolderOpen, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import type { CollectionTreeItem, CommandType } from '../../../types/layout';

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

function RequestIcon({ commandType }: { commandType: CommandType }) {
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

function OperationsButton({ item }: { item: CollectionTreeItem }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="opacity-0 transition-opacity">
        <div className="cursor-pointer hover:text-primary hover:bg-transparent!" id="operations-trigger">
          <Ellipsis className="w-4 h-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="bg-background w-[160px]">
        {(item.type === 'collection' || item.type === 'folder') && (
          <>
            <DropdownMenuItem className="text-xs" onClick={(e) => e.preventDefault()}>
              Add Request
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs" onClick={(e) => e.preventDefault()}>
              Add Folder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem className="text-xs" onClick={(e) => e.preventDefault()}>
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs" onClick={(e) => e.preventDefault()}>
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xs" onClick={(e) => e.preventDefault()}>
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-500 text-xs hover:bg-red-500! hover:text-white!"
          onClick={(e) => e.preventDefault()}
        >
          Delete
        </DropdownMenuItem>
        {item.type === 'collection' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs">Export</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Tree({ item }: { item: CollectionTreeItem }) {
  const hasChildren = (item.type === 'folder' || item.type === 'collection') && item.children?.length > 0;

  if (!hasChildren) {
    return (
      <SidebarMenuButton
        size="sm"
        asChild
        className="data-[active=true]:bg-transparent flex items-center justify-between [&:hover>#operations-trigger]:opacity-100 [&>#operations-trigger[data-state=open]]:opacity-100"
      >
        <div className="flex items-center justify-center gap-1">
          {item.type === 'request' && <RequestIcon commandType={item.commandType} />}
          {item.type === 'folder' && <FolderOpen />}
          <span>{item.name}</span>
        </div>
        <OperationsButton item={item} />
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem className="p-0!">
      <Collapsible className="group/collapsible [&[data-state=open]>button>div>#chevron-icon:first-child]:rotate-90">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            size="sm"
            className="flex items-center justify-between [&:hover>#operations-trigger]:opacity-100 [&>#operations-trigger[data-state=open]]:opacity-100"
          >
            <div className="flex items-center justify-center gap-1">
              <ChevronRight id="chevron-icon" className="transition-transform w-4! h-4!" />
              {item.type === 'folder' && <FolderOpen className="w-4! h-4!" />}
              <span>{item.name}</span>
            </div>
            <OperationsButton item={item} />
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
