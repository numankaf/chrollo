import { useCallback, useEffect, useEffectEvent, useMemo, useState } from 'react';
import useCollectionItemStore from '@/store/collection-item-store';
import { confirmDialog } from '@/store/confirm-dialog-store';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { hasChildren } from '@/utils/collection-util';
import { ChevronRight, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Tree, TreeApi, type NodeRendererProps, type RowRendererProps } from 'react-arborist';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import {
  COLLECTION_DEFAULT_VALUES,
  COLLECTION_TYPE,
  FOLDER_DEFAULT_VALUES,
  REQUEST_DEFAULT_VALUES,
  type Collection,
  type CollectionItem,
  type Folder,
  type Request,
} from '@/types/collection';
import { useActiveItem } from '@/hooks/app/use-active-item';
import useDebouncedValue from '@/hooks/common/use-debounced-value';
import { useResizeObserver } from '@/hooks/common/use-resize-observer';
import { useWorkspaceCollectionItemMap } from '@/hooks/workspace/use-workspace-collection-item-map';
import { Button } from '@/components/common/button';
import InlineEditText from '@/components/common/inline-edit-text';
import { SearchBar } from '@/components/common/search-input';
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader } from '@/components/common/sidebar';
import OperationsButton, { type OperationButtonItem } from '@/components/app/button/operations-button';
import { AddItemDialog } from '@/components/app/dialog/add-item-dialog';
import NoCollectionFound from '@/components/app/empty/no-collection-found';
import NoResultsFound from '@/components/app/empty/no-results-found';
import { CollectionItemIcon } from '@/components/icon/collection-item-icon';

function CollectionItemNode({ node, style, dragHandle }: NodeRendererProps<CollectionItem>) {
  const item = node.data;
  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );
  const { saveCollectionItem, deleteCollectionItem, cloneCollectionItem, updateCollectionItem } =
    useCollectionItemStore(
      useShallow((state) => ({
        deleteCollectionItem: state.deleteCollectionItem,
        saveCollectionItem: state.saveCollectionItem,
        cloneCollectionItem: state.cloneCollectionItem,
        updateCollectionItem: state.updateCollectionItem,
      }))
    );

  const { activeWorkspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
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
        id: nanoid(),
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
        id: nanoid(),
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

  function getOperationItems(item: CollectionItem): OperationButtonItem[] {
    const operationItems = [
      {
        id: 'rename',
        content: 'Rename',
        props: {
          className: 'text-sm',
          onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
            node.edit();
          },
        },
      },
      {
        id: 'duplicate',
        content: 'Duplicate',
        props: {
          className: 'text-sm',
          onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
            try {
              cloneCollectionItem(item.id);
            } catch (error) {
              if (error instanceof Error) {
                toast.error(error?.message);
              }
            }
          },
        },
      },
      {
        id: 'delete',
        content: 'Delete',
        props: {
          className: 'text-red-500 text-sm hover:bg-red-500! hover:text-white!',
          onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
            confirmDialog({
              header: `Delete "${item.name}"`,
              message: `Are you sure you want to delete "${item.name}"?`,
              primaryLabel: 'Delete',
              onPrimaryAction: () => {
                deleteCollectionItem(item.id);
              },
            });
          },
        },
      },
    ];
    if (item.collectionItemType === COLLECTION_TYPE.COLLECTION || item.collectionItemType === COLLECTION_TYPE.FOLDER) {
      return [
        {
          id: 'add_request',
          content: 'Add Request',
          props: {
            className: 'text-sm',
            onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              e.stopPropagation();
              setAddRequestDialogOpen(true);
            },
          },
        },
        {
          id: 'add_folder',
          content: 'Add Folder',
          props: {
            className: 'text-sm',
            onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              e.stopPropagation();
              setAddFolderDialogOpen(true);
            },
          },
          separatorBottom: true,
        },
        ...operationItems,
      ];
    }
    return operationItems;
  }

  return (
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
      <div ref={dragHandle} style={style} className="flex items-center justify-between">
        <div className="flex items-center w-full h-7 text-sm gap-1 px-2 py-1">
          {!node.isLeaf && (
            <ChevronRight
              id="chevron-icon"
              size={16}
              className={`${node.isOpen ? 'rotate-90' : ''} w-5! h-5! p-0.5 hover:bg-secondary! rounded-md`}
              aria-label="toggle"
              onClick={(e) => {
                e.stopPropagation();
                node.toggle();
              }}
            />
          )}

          <div
            className="flex items-center gap-2 flex-1 w-20! data-[active=true]:bg-transparent [&:hover>#operations-trigger]:block [&>#operations-trigger[data-state=open]]:inline-block focus-visible:outline-none focus-visible:ring-0"
            key={item.id}
            onClick={() => {
              openTab(item);
            }}
          >
            <CollectionItemIcon size={14} collectionType={item.collectionItemType} />
            <InlineEditText
              value={item.name}
              editing={node.isEditing}
              onComplete={(value) => {
                updateCollectionItem({ ...item, name: value }, { persist: true });
                node.reset();
              }}
            />
            <OperationsButton items={getOperationItems(item)} />
          </div>
        </div>
      </div>
    </>
  );
}

