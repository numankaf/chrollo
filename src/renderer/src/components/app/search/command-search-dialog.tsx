import { useState } from 'react';
import useCollectionItemStore from '@/store/collection-item-store';
import useCommandSearchStore from '@/store/command-search-store';
import useWorkspaceStore from '@/store/workspace-store';
import { hasParent } from '@/utils/collection-util';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  Cable,
  ChevronDown,
  Columns3Cog,
  FolderOpen,
  LayoutDashboard,
  LibraryBig,
  Waypoints,
  X,
  Zap,
} from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { BASE_MODEL_TYPE } from '@/types/base';
import { COLLECTION_TYPE, NULL_PARENT_ID } from '@/types/collection';
import type { Connection } from '@/types/connection';
import type { Environment } from '@/types/environment';
import type { InterceptionScript } from '@/types/interception-script';
import type { Tab, TabItem } from '@/types/layout';
import { useCommandSearchData, type SearchFilterType } from '@/hooks/app/use-command-search-data';
import { useTabNavigation } from '@/hooks/app/use-tab-navigation';
import useDebouncedValue from '@/hooks/common/use-debounced-value';
import { Button } from '@/components/common/button';
import { Checkbox } from '@/components/common/checkbox';
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/common/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';
import { ScrollArea } from '@/components/common/scroll-area';
import NoRecentItemFound from '@/components/app/empty/no-recent-item-found';
import NoResultsFound from '@/components/app/empty/no-results-found';
import TabItemIcon from '@/components/icon/tab-item-icon';

const FILTER_DROPDOWN_ITEMS = [
  {
    label: 'Workspace',
    value: BASE_MODEL_TYPE.WORKSPACE,
    icon: <LayoutDashboard size={12} />,
  },
  {
    label: 'Connection',
    value: BASE_MODEL_TYPE.CONNECTION,
    icon: <Waypoints size={12} />,
  },
  {
    label: 'Collection',
    value: COLLECTION_TYPE.COLLECTION,
    icon: <LibraryBig size={12} />,
  },
  {
    label: 'Folder',
    value: COLLECTION_TYPE.FOLDER,
    icon: <FolderOpen size={12} />,
  },
  {
    label: 'Request',
    value: COLLECTION_TYPE.REQUEST,
    icon: <Zap size={12} color="var(--color-green-500)" />,
  },
  {
    label: 'Environment',
    value: BASE_MODEL_TYPE.ENVIRONMENT,
    icon: <Columns3Cog size={12} />,
  },
  {
    label: 'Interception script',
    value: BASE_MODEL_TYPE.INTERCEPTION_SCRIPT,
    icon: <Cable size={12} />,
  },
];

