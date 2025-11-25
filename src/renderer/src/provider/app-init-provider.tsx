import { createContext, useEffect, useState, type ReactNode } from 'react';
import useConnectionStore from '@/store/connection-store';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { useShallow } from 'zustand/react/shallow';

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
  const { setTabs, setActiveTab } = useTabsStore(
    useShallow((state) => ({
      setActiveTab: state.setActiveTab,
      setTabs: state.setTabs,
    }))
  );
  const { setWorkspaces, selectWorkspace } = useWorkspaceStore(
    useShallow((state) => ({
      setWorkspaces: state.setWorkspaces,
      selectWorkspace: state.selectWorkspace,
    }))
  );

  const { setConnections, selectConnection } = useConnectionStore(
    useShallow((state) => ({
      setConnections: state.setConnections,
      selectConnection: state.selectConnection,
    }))
  );
  useEffect(() => {
    async function init() {
      try {
        setLoadingText('Loading tabs...');
        const tabsData = await window.api.tab.load();
        const { tabs, activeTabId } = tabsData;
        setTabs(tabs);
        if (activeTabId) setActiveTab(activeTabId);

        setLoadingText('Loading workspaces...');
        const workspaceData = await window.api.workspace.load();
        const { workspaces, selectedWorkspaceId } = workspaceData;
        setWorkspaces(workspaces);
        const selectedWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId) ?? null;
        selectWorkspace(selectedWorkspace);

        setLoadingText('Loading connections...');
        const connectionData = await window.api.connection.load();
        const { connections, selectedConnectionId } = connectionData;
        setConnections(connections);
        const selectedConnection = connections.find((c) => c.id === selectedConnectionId) ?? null;
        selectConnection(selectedConnection);

        setAppLoaded(true);
      } catch (err) {
        console.error('Failed to load workspaces:', err);
      }
    }

    init();
  }, [selectConnection, selectWorkspace, setActiveTab, setConnections, setTabs, setWorkspaces]);

  return <AppContext.Provider value={{ appLoaded, loadingText }}>{children}</AppContext.Provider>;
}
