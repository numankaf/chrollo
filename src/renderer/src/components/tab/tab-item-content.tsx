import { ChevronsLeftRightEllipsis, Container, GalleryVerticalEnd, LibraryBig } from 'lucide-react';
import type { TabItem } from '../../types/layout';
import RequestIcon from '../icon/request-icon';

const TabItemContent = (item: TabItem) => {
  return (
    <div className="flex items-center gap-2 text-sm overflow-x-auto">
      {item.type === 'connection' && <ChevronsLeftRightEllipsis className="w-4 h-4 text-orange-500" />}
      {item.type === 'environment' && <Container className="w-4 h-4" />}
      {item.type === 'collection' && <GalleryVerticalEnd className="w-4 h-4" />}
      {item.type === 'folder' && <LibraryBig className="w-4 h-4" />}
      {item.type === 'request' && <RequestIcon commandType={item.commandType} />}
      <p title={item.name} className="overflow-x-auto no-scrollbar">
        {item.name}
      </p>
    </div>
  );
};

export default TabItemContent;
