import { useState } from 'react';
import { applyTextSearch } from '@/utils/search-util';
import { ChevronDown, X } from 'lucide-react';

import { useTabNavigation } from '@/hooks/use-tab-navigation';
import { useWorkspaceTabs } from '@/hooks/workspace/use-workspace-tabs';
import { Button } from '@/components/common/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/popover';
import { ScrollArea } from '@/components/common/scroll-area';
import { SearchBar } from '@/components/common/search-input';
import TabItemContent from '@/components/tab/tab-item-content';

function TabSelector() {
  const tabs = useWorkspaceTabs();
  const [search, setSearch] = useState('');
  const filteredTabs = applyTextSearch(tabs, search, (tab) => tab.item.name);

  const { setActiveTabAndNavigate, closeTabAndNavigate } = useTabNavigation();
  return (
    <Popover
      onOpenChange={(open) => {
        if (open) setSearch('');
      }}
    >
      <PopoverTrigger>
        <Button variant="ghost" size="sm">
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-60 p-2!">
        <div className="flex items-center justify-between p-1 gap-1">
          <SearchBar placeholder="Search tabs" className="flex-1" onSearchChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="mt-3 space-y-1 text-sm">
          <ScrollArea>
            <div className="max-h-[300px]!">
              {filteredTabs.length === 0 && <p className="px-1 text-muted-foreground">No tabs found</p>}
              {filteredTabs?.map((tab) => (
                <Button
                  variant="ghost"
                  key={tab.id}
                  className=" w-full justify-between gap-2 pr-0.5 [&:hover>span]:opacity-100"
                  size="sm"
                  onClick={() => setActiveTabAndNavigate(tab.id)}
                >
                  <TabItemContent {...tab.item} />
                  <span
                    className="opacity-0 p-1 hover:bg-accent text-muted-foreground hover:text-accent-foreground dark:hover:bg-accent/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTabAndNavigate(tab.id);
                    }}
                  >
                    <X />
                  </span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default TabSelector;
