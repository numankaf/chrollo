import { useMemo } from 'react';
import useCollectionItemStore from '@/store/collection-item-store';
import useWorkspaceStore from '@/store/workspace-store';
import { useShallow } from 'zustand/react/shallow';

import type { CollectionItem } from '@/types/collection';

export function useWorkspaceCollectionItemMap() {
  const { collectionItemMap } = useCollectionItemStore(
    useShallow((state) => ({
      collectionItemMap: state.collectionItemMap,
    }))
  );
  const { workspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      workspaceId: state.selectedWorkspace?.id,
    }))
  );

  return useMemo(() => {
    if (!workspaceId) return new Map();

    const filtered = new Map<string, CollectionItem>();

    for (const [key, item] of collectionItemMap.entries()) {
      if (item.workspaceId === workspaceId) {
        filtered.set(key, item);
      }
    }

    return filtered;
  }, [collectionItemMap, workspaceId]);
}
