export class VariablesRuntime {
  private globalsStore = new Map<string, string>();
  private environmentStore = new Map<string, string>();
  private localStore = new Map<string, unknown>();

  private globalsDirty = false;
  private environmentDirty = false;

  // --- Globals ---
  setGlobals(variables: Record<string, string>) {
    this.globalsStore = new Map(Object.entries(variables));
    this.globalsDirty = false;
  }

  getGlobal<T = string>(key: string): T | undefined {
    return this.globalsStore.get(key) as T | undefined;
  }

  setGlobal(key: string, value: string): void {
    if (this.globalsStore.get(key) !== value) {
      this.globalsStore.set(key, value);
      this.globalsDirty = true;
    }
  }

  unsetGlobal(key: string): void {
    if (this.globalsStore.has(key)) {
      this.globalsStore.delete(key);
      this.globalsDirty = true;
    }
  }

  isGlobalsDirty() {
    return this.globalsDirty;
  }

  getAllGlobals(): Record<string, string> {
    return Object.fromEntries(this.globalsStore.entries());
  }

  clearGlobals(): void {
    this.globalsStore.clear();
    this.globalsDirty = true;
  }

  // --- Environment ---
  setEnvironment(variables: Record<string, string>) {
    this.environmentStore = new Map(Object.entries(variables));
    this.environmentDirty = false;
  }

  getEnvironmentVar<T = string>(key: string): T | undefined {
    return this.environmentStore.get(key) as T | undefined;
  }

  setEnvironmentVar(key: string, value: string): void {
    if (this.environmentStore.get(key) !== value) {
      this.environmentStore.set(key, value);
      this.environmentDirty = true;
    }
  }

  unsetEnvironmentVar(key: string): void {
    if (this.environmentStore.has(key)) {
      this.environmentStore.delete(key);
      this.environmentDirty = true;
    }
  }

  isEnvironmentDirty() {
    return this.environmentDirty;
  }

  getAllEnvironment(): Record<string, string> {
    return Object.fromEntries(this.environmentStore.entries());
  }

  clearEnvironment(): void {
    this.environmentStore.clear();
    this.environmentDirty = true;
  }

  // --- Local Variables ---
  getLocal<T = unknown>(key: string): T | undefined {
    return this.localStore.get(key) as T | undefined;
  }

  setLocal(key: string, value: unknown): void {
    this.localStore.set(key, value);
  }

  unsetLocal(key: string): void {
    this.localStore.delete(key);
  }

  getAllLocal(): Record<string, unknown> {
    return Object.fromEntries(this.localStore.entries());
  }

  /** @internal — infrastructure for pre-request → post-response locals handoff */
  snapshotLocal(): Map<string, unknown> {
    return new Map([...this.localStore].map(([k, v]) => [k, structuredClone(v)]));
  }

  /** @internal — infrastructure for pre-request → post-response locals handoff */
  restoreLocal(snapshot: Map<string, unknown>): void {
    this.localStore = new Map(snapshot);
  }

  clearLocal(): void {
    this.localStore.clear();
  }
}
