import type { JSX } from 'react';
import { useAppConfigStore } from '@/store/app-config-store';
import { Container, FileCode, LayoutDashboard } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { BASE_MODEL_TYPE } from '@/types/base';
import type { Tab } from '@/types/layout';
import { cn } from '@/lib/utils';
import { useTabItem } from '@/hooks/app/use-tab-item';
import { CollectionItemIcon } from '@/components/icon/collection-item-icon';
import { ConnectionIcon } from '@/components/icon/connection-icon';

export type TabItemContentProps = React.ComponentProps<'span'> & {
  tab: Tab;
};

function TabItemContent({ className, tab }: TabItemContentProps) {
  const { applicationSettings } = useAppConfigStore(
    useShallow((state) => ({
      applicationSettings: state.applicationSettings,
    }))
  );

  let Icon: JSX.Element | null = null;
  let name = '';

  const item = useTabItem(tab);

  if (!item) return <span> Not Found</span>;

  switch (item.modelType) {
    case BASE_MODEL_TYPE.CONNECTION:
      Icon = <ConnectionIcon connectionType={item.connectionType} size={14} className="shrink-0" />;
      name = item.name;
      break;

    case BASE_MODEL_TYPE.ENVIRONMENT:
      Icon = <Container size={14} className="shrink-0" />;
      name = item.name;
      break;

    case BASE_MODEL_TYPE.INTERCEPTION_SCRIPT:
      Icon = <FileCode size={14} className="shrink-0" />;
      name = item.name;
      break;

    case BASE_MODEL_TYPE.WORKSPACE:
      Icon = <LayoutDashboard size={14} className="shrink-0" />;
      name = item.name;
      break;

    case BASE_MODEL_TYPE.COLLECTION:
      Icon = <CollectionItemIcon collectionType={item.collectionItemType} size={14} className="shrink-0" />;

      name = item.name;

      break;

    // case BASE_MODEL_TYPE.REQUEST_HISTORY:
    //   Icon = <History size={14} color="var(--color-amber-500)" className="shrink-0" />;
    //   name = item.request?.name ?? 'Unnamed Request';
    //   break;
  }

  return (
    <span className={cn('flex items-center gap-2 text-sm overflow-hidden no-scrollbar transition-all', className)}>
      {applicationSettings.showTabIcons && Icon}
      <span title={name} className="truncate">
        {name}
      </span>
    </span>
  );
}

export default TabItemContent;
