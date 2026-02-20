import { getGlobalId } from '@/main/environment/environment-ipc';
import { getMainWindow } from '@/main/index';
import logger from '@/main/lib/logger';
import { createFakerAPI } from '@/main/scripts/api/faker-api';
import { createRequestAPI, createResponseAPI } from '@/main/scripts/api/request-api';
import { createStompAPI } from '@/main/scripts/api/stomp-api';
import { createTestAPI } from '@/main/scripts/api/test-api';
import { createUtilsAPI } from '@/main/scripts/api/utils-api';
import { createVariablesAPI } from '@/main/scripts/api/variables-api';
import { executeUserScript } from '@/main/scripts/engine/execute-user-script';
import { ChrolloRuntime } from '@/main/scripts/runtime/chrollo-runtime';

import type { Environment, EnvironmentVariable } from '@/types/environment';

interface ChrolloContext {
  chrollo: {
    stomp: ReturnType<typeof createStompAPI>;
    variables: ReturnType<typeof createVariablesAPI>;
    utils: ReturnType<typeof createUtilsAPI>;
    request: ReturnType<typeof createRequestAPI>;
    response: ReturnType<typeof createResponseAPI>;
    faker: ReturnType<typeof createFakerAPI>;
    test: ReturnType<typeof createTestAPI>['test'];
    expect: ReturnType<typeof createTestAPI>['expect'];
  };
}

export class ChrolloScriptEngine {
  private runtime = new ChrolloRuntime();
  private scriptError: Error | null = null;
  private context!: ChrolloContext;

  private activeWorkspaceId?: string;
  private activeEnvironmentId?: string;

  // Serializes executeWithContext calls to prevent re-entrancy corruption
  private executionQueue: Promise<unknown> = Promise.resolve();

  constructor() {
    this.initializeContext();
  }

  private initializeContext() {
    const testAPI = createTestAPI(this.runtime.test);
    this.context = {
      chrollo: {
        stomp: createStompAPI(this.runtime.stomp),
        variables: createVariablesAPI(this.runtime.variables),
        utils: createUtilsAPI(this.runtime.utils),
        request: createRequestAPI(this.runtime.request),
        response: createResponseAPI(this.runtime.request),
        faker: createFakerAPI(this.runtime.faker),
        test: testAPI.test,
        expect: testAPI.expect,
      },
    };
  }

  private async initVariables(workspaceId: string, activeEnvironmentId?: string) {
    this.activeWorkspaceId = workspaceId;
    this.activeEnvironmentId = activeEnvironmentId;

    const { getEnvironment } = await import('@/main/environment/environment-ipc');

    // Load Globals
    const globalId = getGlobalId(workspaceId);
    const globalEnv = await getEnvironment(globalId);
    if (globalEnv) {
      const globals = globalEnv.variables.reduce(
        (acc, v: EnvironmentVariable) => ({ ...acc, [v.key]: v.value }),
        {} as Record<string, string>
      );
      this.runtime.variables.setGlobals(globals);
    }

    // Load Environment
    if (activeEnvironmentId) {
      const env = await getEnvironment(activeEnvironmentId);
      if (env) {
        const variables = env.variables.reduce(
          (acc, v: EnvironmentVariable) => ({ ...acc, [v.key]: v.value }),
          {} as Record<string, string>
        );
        this.runtime.variables.setEnvironment(variables);
      }
    } else {
      this.runtime.variables.setEnvironment({});
    }

    // Clear local variables for new context
    this.runtime.variables.clearLocal();
  }

  private async persistVariables() {
    if (!this.activeWorkspaceId) return;

    const { getEnvironment, saveEnvironment } = await import('@/main/environment/environment-ipc');

    // Save Globals if dirty
    if (this.runtime.variables.isGlobalsDirty()) {
      const globalId = getGlobalId(this.activeWorkspaceId);
      const globalEnv = await getEnvironment(globalId);
      if (globalEnv) {
        const updatedVariables = this.runtime.variables.getAllGlobals();
        globalEnv.variables = Object.entries(updatedVariables).map(([key, value]): EnvironmentVariable => {
          const existing = globalEnv.variables.find((v: EnvironmentVariable) => v.key === key);
          return {
            id: existing?.id || Math.random().toString(36).substring(7),
            key,
            value,
            description: existing?.description || '',
            enabled: existing?.enabled ?? true,
          };
        });
        await saveEnvironment(globalEnv);
        logger.info(`Persisted globals for workspace: ${this.activeWorkspaceId}`);
        this.notifyEnvironmentUpdated(globalEnv);
      }
    }

    // Save Environment if dirty
    if (this.activeEnvironmentId && this.runtime.variables.isEnvironmentDirty()) {
      const env = await getEnvironment(this.activeEnvironmentId);
      if (env) {
        const updatedVariables = this.runtime.variables.getAllEnvironment();
        env.variables = Object.entries(updatedVariables).map(([key, value]): EnvironmentVariable => {
          const existing = env.variables.find((v: EnvironmentVariable) => v.key === key);
          return {
            id: existing?.id || Math.random().toString(36).substring(7),
            key,
            value,
            description: existing?.description || '',
            enabled: existing?.enabled ?? true,
          };
        });
        await saveEnvironment(env);
        logger.info(`Persisted environment variables for: ${this.activeEnvironmentId}`);
        this.notifyEnvironmentUpdated(env);
      }
    }
  }

  private notifyEnvironmentUpdated(environment: Environment) {
    const mainWindow = getMainWindow();
    if (mainWindow) {
      mainWindow.webContents.send('environment:updated', environment);
    }
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
    this.activeWorkspaceId = undefined;
    this.activeEnvironmentId = undefined;
  }

  async getActiveEnvironmentId(workspaceId: string): Promise<string | undefined> {
    const { getWorkspaceSelection } = await import('@/main/workspace/workspace-ipc');
    const selection = await getWorkspaceSelection();
    return selection[workspaceId]?.activeEnvironmentId;
  }

  async executeWithContext<T>(workspaceId: string | undefined, callback: () => Promise<T> | T): Promise<T> {
    if (!workspaceId) {
      return callback();
    }

    const next = this.executionQueue.then(async () => {
      const activeEnvironmentId = await this.getActiveEnvironmentId(workspaceId);
      await this.initVariables(workspaceId, activeEnvironmentId);
      try {
        return await callback();
      } finally {
        await this.persistVariables();
      }
    });

    // Advance queue even if this execution throws, so it doesn't jam
    this.executionQueue = next.catch(() => undefined);

    return next;
  }

  async reloadScripts(scripts: string[], workspaceId?: string) {
    await this.executeWithContext(workspaceId, () => {
      this.reset();
      scripts.forEach((script) => this.loadScript(script));
    });
  }

  getRuntime() {
    return this.runtime;
  }

  getScriptError() {
    return this.scriptError;
  }
}
