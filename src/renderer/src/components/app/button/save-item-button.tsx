import { useEffect, useState } from 'react';
import useTabsStore from '@/store/tab-store';
import { saveItem } from '@/utils/save-registry-util';
import { getPersistedTabItem } from '@/utils/tab-util';
import deepEqual from 'fast-deep-equal';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import type { TabItem } from '@/types/layout';
import { normalizeForCompare } from '@/lib/utils';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { useTabItem } from '@/hooks/app/use-tab-item';
import { Button } from '@/components/common/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/common/tooltip';

function SaveItemButton() {
  const { activeTab } = useActiveItem();
  const item = useTabItem(activeTab);
  const [loading, setLoading] = useState(false);

  const [persistedItem, setPersistedItem] = useState<TabItem | undefined>(undefined);

  const { dirtyBeforeSaveByTab, setDirtyBeforeSaveByTab } = useTabsStore(
    useShallow((state) => ({
      dirtyBeforeSaveByTab: state.dirtyBeforeSaveByTab,
      setDirtyBeforeSaveByTab: state.setDirtyBeforeSaveByTab,
    }))
  );

  const dirty = activeTab ? dirtyBeforeSaveByTab[activeTab.id] : false;

  useEffect(() => {
    if (!activeTab) {
      setPersistedItem(undefined);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      const persisted = await getPersistedTabItem(activeTab);
      if (!cancelled) {
        setPersistedItem(persisted);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  useEffect(() => {
    if (!item || !persistedItem) {
      return;
    }

    setDirtyBeforeSaveByTab(item.id, !deepEqual(normalizeForCompare(item), normalizeForCompare(persistedItem)));
  }, [item, persistedItem, setDirtyBeforeSaveByTab]);

  async function save() {
    if (!activeTab || !item) return;

    try {
      setLoading(true);
      const savedItem = await saveItem(item);
      if (savedItem) setPersistedItem(savedItem as TabItem);

      toast.success(`${item.name} saved.`, { duration: 1000 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="w-20 disabled:cursor-not-allowed! disabled:pointer-events-auto!"
          onClick={save}
          size="sm"
          variant="outline"
          disabled={!dirty || loading}
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save
        </Button>
      </TooltipTrigger>
      {!dirty && (
        <TooltipContent side="bottom" className="[&_svg]:invisible bg-secondary text-secondary-foreground">
          <span>No new changes to save</span>
        </TooltipContent>
      )}
    </Tooltip>
  );
}

export default SaveItemButton;
