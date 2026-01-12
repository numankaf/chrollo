import { useCallback, useState } from 'react';
import type { OnChangeFn, VisibilityState } from '@tanstack/react-table';

export function useColumnVisibility(storageKey: string, defaultVisibility: VisibilityState = {}) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : defaultVisibility;
  });

  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = useCallback(
    (updaterOrValue) => {
      setColumnVisibility((prev) => {
        const next = typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue;
        localStorage.setItem(storageKey, JSON.stringify(next));
        return next;
      });
    },
    [storageKey]
  );

  return [columnVisibility, handleColumnVisibilityChange] as const;
}
