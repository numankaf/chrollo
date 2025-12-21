import { createStompAPI } from '@/main/scripts/api/stomp-api';
import { createUtilsAPI } from '@/main/scripts/api/utils-api';
import { createVariablesAPI } from '@/main/scripts/api/variables-api';
import { executeUserScript } from '@/main/scripts/engine/execute-user-script';
import { ChrolloRuntime } from '@/main/scripts/runtime/chrollo-runtime';

interface ChrolloContext {
  chrollo: {
    stomp: ReturnType<typeof createStompAPI>;
    variables: ReturnType<typeof createVariablesAPI>;
    utils: ReturnType<typeof createUtilsAPI>;
  };
}

export class ChrolloScriptEngine {
  private runtime = new ChrolloRuntime();
  private scriptError: Error | null = null;
  private context!: ChrolloContext;

  constructor() {
    this.initializeContext();
  }

  private initializeContext() {
    this.context = {
      chrollo: {
        stomp: createStompAPI(this.runtime.stomp),
        variables: createVariablesAPI(this.runtime.variables),
        utils: createUtilsAPI(this.runtime.utils),
      },
    };
  }

  loadScript(script: string) {
    this.scriptError = null;

    try {
      executeUserScript(script, this.context as unknown as Record<string, unknown>);
    } catch (err) {
      this.scriptError = err as Error;
      console.error('[SCRIPT ERROR]', this.scriptError);
    }
  }

  reset() {
    this.runtime = new ChrolloRuntime();
    this.initializeContext();
    this.scriptError = null;
  }

  reloadScripts(scripts: string[]) {
    this.reset();
    scripts.forEach((script) => this.loadScript(script));
  }

  getRuntime() {
    return this.runtime;
  }

  getScriptError() {
    return this.scriptError;
  }
}
