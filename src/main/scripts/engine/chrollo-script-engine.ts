import { getMainWindow } from '@/main/index';
import logger from '@/main/lib/logger';
import { createFakerAPI } from '@/main/scripts/api/faker-api';
import { createRequestAPI } from '@/main/scripts/api/request-api';
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
    request: ReturnType<typeof createRequestAPI>;
    faker: ReturnType<typeof createFakerAPI>;
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
        request: createRequestAPI(this.runtime.request),
        faker: createFakerAPI(this.runtime.faker),
      },
    };
  }

  loadScript(script: string) {
    this.scriptError = null;

    try {
      executeUserScript(script, this.context as unknown as Record<string, unknown>);
    } catch (err) {
      this.scriptError = err as Error;
      logger.error(`[SCRIPT ERROR] ${this.scriptError}`);
      const mainWindow = getMainWindow();
      if (!mainWindow) return;
      mainWindow.webContents.send('console:error', `[SCRIPT ERROR] ${this.scriptError}`);
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
