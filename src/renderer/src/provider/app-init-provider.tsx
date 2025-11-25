import { createContext, useEffect, useState, type ReactNode } from 'react';
import useConnectionStore from '@/store/connection-store';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';

interface AppContextValue {
  appLoaded: boolean;
  loadingText: string;
}

const initialState: AppContextValue = {
  appLoaded: false,
  loadingText: 'Loading...',
};

export const AppContext = createContext<AppContextValue>(initialState);

export function AppProvider({ children }: { children: ReactNode }) {
  const [appLoaded, setAppLoaded] = useState<boolean>(initialState.appLoaded);
  const [loadingText, setLoadingText] = useState<string>(initialState.loadingText);

  useEffect(() => {
    async function init() {
      try {
        setLoadingText('Loading tabs...');
        const tabsData = await window.api.tab.load();
        const { tabs, activeTabId } = tabsData;
        useTabsStore.getState().setTabs(tabs);
        if (activeTabId) useTabsStore.getState().setActiveTab(activeTabId);

        setLoadingText('Loading workspaces...');
        const workspaceData = await window.api.workspace.load();
        const { workspaces, selectedWorkspaceId } = workspaceData;
        useWorkspaceStore.getState().setWorkspaces(workspaces);
        const selectedWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId) ?? null;
        useWorkspaceStore.getState().selectWorkspace(selectedWorkspace);

        setLoadingText('Loading connections...');
        const connectionData = await window.api.connection.load();
        const { connections, selectedConnectionId } = connectionData;
        useConnectionStore.getState().setConnections(connections);
        const selectedConnection = connections.find((c) => c.id === selectedConnectionId) ?? null;
        useConnectionStore.getState().selectConnection(selectedConnection);

        setAppLoaded(true);
      } catch (err) {
        console.error('Failed to load workspaces:', err);
      }
    }
    init();
  }, []);

  return <AppContext.Provider value={{ appLoaded, loadingText }}>{children}</AppContext.Provider>;
}
