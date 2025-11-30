import { useCallback, useMemo, useState } from 'react';
import { AddItemDialog } from '@/features/connections/components/common/add-item-dialog';
import useCollectionItemStore from '@/store/collection-item-store';
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
  type Collection,
  type CollectionItem,
  type CollectionType,
} from '@/types/collection';
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
  SidebarMenu,
  SidebarRail,
} from '@/components/common/sidebar';
import OperationsButton from '@/components/app/operations-button';

function CollectionItemIcon({ type }: { type: CollectionType }) {
  switch (type) {
    case COLLECTION_TYPE.COLLECTION:
      return <GalleryVerticalEnd size={16} />;
    case COLLECTION_TYPE.FOLDER:
      return <FolderOpen size={16} />;
    case COLLECTION_TYPE.REQUEST:
      return <Zap size={16} color="var(--color-green-500)" />;
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

  return (
    <div ref={dragHandle} style={style} className="flex items-center justify-between">
      <div className="flex items-center w-full h-8 text-sm gap-2 px-2 py-1">
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
            onKeyDown={(e) => {
              if (e.key === 'Escape') node.reset();
              if (e.key === 'Enter') node.submit((e.currentTarget as HTMLInputElement).value);
            }}
          />
        ) : (
          <div
            className="flex items-center gap-2 flex-1 w-20! data-[active=true]:bg-transparent [&:hover>#operations-trigger]:block [&>#operations-trigger[data-state=open]]:inline-block"
            key={item.id}
            onClick={() => openTab(item)}
          >
            <CollectionItemIcon type={item.collectionItemType} />
            <span className="flex-1 overflow-hidden text-nowrap text-ellipsis">{item.name}</span>
            <OperationsButton item={item} />
          </div>
        )}
      </div>
    </div>
  );
}

function CollectionSidebarItem(props: RowRendererProps<CollectionItem>) {
  const { node, innerRef, attrs, children } = props;
  const { activeTab } = useActiveItem();

  return (
    <div
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

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Tree<CollectionItem>
                data={roots}
                width="100%"
                childrenAccessor={childrenAccessor}
                rowHeight={30}
                searchTerm={search}
                searchMatch={(node, term) => node.data.name.toLowerCase().includes(term.toLowerCase())}
                disableDrag
                disableDrop
                rowClassName="hover:bg-sidebar-accent rounded-lg"
                renderRow={CollectionSidebarItem}
              >
                {CollectionItemNode}
              </Tree>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
