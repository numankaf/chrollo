import type { JSX } from 'react';
import { Container, FolderOpen, GalleryVerticalEnd, History, Zap } from 'lucide-react';

import { BASE_MODEL_TYPE } from '@/types/base';
import { COLLECTION_TYPE } from '@/types/collection';
import type { TabItem } from '@/types/layout';
import { WebSocketIcon } from '@/components/icon/websocket-icon';

function TabItemContent(item: TabItem) {
  let Icon: JSX.Element | null = null;
  let name = '';

  switch (item.modelType) {
    case BASE_MODEL_TYPE.CONNECTION:
      Icon = <WebSocketIcon className="w-4 h-4 shrink-0" />;
      name = item.name;
      break;

    case BASE_MODEL_TYPE.ENVIRONMENT:
      Icon = <Container className="w-4 h-4 shrink-0" />;
      name = item.name;
      break;

    case BASE_MODEL_TYPE.COLLECTION:
      name = item.name;
      switch (item.collectionItemType) {
        case COLLECTION_TYPE.COLLECTION:
          Icon = <GalleryVerticalEnd className="w-4 h-4 shrink-0" />;
          break;
        case COLLECTION_TYPE.FOLDER:
          Icon = <FolderOpen className="w-4 h-4 shrink-0" />;
          break;
        case COLLECTION_TYPE.REQUEST:
          Icon = <Zap className="w-4 h-4 text-green-500 shrink-0" />;
          break;
      }
      break;

    case BASE_MODEL_TYPE.REQUEST_HISTORY:
      Icon = <History className="w-4 h-4 shrink-0 text-amber-500" />;
      name = item.request?.name ?? 'Unnamed Request'; // ✅ handle nested request name safely
      break;
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
