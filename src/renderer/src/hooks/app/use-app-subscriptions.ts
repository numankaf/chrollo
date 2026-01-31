import { use, useEffect } from 'react';
import { AppContext } from '@/provider/app-init-provider';
import useCommandSearchStore from '@/store/command-search-store';
import useConnectionStatusStore from '@/store/connection-status-store';
import useRequestResponseStore from '@/store/request-response-store';
import useSocketMessageStatusStore from '@/store/socket-message-store';
import { getTabRoute } from '@/utils/tab-util';
import { useNavigate } from 'react-router';

import { useActiveItem } from '@/hooks/app/use-active-item';

export function useAppSubscriptions() {
  const navigate = useNavigate();
  const { workspacesLoaded, appLoaded } = use(AppContext);

  const { activeTab, activeWorkspace } = useActiveItem();

  const activeTabId = activeTab?.id;

  useEffect(() => {
    if (!workspacesLoaded) return;

    if (!activeWorkspace) {
      navigate(`/home`);
      return;
    }

    if (!appLoaded) return;

    if (activeTab) {
      const { recentTabs, addRecentTab } = useCommandSearchStore.getState();
      if (recentTabs[0]?.id !== activeTab.id) {
        addRecentTab(activeTab);
      }
      navigate(getTabRoute(activeTab));
    } else {
      navigate('/main/empty');
    }
  }, [workspacesLoaded, appLoaded, activeTabId, activeWorkspace, navigate, activeTab]);

  useEffect(() => {
    const unsubscribeConsoleError = window.listener.console.error((data) => {
      console.error(data);
    });

    const unsubscribeStompMessage = window.listener.stomp.onMessage((data) => {
      useSocketMessageStatusStore.getState().addMessage(data);
    });

    const unsubscribeStompStatus = window.listener.stomp.onStatus((data) => {
      const { connectionId, status } = data;
      useConnectionStatusStore.getState().setStatus(connectionId, status);
    });

    // Request-Response tracking listeners
    const unsubscribeRequestPending = window.listener.stomp.onRequestPending((data) => {
      const { requestKey, requestId, connectionId, request } = data;
      useRequestResponseStore.getState().addPendingRequest(requestKey, requestId, connectionId, request);
    });

    const unsubscribeRequestResolved = window.listener.stomp.onRequestResolved((data) => {
      const { requestKey, response } = data;
      useRequestResponseStore.getState().resolveRequest(requestKey, response);
    });

    return () => {
      unsubscribeConsoleError();
      unsubscribeStompStatus();
      unsubscribeStompMessage();
      unsubscribeRequestPending();
      unsubscribeRequestResolved();
    };
  }, []);
}
