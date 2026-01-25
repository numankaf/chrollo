import { useEffect, useMemo, useRef, useState } from 'react';
import useCollectionItemStore from '@/store/collection-item-store';
import useConnectionStore from '@/store/connection-store';
import useEnvironmentStore from '@/store/environment-store';
import useGlobalSearchStore from '@/store/global-search-store';
import useInterceptionScriptStore from '@/store/interception-script-store';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { hasParent } from '@/utils/collection-util';
import { applyTextSearch } from '@/utils/search-util';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Cable, ChevronDown, Columns3Cog, LayoutDashboard, LibraryBig, Waypoints } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { BASE_MODEL_TYPE, type BaseModelType } from '@/types/base';
import { NULL_PARENT_ID, type CollectionItem } from '@/types/collection';
import { COMMANDS } from '@/types/command';
import type { Connection } from '@/types/connection';
import type { Environment } from '@/types/environment';
import type { InterceptionScript } from '@/types/interception-script';
import type { Tab, TabItem } from '@/types/layout';
import { commandBus } from '@/lib/command-bus';
import useDebouncedValue from '@/hooks/common/use-debounced-value';
import { Button } from '@/components/common/button';
import { Checkbox } from '@/components/common/checkbox';
import { CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/common/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';
import { ScrollArea } from '@/components/common/scroll-area';
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
    value: BASE_MODEL_TYPE.COLLECTION,
    icon: <LibraryBig size={12} />,
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

export function GlobalSearch() {
  const navigate = useNavigate();
  const { isOpen, setIsOpen, recentTabs } = useGlobalSearchStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      setIsOpen: state.setIsOpen,
      recentTabs: state.recentTabs,
    }))
  );

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue<string>(search, 300);
  const [selectedTypes, setSelectedTypes] = useState<BaseModelType[]>([]);

  const openTab = useTabsStore((state) => state.openTab);

  const { activeWorkspaceId, setActiveWorkspace, workspaces } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
      setActiveWorkspace: state.setActiveWorkspace,
      workspaces: state.workspaces,
    }))
  );
  const { connections } = useConnectionStore(useShallow((state) => ({ connections: state.connections })));
  const { collectionItemMap } = useCollectionItemStore(
    useShallow((state) => ({ collectionItemMap: state.collectionItemMap }))
  );
  const { environments } = useEnvironmentStore(useShallow((state) => ({ environments: state.environments })));
  const { interceptionScripts } = useInterceptionScriptStore(
    useShallow((state) => ({ interceptionScripts: state.interceptionScripts }))
  );

  useEffect(() => {
    const unsubscribeGlobalSearch = commandBus.on(COMMANDS.GLOBAL_SEARCH, () => {
      setIsOpen(!isOpen);
    });
    return () => {
      unsubscribeGlobalSearch();
    };
  }, [isOpen, setIsOpen]);

  const toggleType = (type: BaseModelType) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  // Combine all items
  const allItems = useMemo(() => {
    const items: TabItem[] = [
      ...workspaces.map((w) => ({ ...w, modelType: BASE_MODEL_TYPE.WORKSPACE as 'WORKSPACE' })),
      ...connections.map((c) => ({ ...c, modelType: BASE_MODEL_TYPE.CONNECTION as 'CONNECTION' })),
      ...Array.from(collectionItemMap.values()).map((c) => ({
        ...c,
        modelType: BASE_MODEL_TYPE.COLLECTION as 'COLLECTION',
      })),
      ...environments.map((e) => ({ ...e, modelType: BASE_MODEL_TYPE.ENVIRONMENT as 'ENVIRONMENT' })),
      ...interceptionScripts.map((s) => ({
        ...s,
        modelType: BASE_MODEL_TYPE.INTERCEPTION_SCRIPT as 'INTERCEPTION_SCRIPT',
      })),
    ];
    return items;
  }, [workspaces, connections, collectionItemMap, environments, interceptionScripts]);

  // Filter based on selected types and search
  const filteredAndSearchedItems = useMemo(() => {
    let base = allItems;
    if (selectedTypes.length > 0) {
      base = base.filter((item) => selectedTypes.includes(item.modelType));
    }

    if (!debouncedSearch.trim()) {
      // If no search, show recent items (filtered by type if applicable)
      const recentIds = recentTabs.map((ri) => ri.id);
      return base
        .filter((item) => recentIds.includes(item.id))
        .sort((a, b) => {
          const riA = recentTabs.find((ri) => ri.id === a.id);
          const riB = recentTabs.find((ri) => ri.id === b.id);
          return (riB?.timestamp ?? 0) - (riA?.timestamp ?? 0);
        });
    }

    return applyTextSearch(base, debouncedSearch, (item) => item.name);
  }, [allItems, selectedTypes, debouncedSearch, recentTabs]);

  const onSelect = async (item: TabItem) => {
    setIsOpen(false);
    setSearch('');

    if (item.modelType === BASE_MODEL_TYPE.WORKSPACE) {
      await setActiveWorkspace(item.id);
      navigate('/main/workspace/' + item.id);
    } else {
      const workspaceId = (item as Connection | CollectionItem | Environment | InterceptionScript).workspaceId;
      if (workspaceId && workspaceId !== activeWorkspaceId) {
        await setActiveWorkspace(workspaceId);
      }
      openTab(item as Tab);
    }
  };

  const parentRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: filteredAndSearchedItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 10,
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
      <div className="flex items-center gap-3 border-b h-12 pr-12">
        <div className="flex-1">
          <CommandInput placeholder="Search everything..." value={search} onValueChange={setSearch} />
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
                <Checkbox
                  checked={selectedTypes.includes(item.value as BaseModelType)}
                  className="pointer-events-none"
                />
                {item.icon}
                <span>{item.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandList className="max-h-[400px] overflow-hidden">
        <ScrollArea viewportRef={parentRef} className="h-[400px]">
          <div className="relative w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
            {filteredAndSearchedItems.length === 0 && (search.trim() || selectedTypes.length > 0) && (
              <div className="py-12 text-center text-sm text-muted-foreground animate-in fade-in duration-200">
                No results found.
              </div>
            )}

            {filteredAndSearchedItems.length === 0 && !search.trim() && selectedTypes.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Your recently viewed items will appear here.
              </div>
            )}

            <CommandGroup heading={search.trim() ? 'Search Results' : 'Recently Viewed'}>
              <div
                className="absolute top-0 left-0 w-full px-2"
                style={{
                  transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
                }}
              >
                <div className="relative top-8">
                  {virtualItems.map((virtualRow) => {
                    const item = filteredAndSearchedItems[virtualRow.index];
                    return (
                      <div key={item.id} data-index={virtualRow.index} ref={virtualizer.measureElement}>
                        <CommandItem onSelect={() => onSelect(item)} className="gap-3 h-10 cursor-pointer">
                          <TabItemIcon item={item} size={16} className="shrink-0" />
                          <div className="flex flex-col flex-1 overflow-hidden pointer-events-none">
                            <span className="truncate">{item.name}</span>
                            <span className="text-xs text-muted-foreground truncate">{getSubtitle(item)}</span>
                          </div>
                        </CommandItem>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CommandGroup>
          </div>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
}
