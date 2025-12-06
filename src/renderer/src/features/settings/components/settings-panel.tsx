'use client';

import { Blocks, BrickWallShield, Info, Keyboard, Palette, Settings } from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/common/breadcrumb';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/common/sidebar';
import ComingSoon from '@/components/app/empty/coming-soon';

const data = {
  nav: [
    { name: 'General', icon: Settings },
    { name: 'Shortcuts', icon: Keyboard },
    { name: 'Themes', icon: Palette },
    { name: 'Plugins', icon: Blocks },
    { name: 'Certificates', icon: BrickWallShield },
    { name: 'About', icon: Info },
  ],
};

export function SettingsPanel() {
  return (
    <div className="flex w-full h-[75vh]">
      <Sidebar collapsible="none" className="w-54 ">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.nav.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={item.name === 'Messages & media'}>
                      <item.icon size={16} />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex h-[70vh] flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Messages & media</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
          <ComingSoon />
        </div>
      </main>
    </div>
  );
}
