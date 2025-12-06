import { SIDEBAR_TOP_OFFSET, SIDEBAR_WORKSPACE_OFFSET } from '@/constants/layout-constants';
import { Outlet } from 'react-router';

import { useAppSubscriptions } from '@/hooks/use-app-subscriptions';
import { SidebarInset } from '@/components/common/sidebar';
import AppBreadcrumb from '@/components/layout/app-breadcrumb';
import { AppSidebar } from '@/components/layout/app-sidebar';
import AppTabs from '@/components/layout/app-tabs';

function AppMainContent() {
  useAppSubscriptions();
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <AppTabs />
        <AppBreadcrumb />
        <div
          style={{
            height: `calc(100% - ${SIDEBAR_TOP_OFFSET} - ${SIDEBAR_WORKSPACE_OFFSET})`,
          }}
          className="flex flex-col overflow-hidden"
        >
          <Outlet />
        </div>
      </SidebarInset>
    </>
  );
}

export default AppMainContent;
