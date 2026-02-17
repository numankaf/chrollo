import type { TestResult } from '@/types/request-response';

export class TestRuntime {
  private results: TestResult[] = [];

  beginContext() {
    this.results = [];
  }

  addResult(name: string, passed: boolean, error?: string) {
    this.results.push({
      name,
      passed,
      error,
      timestamp: Date.now(),
    });
  }

  getResults(): TestResult[] {
    return [...this.results];
  }
}
