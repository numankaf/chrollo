import { createContext, useEffect, useState, type ReactNode } from 'react';
import useConnectionStore from '@/store/connection-store';
import useEnvironmentStore from '@/store/environment-store';
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
        await useTabsStore.getState().initTabsStore(tabsData);

        setLoadingText('Loading workspaces...');
        const workspaceData = await window.api.workspace.load();
        await useWorkspaceStore.getState().initWorkspaceStore(workspaceData);

        setLoadingText('Loading connections...');
        const connectionData = await window.api.connection.load();
        await useConnectionStore.getState().initConnectionStore(connectionData);

        setLoadingText('Loading environments...');
        const environmentData = await window.api.environment.load();
        await useEnvironmentStore.getState().initEnvironmentStore(environmentData);

        setAppLoaded(true);
      } catch (err) {
        console.error('Failed to load workspaces:', err);
      }
    }
    init();
  }, []);

  return <AppContext.Provider value={{ appLoaded, loadingText }}>{children}</AppContext.Provider>;
}
