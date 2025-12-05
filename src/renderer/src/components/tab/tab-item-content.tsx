import type { JSX } from 'react';
import { Container, LayoutDashboard } from 'lucide-react';

import { BASE_MODEL_TYPE } from '@/types/base';
import type { Tab } from '@/types/layout';
import { useTabItem } from '@/hooks/use-tab-item';
import { CollectionItemIcon } from '@/components/icon/collection-item-icon';
import { ConnectionIcon } from '@/components/icon/connection-icon';

function TabItemContent({ tab }: { tab: Tab }) {
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
    <span className="flex items-center gap-2 text-sm overflow-hidden no-scrollbar">
      {Icon}
      <span title={name} className="truncate max-w-40">
        {name}
      </span>
    </span>
  );
}

export default TabItemContent;
