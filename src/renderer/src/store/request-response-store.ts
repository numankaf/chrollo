import { create } from 'zustand';

import type { Request } from '@/types/collection';
import { REQUEST_STATUS, type RequestStatus, type TestResult, type TrackedRequest } from '@/types/request-response';
import type { SocketMessage } from '@/types/socket';

interface RequestResponseStore {
  // Map: requestId -> current pending TrackedRequest
  requestIdToTrackedRequest: Map<string, TrackedRequest>;

  // Map: requestId -> last resolved TrackedRequest (persists when new pending request starts)
  requestIdToLastResolvedRequest: Map<string, TrackedRequest>;

  // Actions
  addPendingRequest: (requestKey: string, requestId: string, connectionId: string, request: Request) => void;

  resolveRequest: (
    requestKey: string,
    response: SocketMessage,
    responseTime: number,
    testResults: TestResult[]
  ) => void;

  cancelRequest: (requestId: string) => void;
  clearAll: () => void;

  clearByConnectionId: (connectionId: string) => void;

  clearRequest: (requestId: string) => void;
}

const useRequestResponseStore = create<RequestResponseStore>((set) => ({
  requestIdToTrackedRequest: new Map(),
  requestIdToLastResolvedRequest: new Map(),

  addPendingRequest: (requestKey, requestId, connectionId, request) =>
    set((state) => {
      const newRequestIdToTrackedRequest = new Map(state.requestIdToTrackedRequest);
      newRequestIdToTrackedRequest.set(requestId, {
        requestKey,
        requestId,
        connectionId,
        status: REQUEST_STATUS.PENDING as RequestStatus,
        request,
        startTime: Date.now(),
      });

      return {
        requestIdToTrackedRequest: newRequestIdToTrackedRequest,
      };
    }),

  resolveRequest: (requestKey, response, responseTime, testResults) =>
    set((state) => {
      // Find the requestId by scanning map values for matching requestKey
      let requestId: string | undefined;
      for (const [id, tracked] of state.requestIdToTrackedRequest.entries()) {
        if (tracked.requestKey === requestKey) {
          requestId = id;
          break;
        }
      }

      if (!requestId) {
        return state;
      }

      const existing = state.requestIdToTrackedRequest.get(requestId);
      if (!existing || existing.status !== REQUEST_STATUS.PENDING) {
        return state;
      }

      const resolvedTrackedRequest = {
        ...existing,
        status: REQUEST_STATUS.RESOLVED as RequestStatus,
        response,
        responseTime,
        testResults,
        endTime: Date.now(),
      };

      const newRequestIdToTrackedRequest = new Map(state.requestIdToTrackedRequest);
      newRequestIdToTrackedRequest.set(requestId, resolvedTrackedRequest);

      const newRequestIdToLastResolvedRequest = new Map(state.requestIdToLastResolvedRequest);
      newRequestIdToLastResolvedRequest.set(requestId, resolvedTrackedRequest);

      return {
        requestIdToTrackedRequest: newRequestIdToTrackedRequest,
        requestIdToLastResolvedRequest: newRequestIdToLastResolvedRequest,
      };
    }),

  cancelRequest: (requestId) =>
    set((state) => {
      const existing = state.requestIdToTrackedRequest.get(requestId);
      if (!existing || existing.status !== REQUEST_STATUS.PENDING) {
        return state;
      }

      const newRequestIdToTrackedRequest = new Map(state.requestIdToTrackedRequest);
      newRequestIdToTrackedRequest.set(requestId, {
        ...existing,
        status: REQUEST_STATUS.CANCELED as RequestStatus,
        endTime: Date.now(),
      });

      return {
        requestIdToTrackedRequest: newRequestIdToTrackedRequest,
      };
    }),

  clearAll: () =>
    set({
      requestIdToTrackedRequest: new Map(),
      requestIdToLastResolvedRequest: new Map(),
    }),

  clearByConnectionId: (connectionId) =>
    set((state) => {
      const newRequestIdToTrackedRequest = new Map(state.requestIdToTrackedRequest);
      const newRequestIdToLastResolvedRequest = new Map(state.requestIdToLastResolvedRequest);

      for (const [requestId, tracked] of state.requestIdToTrackedRequest.entries()) {
        if (tracked.connectionId === connectionId) {
          newRequestIdToTrackedRequest.delete(requestId);
        }
      }

      for (const [requestId, tracked] of state.requestIdToLastResolvedRequest.entries()) {
        if (tracked.connectionId === connectionId) {
          newRequestIdToLastResolvedRequest.delete(requestId);
        }
      }

      return {
        requestIdToTrackedRequest: newRequestIdToTrackedRequest,
        requestIdToLastResolvedRequest: newRequestIdToLastResolvedRequest,
      };
    }),

  clearRequest: (requestId) =>
    set((state) => {
      const newRequestIdToTrackedRequest = new Map(state.requestIdToTrackedRequest);
      newRequestIdToTrackedRequest.delete(requestId);

      const newRequestIdToLastResolvedRequest = new Map(state.requestIdToLastResolvedRequest);
      newRequestIdToLastResolvedRequest.delete(requestId);

      return {
        requestIdToTrackedRequest: newRequestIdToTrackedRequest,
        requestIdToLastResolvedRequest: newRequestIdToLastResolvedRequest,
      };
    }),
}));

export default useRequestResponseStore;
