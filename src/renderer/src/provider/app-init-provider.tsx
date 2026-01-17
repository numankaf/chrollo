import { createContext, useEffect, useState, type ReactNode } from 'react';
import useCollectionItemStore from '@/store/collection-item-store';
import useConnectionStore from '@/store/connection-store';
import useEnvironmentStore from '@/store/environment-store';
import useInterceptionScriptStore from '@/store/interception-script-store';
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
  const [appLoaded, setAppLoaded] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>(initialState.loadingText);

  const { activeWorkspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
    }))
  );

  useEffect(() => {
    async function initGlobal() {
      try {
        setLoadingText('Loading workspaces...');
        const workspaceData = await window.api.workspace.load();
        await useWorkspaceStore.getState().initWorkspaceStore(workspaceData);
      } catch (err) {
        console.error('Failed to init workspaces:', err);
      }
    }
    initGlobal();
  }, []);

  useEffect(() => {
    async function initWorkspace() {
      try {
        if (!activeWorkspaceId) return;

        setAppLoaded(false);
        setLoadingText('Loading connections...');
        const connections = await window.api.connection.load(activeWorkspaceId);
        await useConnectionStore.getState().initConnectionStore(connections);

        setLoadingText('Loading collections...');
        const collectionItems = await window.api.collection.load(activeWorkspaceId);
        await useCollectionItemStore.getState().initCollectionStore(collectionItems);

        setLoadingText('Loading environments...');
        const environments = await window.api.environment.load(activeWorkspaceId);
        await useEnvironmentStore.getState().initEnvironmentStore(environments);

        setLoadingText('Loading interception scripts...');
        const interceptionScripts = await window.api.interceptionScript.load(activeWorkspaceId);
        await useInterceptionScriptStore.getState().initInterceptionScriptStore(interceptionScripts);

        setAppLoaded(true);
      } catch (err) {
        console.error('Failed to init workspace data:', err);
      }
    }
    initWorkspace();
  }, [activeWorkspaceId]);

  return <AppContext.Provider value={{ appLoaded, loadingText }}>{children}</AppContext.Provider>;
}
