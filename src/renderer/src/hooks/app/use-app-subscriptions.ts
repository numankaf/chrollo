import { useEffect } from 'react';
import useConnectionStatusStore from '@/store/connection-status-store';
import useSocketMessageStatusStore from '@/store/socket-message-store';
import { getTabRoute } from '@/utils/tab-util';
import { useNavigate } from 'react-router';

import { useActiveItem } from '@/hooks/app/use-active-item';

export function useAppSubscriptions() {
  const navigate = useNavigate();
  const { activeTab } = useActiveItem();

  useEffect(() => {
    if (activeTab) {
      navigate(getTabRoute(activeTab));
    } else {
      navigate('/main/empty');
    }
  }, [activeTab, navigate]);

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
