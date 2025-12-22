import type { BaseAuditModel } from '@/types/base';

export function sortByDate<T extends BaseAuditModel>(items: T[], field: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return items.sort((a, b) => {
    const aValue = a[field] ? new Date(a[field] as string).getTime() : 0;
    const bValue = b[field] ? new Date(b[field] as string).getTime() : 0;

    return order === 'asc' ? aValue - bValue : bValue - aValue;
  });
}
