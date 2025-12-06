import * as React from 'react';
import { SIDEBAR_WIDTH_ICON } from '@/constants/layout-constants';
import { Columns3Cog, History, LibraryBig, Waypoints } from 'lucide-react';

import { BASE_MODEL_TYPE } from '@/types/base';
import { useActiveItem } from '@/hooks/use-active-item';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/common/sidebar';
import SidebarWorkspaceMainHeader from '@/components/layout/sidebar/app-sidebar-main-header';
import CollectionSidebar from '@/components/layout/sidebar/collection/app-collection-sidebar';
import ConnectionSidebar from '@/components/layout/sidebar/connection/app-connection-sidebar';
import EnvironmentsSidebar from '@/components/layout/sidebar/environment/app-environment-sidebar';
import HistorySidebar from '@/components/layout/sidebar/history/app-history-sidebar';

const SIDEBAR_DATA = [
  {
    modelType: BASE_MODEL_TYPE.CONNECTION,
    title: 'Connections',
    url: '/connections',
    icon: Waypoints,
    subSidebarComponent: ConnectionSidebar,
  },
  {
    modelType: BASE_MODEL_TYPE.COLLECTION,
    title: 'Collections',
    url: '/collections',
    icon: LibraryBig,
    subSidebarComponent: CollectionSidebar,
  },
  {
    modelType: BASE_MODEL_TYPE.ENVIRONMENT,
    title: 'Environments',
    url: '/environments',
    icon: Columns3Cog,
    subSidebarComponent: EnvironmentsSidebar,
  },
  {
    modelType: BASE_MODEL_TYPE.REQUEST_HISTORY,
    title: 'History',
    url: '/history',
    icon: History,
    subSidebarComponent: HistorySidebar,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { activeTab } = useActiveItem();
  const [activeItem, setActiveItem] = React.useState(SIDEBAR_DATA[0]);

  React.useEffect(() => {
    if (!activeTab) return;

    const match = SIDEBAR_DATA.find((item) => item.modelType === activeTab.modelType);

    if (match) {
      setActiveItem(match);
    }
  }, [activeTab]);

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
