import type { VariablesRuntime } from '@/main/scripts/runtime/variables-runtime';

export function createVariablesAPI(runtime: VariablesRuntime) {
  return Object.freeze({
    globals: {
      get(key: string) {
        return runtime.getGlobal(key);
      },
      set(key: string, value: string) {
        runtime.setGlobal(key, value);
      },
      unset(key: string) {
        runtime.unsetGlobal(key);
      },
      all() {
        return runtime.getAllGlobals();
      },
      clear() {
        runtime.clearGlobals();
      },
    },
    environment: {
      get(key: string) {
        return runtime.getEnvironment(key);
      },
      set(key: string, value: string) {
        runtime.setEnvironmentVar(key, value);
      },
      unset(key: string) {
        runtime.unsetEnvironmentVar(key);
      },
      all() {
        return runtime.getAllEnvironment();
      },
      clear() {
        runtime.clearEnvironment();
      },
    },
    local: {
      get(key: string) {
        return runtime.getLocal(key);
      },
      set(key: string, value: unknown) {
        runtime.setLocal(key, value);
      },
      unset(key: string) {
        runtime.unsetLocal(key);
      },
      all() {
        return runtime.getAllLocal();
      },
      clear() {
        runtime.clearLocal();
      },
    },

    /** @deprecated Use `chrollo.variables.globals.get()` instead. */
    get(key: string) {
      return runtime.getGlobal(key);
    },
    /** @deprecated Use `chrollo.variables.globals.set()` instead */
    set(key: string, value: string) {
      runtime.setGlobal(key, value);
    },
    /** @deprecated Use `chrollo.variables.globals.unset()` instead */
    unset(key: string) {
      runtime.unsetGlobal(key);
    },
    /** @deprecated Use the scoped `.globals.all()` instead */
    all() {
      return runtime.getAllGlobals();
    },
  });
}
