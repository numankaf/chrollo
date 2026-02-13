import useEnvironmentStore from '@/store/environment-store';
import { getActiveWorkspaceSelection } from '@/utils/workspace-util';

import { ENVIRONMENT_VARIABLE_CAPTURE_REGEX, ENVIRONMENT_VARIABLE_MATCH_REGEX } from '@/types/common';

export function resolveEnvironmentVariables(text: string): string {
  if (!text) return text;

  const { environments, globalEnvironment } = useEnvironmentStore.getState();
  const activeEnvironmentId = getActiveWorkspaceSelection('activeEnvironmentId');
  const environment = environments.find((e) => e.id === activeEnvironmentId);

  const hasGlobalVars = !!globalEnvironment?.variables?.length;
  const hasEnvVars = !!environment?.variables?.length;

  if (!hasGlobalVars && !hasEnvVars) return text;

  // Build lookup map for enabled variables
  const variableMap = new Map<string, string>();

  // Resolve ordered: first look for globals and then look for other environments
  // Environment precedence is higher, so environment variables overwrite globals
  if (globalEnvironment?.variables) {
    globalEnvironment.variables.filter((v) => v.enabled).forEach((v) => variableMap.set(v.key, v.value));
  }

  if (environment?.variables) {
    environment.variables.filter((v) => v.enabled).forEach((v) => variableMap.set(v.key, v.value));
  }

  if (variableMap.size === 0) return text;

  return text.replace(ENVIRONMENT_VARIABLE_MATCH_REGEX, (match) => {
    ENVIRONMENT_VARIABLE_CAPTURE_REGEX.lastIndex = 0;
    const capture = ENVIRONMENT_VARIABLE_CAPTURE_REGEX.exec(match);
    if (!capture) return match;

    const key = capture[1];
    return variableMap.get(key) ?? match;
  });
}

export function resolveObjectVariables<T>(value: T): T {
  if (typeof value === 'string') {
    return resolveEnvironmentVariables(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map(resolveObjectVariables) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveObjectVariables(v)])) as T;
  }

  return value;
}
