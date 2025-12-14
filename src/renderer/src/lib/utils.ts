import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
interface JsonObject {
  [key: string]: JsonValue;
}

export function deepParseJson<T extends JsonValue>(input: T): T {
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input) as T;
      return deepParseJson(parsed);
    } catch {
      return input;
    }
  } else if (Array.isArray(input)) {
    return input.map(deepParseJson) as T;
  } else if (input && typeof input === 'object') {
    const result: JsonObject = {};
    for (const key in input) {
      result[key] = deepParseJson(input[key]);
    }
    return result as T;
  }
  return input;
}
