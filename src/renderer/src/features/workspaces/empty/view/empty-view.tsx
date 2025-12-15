import AppLogo from '@/resources/app-logo.svg';
import useTabsStore from '@/store/tab-store';
import { LayoutDashboard, Zap } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { useActiveItem } from '@/hooks/app/use-active-item';
import { Button } from '@/components/common/button';

function EmptyView() {
  const { activeWorkspace } = useActiveItem();
  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="opacity-30  bg-secondary p-10 rounded-full">
        <img className="w-40 h-40 shrink-0" src={AppLogo} alt="App Logo" />
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={() => {
            if (activeWorkspace) {
              openTab(activeWorkspace);
            }
          }}
        >
          <LayoutDashboard size={14} className="shrink-0" />
          Go to Workspace Overview
        </Button>
        <Button variant="secondary">
          <Zap size={14} className="shrink-0" />
          Create a New Request
        </Button>
      </div>
    </div>
  );
}

export default EmptyView;
