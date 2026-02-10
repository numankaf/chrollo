import { Fragment, useState } from 'react';
import { APP_BREADCRUMB_OFFSET } from '@/constants/layout-constants';
import { isSaveButtonVisible, renameItem } from '@/utils/save-registry-util';
import { getTabBreadcrumbs } from '@/utils/tab-util';

import { type Tab, type TabItem } from '@/types/layout';
import { cn } from '@/lib/utils';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { useTabItem } from '@/hooks/app/use-tab-item';
import { useTabNavigation } from '@/hooks/app/use-tab-navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/components/common/breadcrumb';
import InlineEditText from '@/components/common/inline-edit-text';
import { ScrollArea, ScrollBar } from '@/components/common/scroll-area';
import SaveItemButton from '@/components/app/button/save-item-button';
import TabItemContent from '@/components/tab/tab-item-content';

function AppBreadcrumb() {
  const { activeTab } = useActiveItem();
  const breadcrumbItems = activeTab ? getTabBreadcrumbs(activeTab) : [];
  const { openTab } = useTabNavigation();

  const [renamingId, setRenamingId] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-between pr-2">
      <ScrollArea className="whitespace-nowrap ">
        <Breadcrumb className="flex-1 flex items-center p-3" style={{ height: `${APP_BREADCRUMB_OFFSET}` }}>
          <BreadcrumbList className="flex flex-nowrap flex-row items-center gap-1 h-2.5">
            {breadcrumbItems.map((crumb, index) => {
              const isLast = index === breadcrumbItems.length - 1;
              const isRenaming = renamingId === crumb.id;

              return (
                <Fragment key={crumb.id}>
                  <BreadcrumbItem
                    onClick={!isLast ? () => openTab(crumb) : undefined}
                    onDoubleClick={isLast ? () => setRenamingId(crumb.id) : undefined}
                    className={cn(
                      'select-none whitespace-nowrap rounded-md px-1 py-0.5 transition-colors hover:text-accent-foreground hover:bg-accent/50 cursor-pointer',
                      isLast && !isRenaming && 'cursor-text',
                      isRenaming && 'hover:bg-transparent'
                    )}
                  >
                    <BreadcrumbItemEditable
                      tab={crumb}
                      isEditing={isLast && isRenaming}
                      onComplete={() => setRenamingId(null)}
                    />
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {activeTab && isSaveButtonVisible(activeTab) && <SaveItemButton />}
    </div>
  );
}

function BreadcrumbItemEditable({
  tab,
  isEditing,
  onComplete,
}: {
  tab: Tab;
  isEditing: boolean;
  onComplete: () => void;
}) {
  const item = useTabItem(tab);
  if (!item) return null;

  if (isEditing) {
    return (
      <div className="min-w-40" onClick={(e) => e.stopPropagation()}>
        <InlineEditText
          value={item.name}
          editing={true}
          onComplete={(value) => {
            renameItem(item as TabItem, value);
            onComplete();
          }}
        />
      </div>
    );
  }

  return <TabItemContent tab={tab} />;
}

export default AppBreadcrumb;
