import type { UtilsRuntime } from '@/main/scripts/runtime/utils-runtime';

export function createUtilsAPI(runtime: UtilsRuntime) {
  return Object.freeze({
    randomId: (size?: number) => runtime.randomId(size),
    now: () => runtime.now(),
  });
}
