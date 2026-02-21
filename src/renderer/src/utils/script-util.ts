import { VARIABLE_SOURCE, type VariableSource } from '@/types/common';
import type { EnvironmentVariable } from '@/types/environment';

export type VariableSourceResult = {
  source: VariableSource | undefined;
  variable: EnvironmentVariable | undefined;
};

export function resolveVariableSource(
  varName: string,
  envVars: EnvironmentVariable[],
  globalVars: EnvironmentVariable[],
  scriptLocalVarKeys: string[]
): VariableSourceResult {
  if (scriptLocalVarKeys.includes(varName)) return { source: VARIABLE_SOURCE.SCRIPT, variable: undefined };

  const envVar = envVars.find((v) => v.key === varName);
  if (envVar) return { source: VARIABLE_SOURCE.ENVIRONMENT, variable: envVar };

  const globalVar = globalVars.find((v) => v.key === varName);
  if (globalVar) return { source: VARIABLE_SOURCE.GLOBAL, variable: globalVar };

  return { source: undefined, variable: undefined };
}

export function extractLocalVarKeys(script: string): string[] {
  const regex = /chrollo\.variables\.local\.set\(\s*['"`]([^'"`]+)['"`]/g;
  const keys: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(script)) !== null) keys.push(match[1]);
  return keys;
}
