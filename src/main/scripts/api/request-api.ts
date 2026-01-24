import type { RequestRuntime } from '@/main/scripts/runtime/request-runtime';

export function createRequestAPI(runtime: RequestRuntime) {
  return Object.freeze({
    setRequestKey(requestKey: string) {
      runtime.setRequestKey(requestKey);
    },

    resolveRequestKey(requestKey: string) {
      runtime.resolveRequestKey(requestKey);
    },
  });
}
