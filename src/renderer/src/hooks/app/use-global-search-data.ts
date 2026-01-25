import { useMemo } from 'react';
import useCollectionItemStore from '@/store/collection-item-store';
import useConnectionStore from '@/store/connection-store';
import useEnvironmentStore from '@/store/environment-store';
import useGlobalSearchStore from '@/store/global-search-store';
import useInterceptionScriptStore from '@/store/interception-script-store';
import useWorkspaceStore from '@/store/workspace-store';
import { applyTextSearch } from '@/utils/search-util';
import { useShallow } from 'zustand/react/shallow';

import { BASE_MODEL_TYPE, type BaseModelType } from '@/types/base';
import { type CollectionItem, type CollectionType } from '@/types/collection';
import type { TabItem } from '@/types/layout';

export type SearchFilterType = BaseModelType | CollectionType;

interface UseGlobalSearchDataProps {
  search: string;
  selectedTypes: SearchFilterType[];
}

export function useGlobalSearchData({ search, selectedTypes }: UseGlobalSearchDataProps) {
  const { workspaces } = useWorkspaceStore(useShallow((state) => ({ workspaces: state.workspaces })));
  const { connections } = useConnectionStore(useShallow((state) => ({ connections: state.connections })));
  const { collectionItemMap } = useCollectionItemStore(
    useShallow((state) => ({ collectionItemMap: state.collectionItemMap }))
  );
  const { environments } = useEnvironmentStore(useShallow((state) => ({ environments: state.environments })));
  const { interceptionScripts } = useInterceptionScriptStore(
    useShallow((state) => ({ interceptionScripts: state.interceptionScripts }))
  );
  const recentTabs = useGlobalSearchStore((state) => state.recentTabs);

  const allItems = useMemo(() => {
    const items: TabItem[] = [
      ...workspaces,
      ...connections,
      ...Array.from(collectionItemMap.values()),
      ...environments,
      ...interceptionScripts,
    ];
    return items;
  }, [workspaces, connections, collectionItemMap, environments, interceptionScripts]);

  const filteredItems = useMemo(() => {
    let items = allItems;

    if (selectedTypes.length > 0) {
      items = items.filter((item) => {
        return selectedTypes.some((selectedType) => {
          if (item.modelType === BASE_MODEL_TYPE.COLLECTION) {
            return (item as CollectionItem).collectionItemType === selectedType;
          }
          if (item.modelType === selectedType) return true;
          return false;
        });
      });
    }

    if (!search.trim() && selectedTypes.length === 0) {
      const recentIds = recentTabs.map((ri) => ri.id);
      return items
        .filter((item) => recentIds.includes(item.id))
        .sort((a, b) => {
          const riA = recentTabs.find((ri) => ri.id === a.id);
          const riB = recentTabs.find((ri) => ri.id === b.id);
          return (riB?.timestamp ?? 0) - (riA?.timestamp ?? 0);
        });
    }

    return applyTextSearch(items, search, (item) => item.name);
  }, [allItems, selectedTypes, search, recentTabs]);

  return {
    filteredItems,
    allItems,
  };
}
