import { chrolloEngine } from '@/main/scripts/engine';

import { ENVIRONMENT_VARIABLE_CAPTURE_REGEX, ENVIRONMENT_VARIABLE_MATCH_REGEX } from '@/types/common';

function getAllVariables(): Record<string, unknown> {
  const runtime = chrolloEngine.getRuntime();
  return {
    ...runtime.variables.getAllGlobals(),
    ...runtime.variables.getAllEnvironment(),
    ...runtime.variables.getAllLocal(),
  };
}

export function resolveVariables(template: string): string {
  const variables = getAllVariables();
  return template.replace(ENVIRONMENT_VARIABLE_MATCH_REGEX, (match) => {
    const capture = ENVIRONMENT_VARIABLE_CAPTURE_REGEX.exec(match);
    if (!capture) return match;
    const key = capture[1];
    const val = variables[key];

    if (val === undefined) return key;

    if (typeof val === 'object') {
      return JSON.stringify(val);
    }
    return String(val);
  });
}

export function resolveJsonPayload(template: string): string {
  const resolved = resolveVariables(template);
  try {
    return JSON.stringify(JSON.parse(resolved), null, 2);
  } catch {
    return resolved;
  }
}
