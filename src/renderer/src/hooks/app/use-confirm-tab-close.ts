import { useCallback } from 'react';
import { useAppConfigStore } from '@/store/app-config-store';
import { confirmDialog } from '@/store/confirm-dialog-store';
import useTabsStore from '@/store/tab-store';
import { hasParent } from '@/utils/collection-util';
import { saveItem } from '@/utils/save-registry-util';
import { getTabItem } from '@/utils/tab-util';
import { toast } from 'sonner';

import { BASE_MODEL_TYPE } from '@/types/base';
import { NULL_PARENT_ID } from '@/types/collection';
import { COMMANDS } from '@/types/command';
import { commandBus } from '@/lib/command-bus';
import { useTabNavigation } from '@/hooks/app/use-tab-navigation';

export function useConfirmTabClose() {
  const { closeTab } = useTabNavigation();

  const confirmTabClose = useCallback(
    (tabId: string) => {
      const tab = useTabsStore.getState().tabs.find((t) => t.id === tabId) ?? null;
      if (!tab) {
        closeTab(tabId);
        return;
      }
      const tabItem = getTabItem(tab);
      if (!tabItem) {
        closeTab(tab.id);
        return;
      }

      const dirty = useTabsStore.getState().dirtyBeforeSaveByTab[tab.id];

      const discardUnsavedChangesOnClose =
        useAppConfigStore.getState().applicationSettings.discardUnsavedChangesOnClose;

      if (dirty && !discardUnsavedChangesOnClose) {
        confirmDialog({
          header: 'Do you want to save?',
          message: `The tab ${tabItem.name} has unsaved changes.
                If you close it now, those changes might be lost when you close the app.
                Save your changes to avoid losing your work.`,
          primaryLabel: 'Save Changes',
          onPrimaryAction: async () => {
            if (!tabItem) return;

            if (
              tabItem.modelType === BASE_MODEL_TYPE.COLLECTION &&
              hasParent(tabItem) &&
              tabItem.parentId === NULL_PARENT_ID
            ) {
              commandBus.emit(COMMANDS.ITEM_REQUEST_SAVE_TO_COLLECTION);
              return;
            }

            const savedItem = await saveItem(tabItem);
            toast.success(`${savedItem?.name} saved.`, { duration: 1000 });
            closeTab(tabId);
          },
          primaryButtonProps: { variant: 'default' },
          secondaryLabel: "Don't Save",
          onSecondaryAction: () => {
            if (
              tabItem.modelType === BASE_MODEL_TYPE.COLLECTION &&
              hasParent(tabItem) &&
              tabItem.parentId === NULL_PARENT_ID
            ) {
              window.api.collection.delete(tabItem.id);
            }
            closeTab(tabId);
          },
          cancelLabel: 'Close',
        });
      } else {
        closeTab(tabId);
      }
    },
    [closeTab]
  );

  return { confirmTabClose };
}
