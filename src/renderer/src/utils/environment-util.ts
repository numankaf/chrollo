import useEnvironmentStore from '@/store/environment-store';
import { getActiveWorkspaceSelection } from '@/utils/workspace-util';

import { ENVIRONMENT_VAR_CAPTURE_REGEX, ENVIRONMENT_VAR_REGEX } from '@/types/common';

export function resolveEnvironmentVariables(text: string): string {
  if (!text) return text;

  const activeEnvironmentId = getActiveWorkspaceSelection('activeEnvironmentId');
  if (!activeEnvironmentId) return text;

  const environment = useEnvironmentStore.getState().environments.find((e) => e.id === activeEnvironmentId);

  if (!environment?.variables?.length) return text;

  // Build lookup map for enabled variables
  const variableMap = new Map(environment.variables.filter((v) => v.enabled).map((v) => [v.key, v.value]));

  if (variableMap.size === 0) return text;

  return text.replace(ENVIRONMENT_VAR_REGEX, (match) => {
    const capture = ENVIRONMENT_VAR_CAPTURE_REGEX.exec(match);
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
