export class VariablesRuntime {
  private store = new Map<string, unknown>();

  get<T = unknown>(key: string): T | undefined {
    return this.store.get(key) as T | undefined;
  }

  set(key: string, value: unknown): void {
    this.store.set(key, value);
  }

  unset(key: string): void {
    this.store.delete(key);
  }

  all(): Record<string, unknown> {
    return Object.fromEntries(this.store.entries());
  }

  clear() {
    this.store.clear();
  }
}
