import { useEffect } from 'react';
import useConnectionStatusStore from '@/store/connection-status-store';
import { getTabRoute } from '@/utils/tab-util';
import { useNavigate } from 'react-router';

import { useActiveItem } from '@/hooks/use-active-item';

export function useAppSubscriptions() {
  const navigate = useNavigate();
  const { activeTab } = useActiveItem();

  useEffect(() => {
    if (activeTab) {
      navigate(getTabRoute(activeTab));
    } else {
      navigate('/');
    }
  }, [activeTab, navigate]);

  useEffect(() => {
    const unsubscribeConsoleLog = window.listener.console.log((data) => {
      console.log(data);
    });

    const unsubscribeStompStatus = window.listener.stomp.onStatus((data) => {
      const { connectionId, status } = data;
      useConnectionStatusStore.getState().setStatus(connectionId, status);
    });

    return () => {
      unsubscribeConsoleLog();
      unsubscribeStompStatus();
    };
  }, []);
}
