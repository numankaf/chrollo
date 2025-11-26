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
        setLoadingText('Loading workspaces...');
        const workspaceData = await window.api.workspace.load();
        useWorkspaceStore.getState().initWorkspaceStore(workspaceData);

        setLoadingText('Loading tabs...');
        const tabsData = await window.api.tab.load();
        useTabsStore.getState().initTabsStore(tabsData);

        setLoadingText('Loading connections...');
        const connectionData = await window.api.connection.load();
        useConnectionStore.getState().initConnectionStore(connectionData);

        setAppLoaded(true);
      } catch (err) {
        console.error('Failed to load workspaces:', err);
      }
    }
    init();
  }, []);

  return <AppContext.Provider value={{ appLoaded, loadingText }}>{children}</AppContext.Provider>;
}
