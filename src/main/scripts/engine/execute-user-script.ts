import vm from 'vm';

export function executeUserScript(script: string, context: Record<string, unknown>) {
  const sandbox = {
    ...context,
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
