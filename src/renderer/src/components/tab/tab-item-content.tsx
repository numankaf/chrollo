import { Container, GalleryVerticalEnd, LibraryBig, Zap } from 'lucide-react';
import type { TabItem } from '../../types/layout';
import WebSocketIcon from '../icon/websocket-icon';

const TabItemContent = (item: TabItem) => {
  return (
    <span className="flex items-center gap-2 text-sm overflow-hidden no-scrollbar">
      {item.type === 'connection' && <WebSocketIcon className="w-4 h-4 shrink-0" />}
      {item.type === 'environment' && <Container className="w-4 h-4 shrink-0" />}
      {item.type === 'collection' && <GalleryVerticalEnd className="w-4 h-4 shrink-0" />}
      {item.type === 'folder' && <LibraryBig className="w-4 h-4 shrink-0" />}
      {item.type === 'request' && <Zap className="w-4 h-4 text-green-500 shrink-0" />}

      <span
        title={item.name}
        className="truncate max-w-[160px]" // prevent overflow while allowing hover title
      >
        {item.name}
      </span>
    </span>
  );
};

export default TabItemContent;
