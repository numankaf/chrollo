import useEnvironmentStore from '@/store/environment-store';
import { getActiveWorkspaceSelection } from '@/utils/workspace-util';

export function resolveEnvironmentVariables(text: string): string {
  if (!text) return text;

  const activeEnvironmentId = getActiveWorkspaceSelection('activeEnvironmentId');
  if (!activeEnvironmentId) return text;

  const environment = useEnvironmentStore.getState().environments.find((e) => e.id === activeEnvironmentId);
  if (!environment || !environment.variables) return text;

  // Resolve variables that are enabled
  const variables = environment.variables.filter((v) => v.enabled);

  let resolvedText = text;

  // Use a regex to find all {{key}} patterns
  const variableRegex = /\{\{(.+?)\}\}/g;

  resolvedText = resolvedText.replace(variableRegex, (match, key) => {
    const variable = variables.find((v) => v.key === key.trim());
    return variable ? variable.value : match;
  });

  return resolvedText;
}

export function resolveObjectVariables<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  const resolved = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key in resolved) {
    const value = resolved[key];
    if (typeof value === 'string') {
      resolved[key] = resolveEnvironmentVariables(value);
    } else if (typeof value === 'object' && value !== null) {
      resolved[key] = resolveObjectVariables(value);
    }
  }

  return resolved as T;
}
