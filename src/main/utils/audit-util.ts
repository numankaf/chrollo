import type { BaseAuditModel } from '@/types/base';

export function applyAuditFields<T extends BaseAuditModel>(item: T): T {
  const now = new Date().toISOString();

  if (!item.createdDate) {
    return {
      ...item,
      //createdBy: userId,
      createdDate: now,
      //updatedBy: userId,
      updatedDate: now,
    };
  }

  return {
    ...item,
    //updatedBy: userId,
    updatedDate: now,
  };
}
