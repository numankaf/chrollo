import { makeInfo } from '@/components/app/editor/code-mirror/completions/api/shared';

const VARIABLE_GLOBAL_AND_ENVIRONMENT_METHODS = [
  { label: 'get', type: 'function', info: '(key: string) => string | undefined' },
  { label: 'set', type: 'function', info: '(key: string, value: string) => void' },
  { label: 'unset', type: 'function', info: '(key: string) => void' },
  { label: 'all', type: 'function', info: '() => Record<string, string>' },
  { label: 'clear', type: 'function', info: '() => void' },
];

export const VARIABLES_GLOBALS_API = VARIABLE_GLOBAL_AND_ENVIRONMENT_METHODS;
export const VARIABLES_ENVIRONMENT_API = VARIABLE_GLOBAL_AND_ENVIRONMENT_METHODS;

export const VARIABLES_LOCAL_API = [
  { label: 'get', type: 'function', info: '(key: string) => unknown' },
  { label: 'set', type: 'function', info: '(key: string, value: unknown) => void' },
  { label: 'unset', type: 'function', info: '(key: string) => void' },
  { label: 'all', type: 'function', info: '() => Record<string, unknown>' },
  { label: 'clear', type: 'function', info: '() => void' },
];

export const VARIABLES_API = [
  {
    label: 'globals',
    type: 'class',
    info: () =>
      makeInfo(`
        <div>
          <b>Global Variables</b><br/>
          Workspace-level variables shared across all environments and scripts.
          Changes are persisted to the workspace's global environment.<br/>
          Values are stored as strings.<br/>
          <b>Examples:</b><br/>
          <code>chrollo.variables.globals.set("baseUrl", "ws://localhost:8080")</code><br/>
          <code>chrollo.variables.globals.get("baseUrl")</code><br/>
        </div>
      `),
  },
  {
    label: 'environment',
    type: 'class',
    info: () =>
      makeInfo(`
        <div>
          <b>Environment Variables</b><br/>
          Variables scoped to the currently active environment in the workspace.
          Changes are persisted to the selected environment.<br/>
          Values are stored as strings.<br/>
          <b>Examples:</b><br/>
          <code>chrollo.variables.environment.set("token", "abc123")</code><br/>
          <code>chrollo.variables.environment.get("token")</code><br/>
        </div>
      `),
  },
  {
    label: 'local',
    type: 'class',
    info: () =>
      makeInfo(`
        <div>
          <b>Local Variables</b><br/>
          Temporary in-memory variables that only exist during script execution.
          Automatically cleared after each execution context completes.<br/>
          Values can be any type (string, number, object, array, etc.).<br/>
          <b>Examples:</b><br/>
          <code>chrollo.variables.local.set("counter", 42)</code><br/>
          <code>chrollo.variables.local.set("payload", { id: 1 })</code><br/>
          <code>chrollo.variables.local.get("counter")</code><br/>
        </div>
      `),
  },
  { label: 'get', type: 'function', info: '@deprecated — Use globals.get() instead', boost: -1 },
  { label: 'set', type: 'function', info: '@deprecated — Use globals.set() instead', boost: -1 },
  { label: 'unset', type: 'function', info: '@deprecated — Use globals.unset() instead', boost: -1 },
  { label: 'all', type: 'function', info: '@deprecated — Use globals.all() instead', boost: -1 },
];
