import vm from 'vm';
import { getMainWindow } from '@/main/index';

function createSandboxConsole() {
  const send = (channel: string, ...args: unknown[]) => {
    const mainWindow = getMainWindow();
    if (mainWindow) {
      mainWindow.webContents.send(channel, ...args);
    }
  };

  return Object.freeze({
    log: (...args: unknown[]) => send('console:log', ...args),
    info: (...args: unknown[]) => send('console:info', ...args),
    warn: (...args: unknown[]) => send('console:warn', ...args),
    error: (...args: unknown[]) => send('console:error', ...args),
  });
}

export function executeUserScript(script: string, context: Record<string, unknown>) {
  const sandbox = {
    ...context,
    console: createSandboxConsole(),
  };

  Object.assign(sandbox, {
    window: undefined,
    document: undefined,
    globalThis: undefined,
    process: undefined,
    require: undefined,
    Function: undefined,
    eval: undefined,
  });

  const vmContext = vm.createContext(sandbox);

  vm.runInContext(script, vmContext, { timeout: 1000 });
}
