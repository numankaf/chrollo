import useCollectionItemStore from '@/store/collection-item-store';
import { useShallow } from 'zustand/react/shallow';

export function useWorkspaceCollectionItemMap() {
  const { collectionItemMap } = useCollectionItemStore(
    useShallow((state) => ({
      collectionItemMap: state.collectionItemMap,
    }))
  );

  return collectionItemMap;
}