function CommandSearchDialog() {
  const { isOpen, setIsOpen, recentTabs, removeRecentTab } = useCommandSearchStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      setIsOpen: state.setIsOpen,
      recentTabs: state.recentTabs,
      removeRecentTab: state.removeRecentTab,
    }))
  );

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue<string>(search, 300);
  const [selectedTypes, setSelectedTypes] = useState<SearchFilterType[]>([]);

  const { filteredItems } = useCommandSearchData({
    search: debouncedSearch,
    selectedTypes,
  });

  const { openTab } = useTabNavigation();

  const { activeWorkspaceId, setActiveWorkspace } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
      setActiveWorkspace: state.setActiveWorkspace,
    }))
  );

  const { collectionItemMap } = useCollectionItemStore(
    useShallow((state) => ({ collectionItemMap: state.collectionItemMap }))
  );

  const toggleType = (type: SearchFilterType) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  const onSelect = async (item: TabItem) => {
    setIsOpen(false);

    if (item.modelType === BASE_MODEL_TYPE.WORKSPACE && item.id !== activeWorkspaceId) {
      await setActiveWorkspace(item.id);
    } else {
      const workspaceId = (item as Connection | Environment | InterceptionScript).workspaceId;
      if (workspaceId && workspaceId !== activeWorkspaceId) {
        await setActiveWorkspace(workspaceId);
      }
    }
    openTab(item as Tab);
  };

  const [parentElement, setParentElement] = useState<HTMLDivElement | null>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => parentElement,
    estimateSize: () => 40,
    overscan: 12,
  });

  const virtualItems = virtualizer.getVirtualItems();

  const getSubtitle = (item: TabItem) => {
    if (item.modelType === BASE_MODEL_TYPE.COLLECTION) {
      const parts: string[] = [];
      let currentId = item.id;
      let depth = 0;
      while (currentId && depth < 10) {
        const currentItem = collectionItemMap.get(currentId);
        if (!currentItem) break;
        parts.unshift(currentItem.name);
        if (hasParent(currentItem) && currentItem.parentId && currentItem.parentId !== NULL_PARENT_ID) {
          currentId = currentItem.parentId;
        } else {
          break;
        }
        depth++;
      }
      return parts.join(' / ');
    }
    return '';
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen} className="max-w-[60vw]! top-12 translate-y-0">
      <Command shouldFilter={false}>
        <div className="flex items-center gap-3 border-b  h-12 pr-12">
          <div className="flex-1">
            <CommandInput placeholder="Search Chrollo..." value={search} onValueChange={setSearch} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 px-3 border-muted-foreground/20 hover:bg-accent/50">
                {selectedTypes.length === 0 ? 'All types' : `${selectedTypes.length} selected`}
                <ChevronDown className="ml-2 size-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {FILTER_DROPDOWN_ITEMS.map((item) => (
                <DropdownMenuItem
                  key={item.value}
                  className="flex items-center gap-2 cursor-pointer h-7! text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleType(item.value);
                  }}
                >
                  <Checkbox checked={selectedTypes.includes(item.value)} className="pointer-events-none" />
                  {item.icon}
                  <span>{item.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {!debouncedSearch.trim() && selectedTypes.length === 0 && (
          <span className="px-3 pt-1  text-muted-foreground text-sem">Recently Viewed</span>
        )}
        {filteredItems.length === 0 && (debouncedSearch.trim() || selectedTypes.length > 0) && (
          <NoResultsFound searchTerm={debouncedSearch} />
        )}
        {filteredItems.length === 0 && !debouncedSearch.trim() && selectedTypes.length === 0 && <NoRecentItemFound />}
        <CommandList className="max-h-[60vh] overflow-hidden">
          <ScrollArea viewportRef={setParentElement} className="h-full p-2">
            <div
              className="relative w-full"
              style={{ maxHeight: 'calc(60vh - 1rem)', height: `${virtualizer.getTotalSize()}px` }}
            >
              <CommandGroup>
                <div
                  className="absolute top-0 left-0 w-full px-1"
                  style={{
                    transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
                  }}
                >
                  {virtualItems.map((virtualRow) => {
                    const item = filteredItems[virtualRow.index];
                    if (!item) return null;
                    const isRecent = recentTabs.some((t) => t.id === item.id);
                    return (
                      <div key={item.id} data-index={virtualRow.index} ref={virtualizer.measureElement}>
                        <CommandItem
                          key={item.id}
                          value={item.id}
                          onSelect={() => onSelect(item)}
                          className="gap-3 h-10 cursor-pointer group"
                        >
                          <TabItemIcon item={item} size={16} className="shrink-0" />
                          <div className="flex flex-col flex-1 overflow-hidden pointer-events-none">
                            <span className="truncate">{item.name}</span>
                            <span className="text-xs text-muted-foreground truncate">{getSubtitle(item)}</span>
                          </div>
                          {!search.trim() && selectedTypes.length === 0 && isRecent && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeRecentTab(item.id);
                              }}
                            >
                              <X className="size-3" />
                            </Button>
                          )}
                        </CommandItem>
                      </div>
                    );
                  })}
                </div>
              </CommandGroup>
            </div>
          </ScrollArea>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

export default CommandSearchDialog;
