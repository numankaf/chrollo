import { Fragment } from 'react';
import { APP_BREADCRUMB_OFFSET } from '@/constants/layout-constants';
import useTabsStore from '@/store/tab-store';
import { getTabBreadcrumbs } from '@/utils/tab-util';
import { useShallow } from 'zustand/react/shallow';

import { useActiveItem } from '@/hooks/app/use-active-item';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/components/common/breadcrumb';
import { ScrollArea, ScrollBar } from '@/components/common/scroll-area';
import SaveItemButton from '@/components/app/button/save-item-button';
import TabItemContent from '@/components/tab/tab-item-content';

function AppBreadcrumb() {
  const { activeTab } = useActiveItem();
  const breadcrumbItems = activeTab ? getTabBreadcrumbs(activeTab) : [];
  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );
  return (
    <div className="flex items-center justify-between pr-2">
      <ScrollArea className="whitespace-nowrap ">
        <Breadcrumb className="flex-1 flex items-center p-3" style={{ height: `${APP_BREADCRUMB_OFFSET}` }}>
          <BreadcrumbList className="flex flex-nowrap flex-row items-center gap-1 ">
            {breadcrumbItems.map((crumb, index) => (
              <Fragment key={crumb.id}>
                <BreadcrumbItem
                  onClick={() => {
                    openTab(crumb);
                  }}
                  className="select-none py-0.5 px-1 rounded-md cursor-pointer hover:bg-secondary hover:text-accent-foreground dark:hover:bg-accent/50"
                >
                  <TabItemContent tab={crumb} />
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {activeTab && <SaveItemButton />}
    </div>
  );
}

export default AppBreadcrumb;
