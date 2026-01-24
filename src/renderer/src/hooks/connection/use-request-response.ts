import { useCallback, useMemo } from 'react';
import useRequestResponseStore from '@/store/request-response-store';
import { useShallow } from 'zustand/react/shallow';

import { REQUEST_STATUS, type TrackedRequest } from '@/types/request-response';

/**
 * Hook to access and manage request-response tracking for a specific connection.
 */
export function useRequestResponse(connectionId?: string) {
  const { trackedRequests, requestIdToRequestKey, cancelRequest, clearByConnectionId, clearAll } =
    useRequestResponseStore(
      useShallow((state) => ({
        trackedRequests: state.trackedRequests,
        requestIdToRequestKey: state.requestIdToRequestKey,
        cancelRequest: state.cancelRequest,
        clearByConnectionId: state.clearByConnectionId,
        clearAll: state.clearAll,
      }))
    );

  // Get all tracked requests, optionally filtered by connectionId
  const requests = useMemo((): TrackedRequest[] => {
    const allRequests = Object.values(trackedRequests);
    if (connectionId) {
      return allRequests.filter((r) => r.connectionId === connectionId);
    }
    return allRequests;
  }, [trackedRequests, connectionId]);

  // Get only pending requests
  const pendingRequests = useMemo(() => requests.filter((r) => r.status === REQUEST_STATUS.PENDING), [requests]);

  // Get only resolved requests
  const resolvedRequests = useMemo(() => requests.filter((r) => r.status === REQUEST_STATUS.RESOLVED), [requests]);

  // Get only canceled requests
  const canceledRequests = useMemo(() => requests.filter((r) => r.status === REQUEST_STATUS.CANCELED), [requests]);

  // Get a tracked request by requestKey
  const getByRequestKey = useCallback(
    (requestKey: string): TrackedRequest | undefined => {
      return trackedRequests[requestKey];
    },
    [trackedRequests]
  );

  // Get a tracked request by the original request ID
  const getByRequestId = useCallback(
    (requestId: string): TrackedRequest | undefined => {
      const requestKey = requestIdToRequestKey[requestId];
      return requestKey ? trackedRequests[requestKey] : undefined;
    },
    [requestIdToRequestKey, trackedRequests]
  );

  // Cancel a pending request
  const cancel = useCallback(
    (requestKey: string) => {
      cancelRequest(requestKey);
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

  // Clear specific request by Key
  const clearRequestByKey = useCallback((requestKey: string) => {
    useRequestResponseStore.getState().clearRequestByKey(requestKey);
  }, []);

  return {
    requests,
    pendingRequests,
    resolvedRequests,
    canceledRequests,
    getByRequestKey,
    getByRequestId,
    cancel,
    clear,
    clearRequestByKey,
  };
}
