import { create } from 'zustand';

import type { Request } from '@/types/collection';
import { REQUEST_STATUS, type RequestStatus, type TrackedRequest } from '@/types/request-response';
import type { SocketMessage } from '@/types/socket';

interface RequestResponseStore {
  // Map: requestId (collection item) -> requestKey (correlation key set by user script)
  requestIdToRequestKey: Record<string, string>;

  // Map: requestKey -> TrackedRequest (the actual tracking info)
  trackedRequests: Record<string, TrackedRequest>;

  // Actions
  addPendingRequest: (requestKey: string, requestId: string, connectionId: string, request: Request) => void;

  setRequestIdMapping: (requestId: string, requestKey: string) => void;

  resolveRequest: (requestKey: string, response: SocketMessage) => void;

  cancelRequest: (requestKey: string) => void;

  getRequestByKey: (requestKey: string) => TrackedRequest | undefined;

  getRequestByRequestId: (requestId: string) => TrackedRequest | undefined;

  clearAll: () => void;

  clearByConnectionId: (connectionId: string) => void;
}

const useRequestResponseStore = create<RequestResponseStore>((set, get) => ({
  requestIdToRequestKey: {},
  trackedRequests: {},

  addPendingRequest: (requestKey, requestId, connectionId, request) =>
    set((state) => ({
      trackedRequests: {
        ...state.trackedRequests,
        [requestKey]: {
          requestKey,
          requestId,
          connectionId,
          status: REQUEST_STATUS.PENDING as RequestStatus,
          request,
          startTime: Date.now(),
        },
      },
    })),

  setRequestIdMapping: (requestId, requestKey) =>
    set((state) => ({
      requestIdToRequestKey: {
        ...state.requestIdToRequestKey,
        [requestId]: requestKey,
      },
    })),

  resolveRequest: (requestKey, response) =>
    set((state) => {
      const existing = state.trackedRequests[requestKey];
      if (!existing || existing.status !== REQUEST_STATUS.PENDING) {
        return state;
      }
      return {
        trackedRequests: {
          ...state.trackedRequests,
          [requestKey]: {
            ...existing,
            status: REQUEST_STATUS.RESOLVED as RequestStatus,
            response,
            endTime: Date.now(),
          },
        },
      };
    }),

  cancelRequest: (requestKey) =>
    set((state) => {
      const existing = state.trackedRequests[requestKey];
      if (!existing || existing.status !== REQUEST_STATUS.PENDING) {
        return state;
      }
      return {
        trackedRequests: {
          ...state.trackedRequests,
          [requestKey]: {
            ...existing,
            status: REQUEST_STATUS.CANCELED as RequestStatus,
            endTime: Date.now(),
          },
        },
      };
    }),

  getRequestByKey: (requestKey) => get().trackedRequests[requestKey],

  getRequestByRequestId: (requestId) => {
    const requestKey = get().requestIdToRequestKey[requestId];
    return requestKey ? get().trackedRequests[requestKey] : undefined;
  },

  clearAll: () =>
    set({
      requestIdToRequestKey: {},
      trackedRequests: {},
    }),

  clearByConnectionId: (connectionId) =>
    set((state) => {
      const newTrackedRequests = { ...state.trackedRequests };
      const newRequestIdToRequestKey = { ...state.requestIdToRequestKey };

      for (const [key, tracked] of Object.entries(state.trackedRequests)) {
        if (tracked.connectionId === connectionId) {
          delete newTrackedRequests[key];
          delete newRequestIdToRequestKey[tracked.requestId];
        }
      }

      return {
        requestIdToRequestKey: newRequestIdToRequestKey,
        trackedRequests: newTrackedRequests,
      };
    }),
}));

export default useRequestResponseStore;
