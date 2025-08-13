import { ChevronRight, Columns3Cog, File, Folder, History, LibraryBig, Plus, Waypoints } from 'lucide-react';
import * as React from 'react';

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
import SidebarWorkspaceMainHeader from './app-sidebar-main-header';

// This is sample data
const data1 = {
  navMain: [
    {
      title: 'Connections',
      url: '#',
      icon: Waypoints,
    },
    {
      title: 'Collections',
      url: '#',
      icon: LibraryBig,
    },
    {
      title: 'Enviroments',
      url: '#',
      icon: Columns3Cog,
    },
    {
      title: 'History',
      url: '#',
      icon: History,
    },
  ],
};

const data = {
  changes: [
    {
      file: 'README.md',
      state: 'M',
    },
    {
      file: 'api/hello/route.ts',
      state: 'U',
    },
    {
      file: 'app/layout.tsx',
      state: 'M',
    },
  ],
  tree: [
    ['app', ['api', ['hello', ['route.ts']], 'page.tsx', 'layout.tsx', ['blog', ['page.tsx']]]],
    ['components', ['ui', 'button.tsx', 'card.tsx'], 'header.tsx', 'footer.tsx'],
    ['lib', ['util.ts']],
    ['public', 'favicon.ico', 'vercel.svg'],
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(data1.navMain[0]);
  return (
    <>
      <SidebarWorkspaceMainHeader />
      <Sidebar collapsible="icon" className="overflow-hidden *:data-[sidebar=sidebar]:flex-row" {...props}>
        <Sidebar collapsible="none" className="w-[90px]! border-r">
          <SidebarContent className="w-[var(--sidebar-width-icon)]!">
            <SidebarGroup>
              <SidebarGroupContent className="px-1.5 md:px-0">
                <SidebarMenu>
                  {data1.navMain.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={activeItem?.title === item.title}
                        className="flex flex-col items-center h-auto"
                      >
                        <item.icon className="w-4! h-4!" />
                        <span className="text-2xs">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <Sidebar collapsible="none" className="hidden flex-1 md:flex">
          <SidebarContent>
            <SidebarHeader className="m-0! p-0!">
              <div className="flex items-center justify-between gap-1 pt-1 px-1">
                <Button size="sm" variant="ghost">
                  <Plus className="w-4! h-4!" />
                </Button>
                <SearchBar placeholder="Search collections" className="flex-1" onSearchChange={() => {}} />
              </div>
            </SidebarHeader>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {data.tree.map((item, index) => (
                    <Tree key={index} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
      </Sidebar>
    </>
  );
}

function Tree({ item }: { item: string | any[] }) {
  const [name, ...items] = Array.isArray(item) ? item : [item];
  if (!items.length) {
    return (
      <SidebarMenuButton isActive={name === 'button.tsx'} className="data-[active=true]:bg-transparent">
        <File />
        <span className="text-xs"> {name}</span>
      </SidebarMenuButton>
    );
  }
  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen={name === 'components' || name === 'ui'}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRight className="transition-transform" />
            <Folder />
            <span className="text-xs"> {name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subItem, index) => (
              <Tree key={index} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
