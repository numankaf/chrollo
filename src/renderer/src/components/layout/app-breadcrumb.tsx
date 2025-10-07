import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from '@/components/common/breadcrumb';
import { useShallow } from 'zustand/react/shallow';
import { APP_BREADCRUMB_OFFSET } from '../../constants/layout-constants';
import useTabsStore from '../../store/tab-store';
import TabItemContent from '../tab/tab-item-content';

const AppBreadcrumb = () => {
  const { activeTab } = useTabsStore(
    useShallow((state) => ({
      activeTab: state.activeTab,
    }))
  );

  return (
    <Breadcrumb className="flex items-center p-2" style={{ height: `${APP_BREADCRUMB_OFFSET}` }}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Breadcrumb>{activeTab && <TabItemContent {...activeTab.item} />}</Breadcrumb>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadcrumb;
