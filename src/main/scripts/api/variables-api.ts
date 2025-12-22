import type { VariablesRuntime } from '@/main/scripts/runtime/variables-runtime';

export function createVariablesAPI(runtime: VariablesRuntime) {
  return Object.freeze({
    get(key: string) {
      return runtime.get(key);
    },
    set(key: string, value: unknown) {
      runtime.set(key, value);
    },
    unset(key: string) {
      runtime.unset(key);
    },
    all() {
      return runtime.all();
    },
  });
}
