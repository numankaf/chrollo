import { useEffect } from 'react';
import useConnectionStatusStore from '@/store/connection-status-store';
import useEnvironmentStore from '@/store/environment-store';
import useRequestResponseStore from '@/store/request-response-store';
import useSocketMessageStatusStore from '@/store/socket-message-store';

export function useAppSubscriptions() {
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    // Console forwarding
    for (const level of ['log', 'info', 'warn', 'error'] as const) {
      unsubs.push(
        window.listener.console[level]((...args) => {
          console[level](...args);
        })
      );
    }

    // Environment
    unsubs.push(
      window.listener.environment.onUpdated((environment) => {
        useEnvironmentStore.getState().updateEnvironment(environment);
      })
    );

    // Unified socket status & message
    unsubs.push(
      window.listener.socket.onStatus((data) => {
        useConnectionStatusStore.getState().setStatus(data.connectionId, data.status);
      })
    );

    unsubs.push(
      window.listener.socket.onMessage((data) => {
        useSocketMessageStatusStore.getState().addMessage(data);
      })
    );

    // Request-Response tracking
    unsubs.push(
      window.listener.socket.onRequestPending((data) => {
        const { requestKey, requestId, connectionId, request } = data;
        useRequestResponseStore.getState().addPendingRequest(requestKey, requestId, connectionId, request);
      })
    );

    unsubs.push(
      window.listener.socket.onRequestResolved((data) => {
        const { requestKey, response, responseTime, testResults } = data;
        useRequestResponseStore.getState().resolveRequest(requestKey, response, responseTime, testResults);
      })
    );

    return () => {
      for (const unsub of unsubs) {
        unsub();
      }
    };
  }, []);
}
