import { SIDEBAR_TOP_OFFSET, SIDEBAR_WORKSPACE_OFFSET } from '@/constants/layout-constants';
import { Outlet } from 'react-router';

import { useAppSubscriptions } from '@/hooks/use-app-subscriptions';
import { SidebarInset } from '@/components/common/sidebar';
import AppBreadcrumb from '@/components/layout/app-breadcrumb';
import AppTabs from '@/components/layout/app-tabs';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';

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
