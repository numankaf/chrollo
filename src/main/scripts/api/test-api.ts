import type { TestRuntime } from '@/main/scripts/runtime/test-runtime';
import { expect } from 'chai';

export function createTestAPI(runtime: TestRuntime) {
  return Object.freeze({
    test: (name: string, fn: () => void) => {
      try {
        fn();
        runtime.addResult(name, true);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        runtime.addResult(name, false, message);
      }
    },
    expect,
  });
}
