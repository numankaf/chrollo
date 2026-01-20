import { use, useEffect } from 'react';
import { AppContext } from '@/provider/app-init-provider';
import useConnectionStatusStore from '@/store/connection-status-store';
import useSocketMessageStatusStore from '@/store/socket-message-store';
import { getTabRoute } from '@/utils/tab-util';
import { useNavigate } from 'react-router';

import { useActiveItem } from '@/hooks/app/use-active-item';

export function useAppSubscriptions() {
  const navigate = useNavigate();
  const { workspacesLoaded, appLoaded } = use(AppContext);

  const { activeTab, activeWorkspace } = useActiveItem();

  useEffect(() => {
    if (!workspacesLoaded) return;

    if (!activeWorkspace) {
      navigate(`/home`);
      return;
    }

    if (!appLoaded) return;

    if (activeTab) {
      navigate(getTabRoute(activeTab));
    } else {
      navigate('/main/empty');
    }
  }, [workspacesLoaded, appLoaded, activeTab, activeWorkspace, navigate]);

  useEffect(() => {
    const unsubscribeConsoleLog = window.listener.console.log((data) => {
      console.log(data);
    });

    const unsubscribeStompMessage = window.listener.stomp.onMessage((data) => {
      useSocketMessageStatusStore.getState().addMessage(data);
    });

    const unsubscribeStompStatus = window.listener.stomp.onStatus((data) => {
      const { connectionId, status } = data;
      useConnectionStatusStore.getState().setStatus(connectionId, status);
    });

    return () => {
      unsubscribeConsoleLog();
      unsubscribeStompStatus();
      unsubscribeStompMessage();
    };
  }, []);
}
