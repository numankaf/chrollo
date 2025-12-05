import { Fragment } from 'react';
import { APP_BREADCRUMB_OFFSET } from '@/constants/layout-constants';
import useCollectionItemStore from '@/store/collection-item-store';
import { hasParent } from '@/utils/collection-util';
import { getTabItem } from '@/utils/tab-util';
import { useShallow } from 'zustand/react/shallow';

import { type CollectionItem } from '@/types/collection';
import { useActiveItem } from '@/hooks/use-active-item';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/components/common/breadcrumb';
import SaveItemButton from '@/components/app/save-item-button';
import TabItemContent from '@/components/tab/tab-item-content';

function AppBreadcrumb() {
  const { activeTab } = useActiveItem();

  const { collectionItemMap } = useCollectionItemStore(
    useShallow((state) => ({
      collectionItemMap: state.collectionItemMap,
    }))
  );

  const getParentChain = (item: CollectionItem): CollectionItem[] => {
    if (!hasParent(item) || (hasParent(item) && !item.parentId)) return [item];

    const parent = collectionItemMap.get(item.parentId);
    if (parent) {
      return [...getParentChain(parent), item];
    }

    return [item];
  };

  const tabItem = activeTab ? getTabItem(activeTab) : null;
  if (!activeTab || !tabItem) return null;

  const breadcrumbItems = getParentChain(tabItem as CollectionItem);

  return (
    <div className="flex items-center justify-between pr-2">
      <Breadcrumb className="flex items-center p-3" style={{ height: `${APP_BREADCRUMB_OFFSET}` }}>
        <BreadcrumbList>
          {breadcrumbItems.map((crumb, index) => (
            <Fragment key={crumb.id}>
              <BreadcrumbItem>
                <TabItemContent tab={crumb} />
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <SaveItemButton />
    </div>
  );
}

export default AppBreadcrumb;
