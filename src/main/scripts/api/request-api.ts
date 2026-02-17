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

export function createResponseAPI(runtime: RequestRuntime) {
  return {
    get data() {
      const raw = runtime.getMessage()?.data ?? null;
      if (raw === null) return null;
      return {
        raw: () => raw,
        json: () => JSON.parse(raw),
      };
    },
    get meta() {
      return runtime.getMessage()?.meta ?? null;
    },
  };
}
