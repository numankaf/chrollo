import React, { createContext, useRef, useState, type ReactNode, type RefObject } from 'react';
import { useAppConfigStore } from '@/store/app-config-store';
import { Cable, Columns3Cog, History, LibraryBig, Waypoints } from 'lucide-react';
import type { PanelImperativeHandle } from 'react-resizable-panels';
import { useShallow } from 'zustand/react/shallow';

import { BASE_MODEL_TYPE } from '@/types/base';
import type { SidebarItem } from '@/types/layout';
import { useActiveItem } from '@/hooks/app/use-active-item';
import CollectionSidebar from '@/components/layout/sidebar/collection/app-collection-sidebar';
import ConnectionSidebar from '@/components/layout/sidebar/connection/app-connection-sidebar';
import EnvironmentsSidebar from '@/components/layout/sidebar/environment/app-environment-sidebar';
import HistorySidebar from '@/components/layout/sidebar/history/app-history-sidebar';
import InterceptionScriptSidebar from '@/components/layout/sidebar/interception-script/app-interception-script-sidebar';

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    modelType: BASE_MODEL_TYPE.CONNECTION,
    title: 'Connections',
    url: '/connections',
    icon: Waypoints,
    component: ConnectionSidebar,
  },
  {
    modelType: BASE_MODEL_TYPE.COLLECTION,
    title: 'Collections',
    url: '/collections',
    icon: LibraryBig,
    component: CollectionSidebar,
  },
  {
    modelType: BASE_MODEL_TYPE.ENVIRONMENT,
    title: 'Environments',
    url: '/environments',
    icon: Columns3Cog,
    component: EnvironmentsSidebar,
  },
  {
    modelType: BASE_MODEL_TYPE.INTERCEPTION_SCRIPT,
    title: 'Scripts',
    url: '/interception-scripts',
    icon: Cable,
    component: InterceptionScriptSidebar,
  },
  {
    modelType: BASE_MODEL_TYPE.REQUEST_HISTORY,
    title: 'History',
    url: '/history',
    icon: History,
    component: HistorySidebar,
  },
];

export type LayoutProviderProps = {
  children: ReactNode;
};

export type LayoutProviderState = {
  sidebarItems: SidebarItem[];
  activeItem: SidebarItem;
  setActiveItem: (item: SidebarItem) => void;
  sidebarRef: RefObject<PanelImperativeHandle | null>;
  toggleSidebar: () => void;
};

export const LayoutProviderContext = createContext<LayoutProviderState | null>(null);

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [activeItem, setActiveItem] = useState<SidebarItem>(SIDEBAR_ITEMS[0]);
  const { activeTab } = useActiveItem();
  const sidebarRef = useRef<PanelImperativeHandle>(null);
  const { applicationSettings } = useAppConfigStore(
    useShallow((state) => ({
      applicationSettings: state.applicationSettings,
    }))
  );
  function toggleSidebar() {
    if (sidebarRef.current?.isCollapsed()) {
      sidebarRef.current?.expand();
    } else {
      sidebarRef.current?.collapse();
    }
  }

  React.useEffect(() => {
    if (!activeTab) return;
    if (!applicationSettings.selectTabItemOnMainSidebar) return;

    const match = SIDEBAR_ITEMS.find((item) => item.modelType === activeTab.modelType);

    if (match) {
      setActiveItem(match);
    }
  }, [activeTab, applicationSettings.selectTabItemOnMainSidebar]);

  const value = {
    sidebarItems: SIDEBAR_ITEMS,
    activeItem,
    setActiveItem,
    sidebarRef,
    toggleSidebar,
  };

  return <LayoutProviderContext.Provider value={value}>{children}</LayoutProviderContext.Provider>;
}
