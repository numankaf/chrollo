import { useCallback, useEffect, useState } from 'react';
import useTabsStore from '@/store/tab-store';
import { saveItem } from '@/utils/save-registry-util';
import { getPersistedTabItem } from '@/utils/tab-util';
import deepEqual from 'fast-deep-equal';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import { BASE_MODEL_TYPE } from '@/types/base';
import { NULL_PARENT_ID, type Folder, type Request, type RequestResponse } from '@/types/collection';
import { COMMANDS } from '@/types/command';
import type { TabItem } from '@/types/layout';
import { commandBus } from '@/lib/command-bus';
import { normalizeForCompare } from '@/lib/utils';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { useTabItem } from '@/hooks/app/use-tab-item';
import { Button } from '@/components/common/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/common/tooltip';

import { SaveRequestDialog } from '../dialog/save-request-dialog';

function SaveItemButton() {
  const { activeTab } = useActiveItem();
  const item = useTabItem(activeTab);
  const [loading, setLoading] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

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

  const save = useCallback(async () => {
    if (!activeTab || !item) return;

    if (
      item.modelType === BASE_MODEL_TYPE.COLLECTION &&
      (item as Folder | Request | RequestResponse).parentId === NULL_PARENT_ID
    ) {
      setSaveDialogOpen(true);
      return;
    }

    try {
      setLoading(true);
      const savedItem = await saveItem(item);
      if (savedItem) setPersistedItem(savedItem as TabItem);

      toast.success(`${item.name} saved.`, { duration: 1000 });
    } finally {
      setLoading(false);
    }
  }, [activeTab, item]);

  const handleSaveAsSubmit = async (values: { name: string; parentId: string }) => {
    if (!item) return;
    try {
      setLoading(true);
      const updatedItem = { ...item, name: values.name, parentId: values.parentId };
      const savedItem = await saveItem(updatedItem);
      if (savedItem) {
        setPersistedItem(savedItem as TabItem);
      }
      setSaveDialogOpen(false);
      toast.success(`${values.name} saved.`, { duration: 1000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribeSave = commandBus.on(COMMANDS.ITEM_SAVE, () => {
      save();
    });
    const unsubscriberRequestSaveToCollection = commandBus.on(COMMANDS.ITEM_REQUEST_SAVE_TO_COLLECTION, () => {
      setSaveDialogOpen(true);
    });
    return () => {
      unsubscribeSave?.();
      unsubscriberRequestSaveToCollection?.();
    };
  }, [save]);

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
      {saveDialogOpen && (
        <SaveRequestDialog
          open={saveDialogOpen}
          onOpenChange={setSaveDialogOpen}
          onSubmit={handleSaveAsSubmit}
          defaultName={item?.name}
        />
      )}
    </Tooltip>
  );
}

export default SaveItemButton;
