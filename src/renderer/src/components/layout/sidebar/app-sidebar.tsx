import * as React from 'react';

import { useLayout } from '@/hooks/layout/use-layout';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/common/sidebar';
import WorkspaceButton from '@/components/app/button/workspace-button';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { sidebarItems, activeItem, setActiveItem } = useLayout();
  return (
    <>
      <Sidebar collapsible="icon" className="select-none overflow-hidden" {...props}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {sidebarItems.map((item) => (
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
        <SidebarFooter>
          <WorkspaceButton />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
