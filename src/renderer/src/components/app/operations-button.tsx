import { useState } from 'react';
import { AddItemDialog } from '@/features/connections/components/common/add-item-dialog';
import useCollectionItemStore from '@/store/collection-item-store';
import { confirmDialog } from '@/store/confirm-dialog-store';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { operationHandlers } from '@/utils/base-item-utils';
import { Ellipsis } from 'lucide-react';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import { BASE_MODEL_TYPE, type BaseItem } from '@/types/base';
import {
  COLLECTION_TYPE,
  FOLDER_DEFAULT_VALUES,
  REQUEST_DEFAULT_VALUES,
  type Folder,
  type Request,
} from '@/types/collection';
import { Button } from '@/components/common/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';

type OperationsButtonProps = {
  item: BaseItem;
};

function OperationsButton({ item }: OperationsButtonProps) {
  const { deleteItem } = operationHandlers[item.modelType];
  const confirmDeleteItem = () => {
    confirmDialog({
      header: `Delete "${item.name}"`,
      message: `Are you sure you want to delete "${item.name}"?`,
      actionLabel: 'Delete',
      accept: async () => {
        await deleteItem(item.id);
      },
    });
  };

  const { activeWorkspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
    }))
  );
  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );
  const { saveCollectionItem } = useCollectionItemStore(
    useShallow((state) => ({
      saveCollectionItem: state.saveCollectionItem,
    }))
  );

  const [addFolderDialogOpen, setAddFolderDialogOpen] = useState<boolean>(false);
  const [addRequestDialogOpen, setAddRequestDialogOpen] = useState<boolean>(false);

  async function onAddFolderSubmit(values: { name: string }) {
    if (!activeWorkspaceId) {
      return;
    }
    try {
      const folderPayload: Folder = {
        id: nanoid(8),
        name: values.name,
        workspaceId: activeWorkspaceId,
        parentId: item.id,
        ...FOLDER_DEFAULT_VALUES,
      };
      const newFolder = await saveCollectionItem(folderPayload);
      openTab(newFolder);
      setAddFolderDialogOpen(false);
    } catch (error) {
      console.error('Failed to submit collection:', error);
      toast.error('Failed to submit collection.');
    }
  }

  async function onAddRequestSubmit(values: { name: string }) {
    if (!activeWorkspaceId) {
      return;
    }
    try {
      const requestPayload: Request = {
        id: nanoid(8),
        name: values.name,
        workspaceId: activeWorkspaceId,
        parentId: item.id,
        ...REQUEST_DEFAULT_VALUES,
      };
      const newRequest = await saveCollectionItem(requestPayload);
      openTab(newRequest);
      setAddRequestDialogOpen(false);
    } catch (error) {
      console.error('Failed to submit collection:', error);
      toast.error('Failed to submit collection.');
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <Button
          asChild
          size="icon"
          variant="secondary"
          className="w-5! h-5! p-0.5 rounded-md  bg-transparent hidden"
          id="operations-trigger"
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="bg-background w-40 data-[state=closed]:animate-none!">
        {item.modelType === BASE_MODEL_TYPE.COLLECTION &&
          (item.collectionItemType === COLLECTION_TYPE.COLLECTION ||
            item.collectionItemType === COLLECTION_TYPE.FOLDER) && (
            <>
              {addRequestDialogOpen && (
                <AddItemDialog
                  title="Create Request"
                  inputLabel="Request Name"
                  inputRequiredLabel="Request name is required."
                  inputPlaceholder="Enter a request name"
                  defaultValue="New Request"
                  open={addRequestDialogOpen}
                  onOpenChange={(open) => {
                    setAddRequestDialogOpen(open);
                  }}
                  onSubmit={onAddRequestSubmit}
                />
              )}
              <DropdownMenuItem
                className="text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  setAddRequestDialogOpen(true);
                }}
              >
                Add Request
              </DropdownMenuItem>
              {addFolderDialogOpen && (
                <AddItemDialog
                  title="Create Folder"
                  inputLabel="Folder Name"
                  inputRequiredLabel="Folder name is required."
                  inputPlaceholder="Enter a folder name"
                  defaultValue="New Folder"
                  open={addFolderDialogOpen}
                  onOpenChange={(open) => setAddFolderDialogOpen(open)}
                  onSubmit={onAddFolderSubmit}
                />
              )}
              <DropdownMenuItem
                className="text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  setAddFolderDialogOpen(true);
                }}
              >
                Add Folder
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
        {/* <DropdownMenuItem className="text-sm" onClick={(e) => e.preventDefault()}>
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem className="text-sm" onClick={(e) => e.preventDefault()}>
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm" onClick={(e) => e.preventDefault()}>
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-500 text-sm hover:bg-red-500! hover:text-white!"
          onClick={async (e) => {
            e.stopPropagation();
            confirmDeleteItem();
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default OperationsButton;
