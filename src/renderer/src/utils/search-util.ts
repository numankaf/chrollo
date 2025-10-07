export function applyTextSearch<T>(items: T[], search: string, keySelector: (item: T) => string): T[] {
  const term = search.trim().toLowerCase();
  if (!term) return items;
  return items.filter((item) => keySelector(item).toLowerCase().includes(term));
}
