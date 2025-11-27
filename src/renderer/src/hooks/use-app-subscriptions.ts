import { useEffect } from 'react';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { getTabRoute } from '@/utils/tab-utils';
import { useNavigate } from 'react-router';

export function useAppSubscriptions() {
  const navigate = useNavigate();

  function handleSyncSave() {
    const tabs = useTabsStore.getState().tabs;
    window.api.tab.save({ tabs });

    const { workspaces, activeWorkspaceId, workspaceSelection } = useWorkspaceStore.getState();
    window.api.workspace.save({
      workspaces: workspaces,
      activeWorkspaceId: activeWorkspaceId,
      workspaceSelection: workspaceSelection,
    });
  }

  useEffect(() => {
    const unsubscribeConsoleLog = window.listener.console.log((data) => {
      console.log(data);
    });

    const unsubscribeStompStatus = window.listener.stomp.onStatus((data) => {
      console.log(data);
    });

    const unsubscribeWorkspaceChange = useWorkspaceStore.subscribe((state) => {
      const activeTabId = state.workspaceSelection[state.activeWorkspaceId ?? '']?.activeTabId;
      const tab = useTabsStore.getState().tabs.find((t) => t.id === activeTabId) ?? null;
      if (tab) {
        navigate(getTabRoute(tab.item));
      } else {
        navigate('/');
      }
    });

    window.electron.ipcRenderer.on('app:shutdown', handleSyncSave);
    window.addEventListener('beforeunload', handleSyncSave);

    return () => {
      unsubscribeConsoleLog();
      unsubscribeStompStatus();
      unsubscribeWorkspaceChange();
      window.electron.ipcRenderer.removeListener('app:shutdown', handleSyncSave);
      window.removeEventListener('beforeunload', handleSyncSave);
    };
  }, [navigate]);
}
