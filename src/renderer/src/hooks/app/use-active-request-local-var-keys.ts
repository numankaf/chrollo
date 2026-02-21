import useCollectionItemStore from '@/store/collection-item-store';
import { extractLocalVarKeys } from '@/utils/script-util';

import { BASE_MODEL_TYPE } from '@/types/base';
import { COLLECTION_TYPE, type Request } from '@/types/collection';
import { useActiveItem } from '@/hooks/app/use-active-item';

function useActiveRequestLocalVarKeys(): string[] {
  const { activeTab } = useActiveItem();

  const preScript = useCollectionItemStore((s) => {
    if (!activeTab || activeTab.modelType !== BASE_MODEL_TYPE.COLLECTION) return undefined;
    const item = s.collectionItemMap.get(activeTab.id);
    if (!item || item.collectionItemType !== COLLECTION_TYPE.REQUEST) return undefined;
    return (item as Request).scripts?.preRequest;
  });

  if (!preScript) return [];
  return extractLocalVarKeys(preScript);
}

export default useActiveRequestLocalVarKeys;
