import { createStompAPI } from '@/main/scripts/api/stomp-api';
import { createUtilsAPI } from '@/main/scripts/api/utils-api';
import { createVariablesAPI } from '@/main/scripts/api/variables-api';
import { executeUserScript } from '@/main/scripts/engine/execute-user-script';
import { ChrolloRuntime } from '@/main/scripts/runtime/chrollo-runtime';

export class ChrolloScriptEngine {
  private runtime = new ChrolloRuntime();
  private scriptError: Error | null = null;

  load(script: string) {
    this.runtime = new ChrolloRuntime();
    this.scriptError = null;

    const context = {
      chrollo: {
        stomp: createStompAPI(this.runtime.stomp),
        variables: createVariablesAPI(this.runtime.variables),
        utils: createUtilsAPI(this.runtime.utils),
      },
    };

    try {
      executeUserScript(script, context);
    } catch (err) {
      this.scriptError = err as Error;
      console.error('[SCRIPT ERROR]', this.scriptError);
    }
  }

  getRuntime() {
    return this.runtime;
  }

  getScriptError() {
    return this.scriptError;
  }
}
