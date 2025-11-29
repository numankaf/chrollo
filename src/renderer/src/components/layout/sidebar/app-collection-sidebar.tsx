import { useCallback, useMemo } from 'react';
import useCollectionItemStore from '@/store/collection-item-store';
import useTabsStore from '@/store/tab-store';
import { hasChildren } from '@/utils/collection-util';
import { ChevronRight, FolderOpen, GalleryVerticalEnd, Plus, Zap } from 'lucide-react';
import { Tree, type NodeRendererProps } from 'react-arborist';
import { useShallow } from 'zustand/react/shallow';

import { COLLECTION_TYPE, type CollectionItem, type CollectionType } from '@/types/collection';
import { useActiveItem } from '@/hooks/workspace/use-active-item';
import { Button } from '@/components/common/button';
import { SearchBar } from '@/components/common/search-input';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
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
  const { activeTab } = useActiveItem();

  return (
    <div ref={dragHandle} style={style} className="flex items-center justify-between">
      <SidebarMenuButton
        size="sm"
        className={`${activeTab?.id === item.id && 'gap-1 border-l-primary! bg-sidebar-accent'} border-l border-l-transparent`}
      >
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
            className="flex items-center gap-1 flex-1 w-20! data-[active=true]:bg-transparent [&:hover>#operations-trigger]:block [&>#operations-trigger[data-state=open]]:inline-block"
            key={item.id}
            onClick={() => openTab(item)}
          >
            <CollectionItemIcon type={item.collectionItemType} />
            <span className="flex-1 overflow-hidden text-nowrap text-ellipsis">{item.name}</span>
            <OperationsButton item={item} />
          </div>
        )}
      </SidebarMenuButton>
    </div>
  );
}

export default function CollectionArboristSidebar() {
  const { collectionItemMap } = useCollectionItemStore(
    useShallow((state) => ({
      collectionItemMap: state.collectionItemMap,
    }))
  );

  const roots = useMemo(
    () =>
      Array.from(collectionItemMap.values()).filter((item) => item.collectionItemType === COLLECTION_TYPE.COLLECTION),
    [collectionItemMap]
  );

  const childrenAccessor = useCallback(
    (nodeData: CollectionItem) => {
      if (!hasChildren(nodeData)) return null;

      if (!nodeData.children || nodeData.children.length === 0) return null;

      return nodeData.children.map((childId) => collectionItemMap.get(childId)).filter(Boolean) as CollectionItem[];
    },
    [collectionItemMap]
  );

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarContent className="w-(--sidebar-width-content)!">
        <SidebarHeader className="m-0! p-0!">
          <div className="flex items-center justify-between p-1 gap-1">
            <Button size="sm" variant="ghost">
              <Plus size={16} />
            </Button>
            <SearchBar placeholder="Search collections" className="flex-1" onSearchChange={() => {}} />
          </div>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Tree<CollectionItem>
                initialData={roots}
                width={'100%'}
                childrenAccessor={childrenAccessor}
                rowHeight={30}
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
