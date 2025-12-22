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

export function deepParseJson<T extends JsonValue>(input: T, deepParseEnabled?: boolean): T {
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input) as T;
      return deepParseEnabled ? deepParseJson(parsed, deepParseEnabled) : parsed;
    } catch {
      return input;
    }
  } else if (Array.isArray(input)) {
    return input.map((item) => deepParseJson(item)) as T;
  } else if (input && typeof input === 'object') {
    const result: JsonObject = {};
    for (const key in input) {
      result[key] = deepParseJson(input[key]);
    }
    return result as T;
  }
  return input;
}

const IGNORED_KEYS = new Set([
  'id',
  'name',
  'children',
  'modelType',
  'createdDate',
  'createdBy',
  'updatedDate',
  'updatedBy',
]);

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function normalizeForCompare<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(normalizeForCompare) as T;
  }

  if (isPlainObject(value)) {
    const result: PlainObject = {};

    for (const [key, val] of Object.entries(value)) {
      if (IGNORED_KEYS.has(key)) continue;
      result[key] = normalizeForCompare(val);
    }

    return result as T;
  }

  return value;
}
