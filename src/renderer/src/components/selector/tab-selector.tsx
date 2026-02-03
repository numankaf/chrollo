import { useEffect, useState } from 'react';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { applyTextSearch } from '@/utils/search-util';
import { confirmTabClose, getTabItem } from '@/utils/tab-util';
import { ChevronDown, X } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { COMMANDS } from '@/types/command';
import { commandBus } from '@/lib/command-bus';
import { useWorkspaceTabs } from '@/hooks/workspace/use-workspace-tabs';
import { Button } from '@/components/common/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/common/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/popover';
import TabItemContent from '@/components/tab/tab-item-content';

function TabSelector() {
  const [open, setOpen] = useState(false);
  const tabs = useWorkspaceTabs();
  const [search, setSearch] = useState('');
  const filteredTabs = applyTextSearch(tabs, search, (tab) => getTabItem(tab)!.name);
  const { activeWorkspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
    }))
  );
  const { dirtyBeforeSaveByTab, setActiveTabId } = useTabsStore(
    useShallow((state) => ({
      dirtyBeforeSaveByTab: state.dirtyBeforeSaveByTab,
      setActiveTabId: state.setActiveTabId,
    }))
  );

  useEffect(() => {
    const unsubscribeTabSearch = commandBus.on(COMMANDS.TAB_SEARCH, () => {
      setOpen(true);
      setSearch('');
    });

    return () => {
      unsubscribeTabSearch();
    };
  }, []);
  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) setSearch('');
      }}
    >
      <PopoverTrigger>
        <Button variant="ghost" size="sm">
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-70 p-0!">
        <Command shouldFilter={false}>
          <div className="border-b">
            <CommandInput value={search} onValueChange={setSearch} placeholder="Search tabs..." className="h-9" />
          </div>
          <CommandList>
            <CommandEmpty>No tabs found.</CommandEmpty>
            <CommandGroup>
              {filteredTabs?.map((tab) => (
                <CommandItem
                  key={tab.id}
                  value={tab.id}
                  className="gap-2 py-1! pr-0.5 [&:hover>span]:opacity-100"
                  onSelect={() => {
                    if (activeWorkspaceId) {
                      setActiveTabId(activeWorkspaceId, tab.id);
                    }
                    setOpen(false);
                  }}
                >
                  <div className="flex-1 truncate">
                    <TabItemContent tab={tab} />
                  </div>
                  {dirtyBeforeSaveByTab[tab.id] && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}

                  <span
                    className="opacity-0 p-1 rounded-sm hover:bg-accent! text-muted-foreground hover:text-accent-foreground dark:hover:bg-accent/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmTabClose(tab.id);
                    }}
                  >
                    <X size={12} />
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default TabSelector;
