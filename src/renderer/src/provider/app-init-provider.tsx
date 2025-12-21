import { createContext, useEffect, useState, type ReactNode } from 'react';
import useCollectionItemStore from '@/store/collection-item-store';
import useConnectionStore from '@/store/connection-store';
import useEnvironmentStore from '@/store/environment-store';
import useInterceptionScriptStore from '@/store/interception-script-store';
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
        await useWorkspaceStore.getState().initWorkspaceStore(workspaceData);

        setLoadingText('Loading connections...');
        const connections = await window.api.connection.load();
        await useConnectionStore.getState().initConnectionStore(connections);

        setLoadingText('Loading collections...');
        const collectionItems = await window.api.collection.load();
        await useCollectionItemStore.getState().initCollectionStore(collectionItems);

        setLoadingText('Loading environments...');
        const environments = await window.api.environment.load();
        await useEnvironmentStore.getState().initEnvironmentStore(environments);

        setLoadingText('Loading interception scripts...');
        const interceptionScripts = await window.api.interceptionScript.load();
        await useInterceptionScriptStore.getState().initInterceptionScriptStore(interceptionScripts);

        setAppLoaded(true);
      } catch (err) {
        console.error('Failed to init app:', err);
      }
    }
    init();
  }, []);

  return <AppContext.Provider value={{ appLoaded, loadingText }}>{children}</AppContext.Provider>;
}
