import { useEffect } from 'react';
import useStompStatusStore from '@/store/stomp-status-store';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { getTabRoute } from '@/utils/tab-util';
import { useNavigate } from 'react-router';

export function useAppSubscriptions() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeConsoleLog = window.listener.console.log((data) => {
      console.log(data);
    });

    const unsubscribeStompStatus = window.listener.stomp.onStatus((data) => {
      const { connectionId, status } = data;
      useStompStatusStore.getState().setStatus(connectionId, status);
    });

    const unsubscribeWorkspaceChange = useWorkspaceStore.subscribe((state) => {
      const activeTabId = state.workspaceSelection[state.activeWorkspaceId ?? '']?.activeTabId;
      const tab = useTabsStore.getState().tabs.find((t) => t.id === activeTabId) ?? null;
      if (tab) {
        navigate(getTabRoute(tab));
      } else {
        navigate('/');
      }
    });

    return () => {
      unsubscribeConsoleLog();
      unsubscribeStompStatus();
      unsubscribeWorkspaceChange();
    };
  }, [navigate]);
}
