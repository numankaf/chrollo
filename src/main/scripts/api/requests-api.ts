import type { RequestsRuntime } from '@/main/scripts/runtime/requests-runtime';

export function createRequestsAPI(runtime: RequestsRuntime) {
  return Object.freeze({
    setRequestKey(requestKey: string) {
      runtime.setRequestKey(requestKey);
    },

    resolveRequestKey(requestKey: string) {
      runtime.resolveRequestKey(requestKey);
    },
  });
}
