import { useState } from 'react';
import { SETTINGS_NAV_ITEMS } from '@/constants/settings-constants';

import type { SettingsItem } from '@/types/layout';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/common/sidebar';

export function SettingsPanelContainer() {
  const [settingsItem, setSettingsItem] = useState<SettingsItem>(SETTINGS_NAV_ITEMS[0]);

  return (
    <SidebarProvider>
      <div style={{ height: 'calc(75vh - 1px)' }} className="flex w-full items-center justify-center">
        <Sidebar collapsible="none" className="w-54 rounded-tl-lg rounded-bl-lg border-r border-b">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {SETTINGS_NAV_ITEMS.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        size="sm"
                        asChild
                        isActive={item.id === settingsItem.id}
                        onClick={() => {
                          setSettingsItem(item);
                        }}
                      >
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
        <main className="flex h-full flex-1 flex-col overflow-hidden p-3">
          <header className="flex text-lg font-semibold h-8 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            {settingsItem.name}
          </header>
          {settingsItem.component && <settingsItem.component />}
        </main>
      </div>
    </SidebarProvider>
  );
}