function CollectionSidebarItem(props: RowRendererProps<CollectionItem>) {
  const { node, innerRef, attrs, children } = props;
  const { activeTab } = useActiveItem();

  return (
    <div
      onKeyDown={(e) => {
        // Prevent space and enter from expanding/collapsing
        if (e.key === ' ' || e.key === 'Enter') {
          e.stopPropagation();
        }
      }}
      {...attrs}
      ref={innerRef}
      className={`${activeTab?.id === node.data.id && 'bg-sidebar-accent'} h-7! cursor-pointer rounded-md hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-0`}
    >
      {children}
    </div>
  );
}

export default function CollectionSidebar() {
  const [tree, setTree] = useState<TreeApi<CollectionItem> | null | undefined>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const [count, setCount] = useState(0);

  const collectionItemMap = useWorkspaceCollectionItemMap();

  const updateCount = useEffectEvent((c: number) => {
    setCount(c);
  });

  useEffect(() => {
    updateCount(tree?.visibleNodes.length ?? 0);
  }, [tree, collectionItemMap, debouncedSearch]);

  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);

  const roots = useMemo(() => {
    if (!collectionItemMap || collectionItemMap.size === 0) {
      return [];
    }

    return Array.from(collectionItemMap.values()).filter(
      (item) => item.collectionItemType === COLLECTION_TYPE.COLLECTION
    );
  }, [collectionItemMap]);
  const childrenAccessor = useCallback(
    (nodeData: CollectionItem) => {
      if (!hasChildren(nodeData)) return null;

      if (!nodeData.children || nodeData.children.length === 0) return null;

      return nodeData.children.map((childId) => collectionItemMap.get(childId)).filter(Boolean) as CollectionItem[];
    },
    [collectionItemMap]
  );

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

  async function onAddSubmit(values: { name: string }) {
    if (!activeWorkspaceId) {
      return;
    }
    try {
      const collectionPayload: Collection = {
        id: nanoid(),
        name: values.name,
        workspaceId: activeWorkspaceId,
        ...COLLECTION_DEFAULT_VALUES,
      };
      const newCollection = await saveCollectionItem(collectionPayload);
      openTab(newCollection);
      setAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to submit collection:', error);
      toast.error('Failed to submit collection.');
    }
  }

  const { ref, height } = useResizeObserver();

  return (
    <SidebarContent className="h-full">
      <SidebarHeader className="m-0! p-0!">
        <div className="flex items-center justify-between p-1 gap-1">
          {addDialogOpen && (
            <AddItemDialog
              title="Create Collection"
              inputLabel="Collection Name"
              inputRequiredLabel="Collection name is required."
              inputPlaceholder="Enter a collection name"
              defaultValue="New Collection"
              open={addDialogOpen}
              onOpenChange={(open) => setAddDialogOpen(open)}
              onSubmit={onAddSubmit}
            />
          )}
          <Button size="sm" variant="ghost" onClick={() => setAddDialogOpen(true)}>
            <Plus size={16} />
          </Button>
          <SearchBar
            placeholder="Search collections"
            className="flex-1"
            onSearchChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </SidebarHeader>
      <SidebarGroup className="p-1! h-[calc(100%-3rem)]" ref={ref}>
        <SidebarGroupContent>
          {roots.length === 0 && <NoCollectionFound />}
          {roots.length !== 0 && count === 0 && <NoResultsFound searchTerm={debouncedSearch} />}
          <Tree<CollectionItem>
            ref={(t) => setTree(t)}
            data={roots}
            width="100%"
            height={count === 0 ? 0 : height}
            childrenAccessor={childrenAccessor}
            rowHeight={30}
            searchTerm={debouncedSearch}
            searchMatch={(node, term) => node.data.name.toLowerCase().includes(term.toLowerCase())}
            disableDrag
            disableDrop
            rowClassName="hover:bg-sidebar-accent rounded-lg"
            className="app-scroll"
            renderRow={CollectionSidebarItem}
          >
            {CollectionItemNode}
          </Tree>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
