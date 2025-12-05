export function toMap(value: unknown) {
  if (value instanceof Map) return value;
  if (value && typeof value === 'object') {
    return new Map(Object.entries(value));
  }
  return new Map();
}
