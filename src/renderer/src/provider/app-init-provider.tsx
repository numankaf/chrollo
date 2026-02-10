import { createContext, useEffect, useState, type ReactNode } from 'react';
import useCollectionItemStore from '@/store/collection-item-store';
import useConnectionStore from '@/store/connection-store';
import useEnvironmentStore from '@/store/environment-store';
import useInterceptionScriptStore from '@/store/interception-script-store';
import useWorkspaceStore from '@/store/workspace-store';
import { useShallow } from 'zustand/react/shallow';

interface AppContextValue {
  appLoaded: boolean;
  workspacesLoaded: boolean;
  loadingText: string;
  loadWorkspace: (workspaceId: string) => Promise<void>;
}

const initialState: AppContextValue = {
  appLoaded: false,
  workspacesLoaded: false,
  loadingText: 'Loading...',
  loadWorkspace: async () => {},
};

export const AppContext = createContext<AppContextValue>(initialState);

export function AppProvider({ children }: { children: ReactNode }) {
  const [appLoaded, setAppLoaded] = useState<boolean>(false);
  const [workspacesLoaded, setWorkspacesLoaded] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>(initialState.loadingText);

  const { setActiveWorkspace } = useWorkspaceStore(
    useShallow((state) => ({
      setActiveWorkspace: state.setActiveWorkspace,
    }))
  );
  useEffect(() => {
    async function initGlobal() {
      try {
        setWorkspacesLoaded(false);
        setLoadingText('Loading workspaces...');
        const workspaceData = await window.api.workspace.load();
        await useWorkspaceStore.getState().initWorkspaceStore(workspaceData);
        setWorkspacesLoaded(true);
      } catch (err) {
        console.error('Failed to init workspaces:', err);
      }
    }
    initGlobal();
  }, []);

  const loadWorkspace = async (workspaceId: string) => {
    try {
      setAppLoaded(false);

      setLoadingText('Loading connections...');
      const connections = await window.api.connection.load(workspaceId);
      await useConnectionStore.getState().initConnectionStore(connections);

      setLoadingText('Loading collections...');
      const collectionItems = await window.api.collection.load(workspaceId);
      await useCollectionItemStore.getState().initCollectionStore(collectionItems);

      setLoadingText('Loading environments...');
      const environments = await window.api.environment.load(workspaceId);
      await useEnvironmentStore.getState().initEnvironmentStore(environments);

      setLoadingText('Loading interception scripts...');
      const interceptionScripts = await window.api.interceptionScript.load(workspaceId);
      await useInterceptionScriptStore.getState().initInterceptionScriptStore(interceptionScripts);

      setActiveWorkspace(workspaceId);
      setAppLoaded(true);
    } catch (err) {
      console.error('Failed to init workspace data:', err);
    }
  };

  return (
    <AppContext.Provider value={{ appLoaded, workspacesLoaded, loadingText, loadWorkspace }}>
      {children}
    </AppContext.Provider>
  );
}
