import useCollectionItemStore from '@/store/collection-item-store';
import useTabsStore from '@/store/tab-store';
import { hasChildren } from '@/utils/collection-util';
import { ChevronRight, Ellipsis, FolderOpen, GalleryVerticalEnd, Plus, Zap } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { COLLECTION_TYPE, type CollectionItem } from '@/types/collection';
import { Button } from '@/components/common/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/common/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';
import { SearchBar } from '@/components/common/search-input';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from '@/components/common/sidebar';

function OperationsButton({ item }: { item: CollectionItem }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="opacity-0 transition-opacity">
        <div className="cursor-pointer hover:text-primary hover:bg-transparent!" id="operations-trigger">
          <Ellipsis size={16} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="bg-background w-40">
        {(item.collectionItemType === COLLECTION_TYPE.COLLECTION ||
          item.collectionItemType === COLLECTION_TYPE.FOLDER) && (
          <>
            <DropdownMenuItem className="text-sm" onClick={(e) => e.preventDefault()}>
              Add Request
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm" onClick={(e) => e.preventDefault()}>
              Add Folder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem className="text-sm" onClick={(e) => e.preventDefault()}>
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-sm" onClick={(e) => e.preventDefault()}>
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm" onClick={(e) => e.preventDefault()}>
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-500 text-sm hover:bg-red-500! hover:text-white!"
          onClick={(e) => e.preventDefault()}
        >
          Delete
        </DropdownMenuItem>
        {item.collectionItemType === COLLECTION_TYPE.COLLECTION && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm">Export</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Tree({ item }: { item: CollectionItem }) {
  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );
  const { collectionItemMap } = useCollectionItemStore(
    useShallow((state) => ({
      collectionItemMap: state.collectionItemMap,
    }))
  );

  const children = hasChildren(item)
    ? ((item.children || []).map((childId) => collectionItemMap.get(childId)).filter(Boolean) as CollectionItem[])
    : [];

  const itemHasChildren = children.length > 0;

  if (!itemHasChildren) {
    return (
      <SidebarMenuButton
        size="sm"
        asChild
        className="data-[active=true]:bg-transparent flex items-center justify-between [&:hover>#operations-trigger]:opacity-100 [&>#operations-trigger[data-state=open]]:opacity-100"
        onClick={(e) => {
          e.preventDefault();
          if (item.collectionItemType === COLLECTION_TYPE.REQUEST) openTab(item);
        }}
      >
        <div className="flex items-center justify-center gap-1">
          {item.collectionItemType === COLLECTION_TYPE.FOLDER && <FolderOpen size={16} />}
          {item.collectionItemType === COLLECTION_TYPE.REQUEST && <Zap size={16} color="var(--color-green-500)" />}
          <span>{item.name}</span>
        </div>
        <OperationsButton item={item} />
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem className="p-0!">
      <Collapsible className="group/collapsible [&[data-state=open]>button>div>#chevron-icon:first-child]:rotate-90">
        <SidebarMenuButton
          size="sm"
          className="flex items-center justify-between [&:hover>#operations-trigger]:opacity-100 [&>#operations-trigger[data-state=open]]:opacity-100"
          onDoubleClick={(e) => {
            e.preventDefault();
            openTab(item);
          }}
        >
          <div className="flex items-center justify-center gap-1">
            <CollapsibleTrigger asChild onDoubleClick={(e) => e.preventDefault()}>
              <ChevronRight id="chevron-icon" size={16} className="mx-1 transition-transform" />
            </CollapsibleTrigger>
            {item.collectionItemType === COLLECTION_TYPE.FOLDER && <FolderOpen size={16} />}
            {item.collectionItemType === COLLECTION_TYPE.COLLECTION && <GalleryVerticalEnd size={16} />}
            <span>{item.name}</span>
          </div>
          <OperationsButton item={item} />
        </SidebarMenuButton>

        <CollapsibleContent>
          <SidebarMenuSub className="p-0! mr-0!">
            {children.map((child) => (
              <Tree key={child.id} item={child} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

function CollectionSidebar() {
  const { collectionItemMap } = useCollectionItemStore(
    useShallow((state) => ({
      collectionItemMap: state.collectionItemMap,
    }))
  );
  const roots = Array.from(collectionItemMap.values()).filter(
    (item) => item.collectionItemType === COLLECTION_TYPE.COLLECTION
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
              {roots.map((item) => (
                <Tree key={item.id} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export default CollectionSidebar;
