import { ChevronsLeftRightEllipsis, Container, GalleryVerticalEnd, LibraryBig } from 'lucide-react';
import type { Tab } from '../../types/layout';
import RequestIcon from '../icon/request-icon';

const TabItemContent = (tab: Tab) => {
  return (
    <div className="flex items-center gap-2 text-xs overflow-x-auto">
      {tab.item.type === 'connection' && <ChevronsLeftRightEllipsis className="w-4 h-4 text-orange-500" />}
      {tab.item.type === 'enviroment' && <Container className="w-4 h-4" />}
      {tab.item.type === 'collection' && <GalleryVerticalEnd className="w-4 h-4" />}
      {tab.item.type === 'folder' && <LibraryBig className="w-4 h-4" />}
      {tab.item.type === 'request' && <RequestIcon commandType={tab.item.commandType} />}
      <p title={tab.item.name} className="overflow-x-auto no-scrollbar">
        {tab.item.name}
      </p>
    </div>
  );
};

export default TabItemContent;
