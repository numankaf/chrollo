import { useAppConfigStore } from '@/store/app-config-store';
import { useShallow } from 'zustand/react/shallow';

import type { Tab } from '@/types/layout';
import { cn } from '@/lib/utils';
import { useTabItem } from '@/hooks/app/use-tab-item';
import TabItemIcon from '@/components/icon/tab-item-icon';

export type TabItemContentProps = React.ComponentProps<'span'> & {
  tab: Tab;
};

function TabItemContent({ className, tab }: TabItemContentProps) {
  const { applicationSettings } = useAppConfigStore(
    useShallow((state) => ({
      applicationSettings: state.applicationSettings,
    }))
  );

  const item = useTabItem(tab);

  if (!item) return <span> Not Found</span>;

  return (
    <span className={cn('flex items-center gap-2 text-sm overflow-hidden no-scrollbar transition-all', className)}>
      {applicationSettings.showTabIcons && <TabItemIcon item={item} size={14} className="shrink-0" />}
      <span title={item.name} className="truncate">
        {item.name}
      </span>
    </span>
  );
}

export default TabItemContent;
