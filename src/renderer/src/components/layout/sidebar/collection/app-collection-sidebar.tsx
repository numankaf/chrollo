import { useCallback, useEffect, useEffectEvent, useMemo, useState } from 'react';
import useCollectionItemStore from '@/store/collection-item-store';
import { confirmDialog } from '@/store/confirm-dialog-store';
import useWorkspaceStore from '@/store/workspace-store';
import { getCollectionItemWithChildren, hasChildren } from '@/utils/collection-util';
import { exportAsJson } from '@/utils/download-util';
import { ChevronRight, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import {
  Tree,
  TreeApi,
  type CursorProps,
  type DragPreviewProps,
  type NodeRendererProps,
  type RowRendererProps,
} from 'react-arborist';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import {
  COLLECTION_DEFAULT_VALUES,
  COLLECTION_TREE_OPEN_STATE_KEY,
  COLLECTION_TYPE,
  FOLDER_DEFAULT_VALUES,
  REQUEST_DEFAULT_VALUES,
  type Collection,
  type CollectionItem,
  type Folder,
  type Request,
} from '@/types/collection';
import { COMMANDS } from '@/types/command';
import { commandBus } from '@/lib/command-bus';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { useTabNavigation } from '@/hooks/app/use-tab-navigation';
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

interface EmptyPlaceholder {
  id: string;
  name?: string;
  isEmptyPlaceholder: true;
  parentId: string;
  parentType: string;
}

type TreeDataItem = CollectionItem | EmptyPlaceholder;

function CollectionItemNode({ node, style, dragHandle }: NodeRendererProps<TreeDataItem>) {
  const item = node.data;

  const { openTab, closeTab } = useTabNavigation();

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
  const { activeTab } = useActiveItem();
  const [addFolderDialogOpen, setAddFolderDialogOpen] = useState<boolean>(false);
  const [addRequestDialogOpen, setAddRequestDialogOpen] = useState<boolean>(false);
  const [operationsMenuOpen, setOperationsMenuOpen] = useState<boolean>(false);
  const collectionItemMap = useWorkspaceCollectionItemMap();

  useEffect(() => {
    if (!item || 'isEmptyPlaceholder' in item) return;

    const unsubscribeItemRename = commandBus.on(COMMANDS.ITEM_RENAME, () => {
      if (activeTab?.id !== item.id) return;
      node.edit();
    });

    const unsubscribeItemDuplicate = commandBus.on(COMMANDS.ITEM_DUPLICATE, async () => {
      if (activeTab?.id !== item.id) return;
      const clonedCollectionItem = await cloneCollectionItem(item.id);
      openTab(clonedCollectionItem);
    });

    const unsubscribeItemDelete = commandBus.on(COMMANDS.ITEM_DELETE, () => {
      if (activeTab?.id !== item.id) return;
      confirmDialog({
        header: `Delete "${item.name}"`,
        message: `Are you sure you want to delete "${item.name}"?`,
        primaryLabel: 'Delete',
        onPrimaryAction: async () => {
          const deletedCollectionItemIds = await deleteCollectionItem(item.id);
          for (const deletedId of deletedCollectionItemIds) {
            closeTab(deletedId);
          }
        },
      });
    });

    return () => {
      unsubscribeItemRename?.();
      unsubscribeItemDuplicate?.();
      unsubscribeItemDelete?.();
    };
  }, [item, cloneCollectionItem, deleteCollectionItem, node, activeTab, openTab, closeTab]);

  if (!item) return null;

  if ('isEmptyPlaceholder' in item) {
    const isCollection = item.parentType === COLLECTION_TYPE.COLLECTION;
    return (
      <div
        style={style}
        className="flex items-center h-full ml-8 text-sm text-muted-foreground select-none pointer-events-none"
      >
        This {isCollection ? 'collection' : 'folder'} is empty.
      </div>
    );
  }

  async function onAddFolderSubmit(values: { name: string }) {
    if (!activeWorkspaceId || !('id' in item)) {
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
    } catch {
      toast.error('Failed to submit collection.');
    }
  }

  async function onAddRequestSubmit(values: { name: string }) {
    if (!activeWorkspaceId || !('id' in item)) {
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
    } catch {
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
          onClick: async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
            try {
              const clonedCollectionItem = await cloneCollectionItem(item.id);
              openTab(clonedCollectionItem);
            } catch (error) {
              if (error instanceof Error) {
                toast.error(error?.message);
              }
            }
          },
        },
      },
      {
        id: 'export',
        content: 'Export',
        props: {
          className: 'text-sm',
          onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
            const data = getCollectionItemWithChildren(collectionItemMap, item.id);
            if (data) {
              exportAsJson(data, item.name);
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
              onPrimaryAction: async () => {
                const deletedCollectionItemIds = await deleteCollectionItem(item.id);
                for (const deletedId of deletedCollectionItemIds) {
                  closeTab(deletedId);
                }
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

  const collectionItem = item as CollectionItem;

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
      <div ref={dragHandle} style={style} className="flex items-center justify-between group">
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
            className="flex items-center gap-2 flex-1 w-20! data-[active=true]:bg-transparent [&:hover>.operations-trigger]:block [&>.operations-trigger[data-state=open]]:inline-block focus-visible:outline-none focus-visible:ring-0"
            key={collectionItem.id}
            onContextMenu={(e) => {
              e.preventDefault();
              setOperationsMenuOpen(true);
            }}
          >
            <CollectionItemIcon size={14} collectionType={collectionItem.collectionItemType} />
            <InlineEditText
              value={collectionItem.name}
              editing={node.isEditing}
              onComplete={(value) => {
                updateCollectionItem({ ...collectionItem, name: value }, { persist: true });
                node.reset();
              }}
            />
            <OperationsButton
              open={operationsMenuOpen}
              onOpenChange={setOperationsMenuOpen}
              items={getOperationItems(collectionItem)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function CollectionDragPreview({ mouse, dragIds }: DragPreviewProps) {
  const collectionItemMap = useWorkspaceCollectionItemMap();
  const draggedItemId = dragIds[0];
  const draggedItem = draggedItemId ? collectionItemMap.get(draggedItemId) : null;

  if (!mouse || !draggedItem) return null;

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 bg-sidebar-accent border border-sidebar-border rounded shadow-lg pointer-events-none opacity-80"
      style={{
        position: 'fixed',
        left: mouse.x + 10,
        top: mouse.y + 10,
        zIndex: 1000,
      }}
    >
      <CollectionItemIcon size={14} collectionType={draggedItem.collectionItemType} />
      <span className="text-sm truncate max-w-40">{draggedItem.name}</span>
    </div>
  );
}

function CollectionTreeCursor({ top }: CursorProps) {
  return (
    <div
      className="absolute h-0.5 bg-primary rounded-full z-50 pointer-events-none"
      style={{
        top: top - 1,
        left: 0,
        right: 0,
      }}
    />
  );
}

function CollectionSidebarItem(props: RowRendererProps<TreeDataItem>) {
  const { node, innerRef, attrs, children } = props;
  const { activeTab } = useActiveItem();
  const { openTab } = useTabNavigation();
  const collectionItem = node.data as CollectionItem;

  const isEmptyPlaceholder = node.data && 'isEmptyPlaceholder' in node.data;
  const isActive = !isEmptyPlaceholder && activeTab?.id === node.data?.id;

  return (
    <div
      onClick={() => {
        openTab(collectionItem);
      }}
      {...attrs}
      ref={innerRef}
      className={`${isActive ? 'bg-sidebar-accent' : ''} ${
        isEmptyPlaceholder ? 'cursor-default' : 'cursor-pointer hover:bg-sidebar-accent'
      } h-7! rounded-md focus-visible:outline-none focus-visible:ring-0`}
    >
      {children}
    </div>
  );
}

export default function CollectionSidebar() {
  const [tree, setTree] = useState<TreeApi<TreeDataItem> | null | undefined>(null);
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
    ) as TreeDataItem[];
  }, [collectionItemMap]);

  const childrenAccessor = useCallback(
    (nodeData: TreeDataItem) => {
      if (!nodeData) return null;

      if ('isEmptyPlaceholder' in nodeData) return null;

      if (!hasChildren(nodeData)) return null;

      const childrenIds = nodeData.children ?? [];
      const children = childrenIds.map((childId) => collectionItemMap.get(childId)).filter(Boolean) as CollectionItem[];

      if (children.length === 0) {
        return [
          {
            id: `${nodeData.id}-empty`,
            isEmptyPlaceholder: true,
            parentId: nodeData.id,
            parentType: nodeData.collectionItemType,
          } as EmptyPlaceholder,
        ];
      }

      return children;
    },
    [collectionItemMap]
  );

  const { activeWorkspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
    }))
  );
  const { openTab } = useTabNavigation();
  const { saveCollectionItem, moveCollectionItem } = useCollectionItemStore(
    useShallow((state) => ({
      saveCollectionItem: state.saveCollectionItem,
      moveCollectionItem: state.moveCollectionItem,
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
    } catch {
      toast.error('Failed to submit collection.');
    }
  }

  const { ref, height } = useResizeObserver();

  const initialOpenState = useMemo(() => {
    try {
      const saved = localStorage.getItem(COLLECTION_TREE_OPEN_STATE_KEY);
      return saved ? (JSON.parse(saved) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  }, []);

  const onToggle = (id: string) => {
    if (search) return;

    const node = tree?.get(id);
    if (!node) return;

    const isOpen = node.isOpen;
    const saved = localStorage.getItem(COLLECTION_TREE_OPEN_STATE_KEY);
    const openMap = saved ? (JSON.parse(saved) as Record<string, boolean>) : {};
    openMap[id] = isOpen;

    localStorage.setItem(COLLECTION_TREE_OPEN_STATE_KEY, JSON.stringify(openMap));
  };

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
          <Tree<TreeDataItem>
            ref={(t) => setTree(t)}
            data={roots}
            width="100%"
            height={count === 0 ? 0 : height}
            childrenAccessor={childrenAccessor}
            rowHeight={30}
            onMove={({ dragIds, parentId, index }) => {
              dragIds.forEach((id) => moveCollectionItem(id, parentId, index));
            }}
            searchTerm={debouncedSearch}
            searchMatch={(node, term) => {
              if (!node.data || 'isEmptyPlaceholder' in node.data) return false;
              const collectionItem = node.data as CollectionItem;
              return collectionItem.name?.toLowerCase().includes(term.toLowerCase()) ?? false;
            }}
            rowClassName="hover:bg-sidebar-accent rounded-lg"
            className="app-scroll"
            renderDragPreview={CollectionDragPreview}
            renderCursor={CollectionTreeCursor}
            disableDrag={(data) =>
              !data ||
              'isEmptyPlaceholder' in data ||
              (data as CollectionItem).collectionItemType === COLLECTION_TYPE.COLLECTION
            }
            disableDrop={({ parentNode }) =>
              !parentNode ||
              !parentNode.data ||
              'isEmptyPlaceholder' in parentNode.data ||
              ((parentNode.data as CollectionItem).collectionItemType !== COLLECTION_TYPE.FOLDER &&
                (parentNode.data as CollectionItem).collectionItemType !== COLLECTION_TYPE.COLLECTION)
            }
            renderRow={CollectionSidebarItem}
            initialOpenState={initialOpenState}
            onToggle={onToggle}
          >
            {CollectionItemNode}
          </Tree>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
