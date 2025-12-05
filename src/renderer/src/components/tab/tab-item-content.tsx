import type { JSX } from 'react';
import { Container, FolderOpen, GalleryVerticalEnd, LayoutDashboard, Zap } from 'lucide-react';

import { BASE_MODEL_TYPE } from '@/types/base';
import { COLLECTION_TYPE } from '@/types/collection';
import type { Tab } from '@/types/layout';
import { useTabItem } from '@/hooks/use-tab-item';
import { ConnectionIcon } from '@/components/icon/connection-icon';

function TabItemContent({ tab }: { tab: Tab }) {
  let Icon: JSX.Element | null = null;
  let name = '';

  const item = useTabItem(tab);

  if (!item) return <span> Not Found</span>;

  switch (item.modelType) {
    case BASE_MODEL_TYPE.CONNECTION:
      Icon = <ConnectionIcon connectionType={item.connectionType} size={16} className="shrink-0" />;
      name = item.name;
      break;

    case BASE_MODEL_TYPE.ENVIRONMENT:
      Icon = <Container size={16} className="shrink-0" />;
      name = item.name;
      break;

    case BASE_MODEL_TYPE.WORKSPACE:
      Icon = <LayoutDashboard size={16} className="shrink-0" />;
      name = item.name;
      break;

    case BASE_MODEL_TYPE.COLLECTION:
      name = item.name;
      switch (item.collectionItemType) {
        case COLLECTION_TYPE.COLLECTION:
          Icon = <GalleryVerticalEnd size={16} />;
          break;
        case COLLECTION_TYPE.FOLDER:
          Icon = <FolderOpen size={16} />;
          break;
        case COLLECTION_TYPE.REQUEST:
          Icon = <Zap size={16} color="var(--color-green-500)" className="shrink-0" />;
          break;
      }
      break;

    // case BASE_MODEL_TYPE.REQUEST_HISTORY:
    //   Icon = <History size={16} color="var(--color-amber-500)" className="shrink-0" />;
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
