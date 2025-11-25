import { createContext, useEffect, useState, type ReactNode } from 'react';
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

  const { setWorkspaces, selectWorkspace } = useWorkspaceStore(
    useShallow((state) => ({
      setWorkspaces: state.setWorkspaces,
      selectWorkspace: state.selectWorkspace,
    }))
  );
  useEffect(() => {
    async function init() {
      try {
        setLoadingText('Loading workspaces...');
        const data = await window.api.workspace.load();

        const { workspaces, selectedWorkspaceId } = data;

        setWorkspaces(workspaces);

        const selectedWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId) ?? null;
        selectWorkspace(selectedWorkspace);
        setAppLoaded(true);
      } catch (err) {
        console.error('Failed to load workspaces:', err);
      }
    }

    init();
  }, [selectWorkspace, setWorkspaces]);

  return <AppContext.Provider value={{ appLoaded, loadingText }}>{children}</AppContext.Provider>;
}
