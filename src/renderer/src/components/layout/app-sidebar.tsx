import * as React from 'react';
import { SIDEBAR_WIDTH_ICON } from '@/constants/layout-constants';
import { Columns3Cog, History, LibraryBig, Waypoints } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/common/sidebar';
import SidebarWorkspaceMainHeader from '@/components/layout/app-sidebar-main-header';
import CollectionSidebar from '@/components/layout/sidebar/app-collection-sidebar';
import ConnectionSidebar from '@/components/layout/sidebar/app-connection-sidebar';
import EnvironmentsSidebar from '@/components/layout/sidebar/app-environment-sidebar';
import HistorySidebar from '@/components/layout/sidebar/app-history-sidebar';

const SIDEBAR_DATA = [
  {
    title: 'Connections',
    url: '/connections',
    icon: Waypoints,
    subSidebarComponent: ConnectionSidebar,
  },
  {
    title: 'Collections',
    url: '/collections',
    icon: LibraryBig,
    subSidebarComponent: CollectionSidebar,
  },
  {
    title: 'Environments',
    url: '/environments',
    icon: Columns3Cog,
    subSidebarComponent: EnvironmentsSidebar,
  },
  {
    title: 'History',
    url: '/history',
    icon: History,
    subSidebarComponent: HistorySidebar,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(SIDEBAR_DATA[0]);

  return (
    <>
      <SidebarWorkspaceMainHeader />
      <Sidebar collapsible="icon" className="select-none overflow-hidden *:data-[sidebar=sidebar]:flex-row" {...props}>
        <Sidebar collapsible="none" className={`w-[${SIDEBAR_WIDTH_ICON}] border-r`}>
          <SidebarContent className="w-(--sidebar-width-icon)!">
            <SidebarGroup>
              <SidebarGroupContent className="px-1.5 md:px-0">
                <SidebarMenu>
                  {SIDEBAR_DATA.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={activeItem?.title === item.title}
                        className="flex flex-col items-center h-auto"
                        onClick={() => {
                          setActiveItem(item);
                        }}
                      >
                        <item.icon size={16} />
                        <span className="text-xs">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        {activeItem.subSidebarComponent && <activeItem.subSidebarComponent />}
      </Sidebar>
    </>
  );
}
