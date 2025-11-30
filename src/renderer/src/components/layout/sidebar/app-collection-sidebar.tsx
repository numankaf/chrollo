import { useCallback, useMemo, useState } from 'react';
import useCollectionItemStore from '@/store/collection-item-store';
import { confirmDialog } from '@/store/confirm-dialog-store';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { hasChildren } from '@/utils/collection-util';
import { ChevronRight, FolderOpen, GalleryVerticalEnd, Plus, Zap } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Tree, type NodeRendererProps, type RowRendererProps } from 'react-arborist';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import {
  COLLECTION_DEFAULT_VALUES,
  COLLECTION_TYPE,
  FOLDER_DEFAULT_VALUES,
  REQUEST_DEFAULT_VALUES,
  type Collection,
  type CollectionItem,
  type CollectionType,
  type Folder,
  type Request,
} from '@/types/collection';
import { useResizeObserver } from '@/hooks/use-resize-observer';
import { useActiveItem } from '@/hooks/workspace/use-active-item';
import { useWorkspaceCollectionItemMap } from '@/hooks/workspace/use-workspace-collection-item-map';
import { Button } from '@/components/common/button';
import { SearchBar } from '@/components/common/search-input';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/common/sidebar';
import { AddItemDialog } from '@/components/app/add-item-dialog';
import OperationsButton, { type OperationButtonItem } from '@/components/app/operations-button';

function CollectionItemIcon({ type }: { type: CollectionType }) {
  switch (type) {
    case COLLECTION_TYPE.COLLECTION:
      return <GalleryVerticalEnd size={14} />;
    case COLLECTION_TYPE.FOLDER:
      return <FolderOpen size={14} />;
    case COLLECTION_TYPE.REQUEST:
      return <Zap size={14} color="var(--color-green-500)" />;
    default:
      return '';
  }
}

function CollectionItemNode({ node, style, dragHandle }: NodeRendererProps<CollectionItem>) {
  const item = node.data;
  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );
  const { saveCollectionItem, deleteCollectionItem } = useCollectionItemStore(
    useShallow((state) => ({
      deleteCollectionItem: state.deleteCollectionItem,
      saveCollectionItem: state.saveCollectionItem,
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

  function getOperationItems(item: CollectionItem): OperationButtonItem[] {
    const operationItems = [
      {
        id: 'rename',
        content: 'Rename',
        props: { className: 'text-sm' },
      },
      {
        id: 'duplicate',
        content: 'Duplicate',
        props: { className: 'text-sm' },
      },
      {
        id: 'delete',
        content: 'Delete',
        props: {
          className: 'text-red-500 text-sm hover:bg-red-500! hover:text-white!',
          onClick: (e) => {
            e.stopPropagation();
            confirmDialog({
              header: `Delete "${item.name}"`,
              message: `Are you sure you want to delete "${item.name}"?`,
              actionLabel: 'Delete',
              accept: async () => {
                await deleteCollectionItem(item.id);
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
            onClick: (e) => {
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
            onClick: (e) => {
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
          {node.isEditing ? (
            <input
              autoFocus
              defaultValue={item.name}
              className="w-full bg-transparent border-none outline-none"
              onBlur={() => node.reset()}
              // onKeyDown={(e) => {
              //   if (e.key === 'Escape') node.reset();
              //   if (e.key === 'Enter') node.submit((e.currentTarget as HTMLInputElement).value);
              // }}
            />
          ) : (
            <div
              className="flex items-center gap-2 flex-1 w-20! data-[active=true]:bg-transparent [&:hover>#operations-trigger]:block [&>#operations-trigger[data-state=open]]:inline-block"
              key={item.id}
              onClick={() => openTab(item)}
            >
              <CollectionItemIcon type={item.collectionItemType} />
              <span className="flex-1 overflow-hidden text-nowrap text-ellipsis">{item.name}</span>
              <OperationsButton items={getOperationItems(item)} />
            </div>
          )}
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
      className={`${activeTab?.id === node.data.id && 'gap-1 border-l-primary! bg-sidebar-accent'} h-7! cursor-pointer border-l border-l-transparent rounded-md hover:bg-sidebar-accent`}
    >
      {children}
    </div>
  );
}

export default function CollectionSidebar() {
  const [search, setSearch] = useState<string>('');
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);

  const collectionItemMap = useWorkspaceCollectionItemMap();
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
        id: nanoid(8),
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
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarContent className="w-(--sidebar-width-content)!">
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
        <SidebarGroup
          className="p-1! h-[calc(100%-3rem)] scrollbar-thin scrollbar-thumb-sidebar-accent scrollbar-track-transparent"
          ref={ref}
        >
          <SidebarGroupContent>
            <Tree<CollectionItem>
              data={roots}
              width="100%"
              height={height}
              childrenAccessor={childrenAccessor}
              rowHeight={30}
              searchTerm={search}
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
      <SidebarRail />
    </Sidebar>
  );
}
