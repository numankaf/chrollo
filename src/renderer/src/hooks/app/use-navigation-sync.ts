import { useEffect } from 'react';
import useCommandSearchStore from '@/store/command-search-store';

import { useActiveItem } from '@/hooks/app/use-active-item';

export function useNavigationSync() {
  const { activeTab } = useActiveItem();

  useEffect(() => {
    // save recent tabs here on tab change
    if (activeTab) {
      const { recentTabs, addRecentTab } = useCommandSearchStore.getState();
      if (recentTabs[0]?.id !== activeTab.id) {
        addRecentTab(activeTab);
      }
    }
  }, [activeTab]);
}
