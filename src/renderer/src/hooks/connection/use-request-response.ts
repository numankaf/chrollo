import { useCallback, useMemo } from 'react';
import useRequestResponseStore from '@/store/request-response-store';
import { useShallow } from 'zustand/react/shallow';

import { REQUEST_STATUS, type TrackedRequest } from '@/types/request-response';

/**
 * Hook to access and manage request-response tracking for a specific connection.
 */
export function useRequestResponse(connectionId?: string) {
  const { requestIdToTrackedRequest, requestIdToLastResolvedRequest, cancelRequest, clearByConnectionId, clearAll } =
    useRequestResponseStore(
      useShallow((state) => ({
        requestIdToTrackedRequest: state.requestIdToTrackedRequest,
        requestIdToLastResolvedRequest: state.requestIdToLastResolvedRequest,
        cancelRequest: state.cancelRequest,
        clearByConnectionId: state.clearByConnectionId,
        clearAll: state.clearAll,
        clearRequest: state.clearRequest,
      }))
    );

  // Get all tracked requests, optionally filtered by connectionId
  const requests = useMemo((): TrackedRequest[] => {
    const allRequests = Array.from(requestIdToTrackedRequest.values());
    if (connectionId) {
      return allRequests.filter((r) => r.connectionId === connectionId);
    }
    return allRequests;
  }, [requestIdToTrackedRequest, connectionId]);

  // Get only pending requests
  const pendingRequests = useMemo(() => requests.filter((r) => r.status === REQUEST_STATUS.PENDING), [requests]);

  // Get only resolved requests
  const resolvedRequests = useMemo(() => requests.filter((r) => r.status === REQUEST_STATUS.RESOLVED), [requests]);

  // Get only canceled requests
  const canceledRequests = useMemo(() => requests.filter((r) => r.status === REQUEST_STATUS.CANCELED), [requests]);

  // Get a tracked request by requestId (returns pending or last resolved) - REACTIVE
  const getByRequestId = useCallback(
    (requestId: string): TrackedRequest | undefined => {
      return requestIdToTrackedRequest.get(requestId);
    },
    [requestIdToTrackedRequest]
  );

  // Get the last resolved request by requestId - REACTIVE
  const getLastResolvedByRequestId = useCallback(
    (requestId: string): TrackedRequest | undefined => {
      return requestIdToLastResolvedRequest.get(requestId);
    },
    [requestIdToLastResolvedRequest]
  );

  // Cancel a pending request by requestId
  const cancel = useCallback(
    (requestId: string) => {
      cancelRequest(requestId);
    },
    [cancelRequest]
  );

  // Clear all requests for the current connection
  const clear = useCallback(() => {
    if (connectionId) {
      clearByConnectionId(connectionId);
    } else {
      clearAll();
    }
  }, [connectionId, clearByConnectionId, clearAll]);

  // Clear specific request by requestId
  const clearRequest = useCallback((requestId: string) => {
    useRequestResponseStore.getState().clearRequest(requestId);
  }, []);

  return {
    requests,
    pendingRequests,
    resolvedRequests,
    canceledRequests,
    getByRequestId,
    getLastResolvedByRequestId,
    cancel,
    clear,
    clearRequest,
  };
}
