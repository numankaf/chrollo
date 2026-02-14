import { useEffect } from 'react';
import useConnectionStatusStore from '@/store/connection-status-store';
import useEnvironmentStore from '@/store/environment-store';
import useRequestResponseStore from '@/store/request-response-store';
import useSocketMessageStatusStore from '@/store/socket-message-store';

export function useAppSubscriptions() {
  useEffect(() => {
    const unsubscribeConsoleError = window.listener.console.error((data) => {
      console.error(data);
    });

    const unsubscribeEnvironmentUpdated = window.listener.environment.onUpdated((environment) => {
      useEnvironmentStore.getState().updateEnvironment(environment);
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
      unsubscribeEnvironmentUpdated();
      unsubscribeStompStatus();
      unsubscribeStompMessage();
      unsubscribeRequestPending();
      unsubscribeRequestResolved();
    };
  }, []);
}
