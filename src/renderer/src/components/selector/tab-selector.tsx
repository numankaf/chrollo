import { Button } from '@/components/common/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/popover';
import { ScrollArea } from '@/components/common/scroll-area';
import { SearchBar } from '@/components/common/search-input';
import TabItemContent from '@/components/tab/tab-item-content';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useTabNavigation } from '../../hooks/use-tab-navigation';
import useTabsStore from '../../store/tab-store';
import { applyTextSearch } from '../../utils/search-util';

const TabSelector = () => {
  const { tabs } = useTabsStore(
    useShallow((state) => ({
      tabs: state.tabs,
    }))
  );
  const [search, setSearch] = useState('');
  const filteredTabs = applyTextSearch(tabs, search, (tab) => tab.item.name);

  const { setActiveTabAndNavigate } = useTabNavigation();
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
      <PopoverContent align="end" className="w-[240px] p-2!">
        <div className="flex items-center justify-between p-1 gap-1">
          <SearchBar placeholder="Search tabs" className="flex-1" onSearchChange={(value) => setSearch(value)} />
        </div>
        <div className="mt-3 space-y-1 text-xs">
          <ScrollArea>
            <div className="max-h-[300px]!">
              {filteredTabs.length === 0 && <p className="px-1 text-muted-foreground">No tabs found</p>}
              {filteredTabs?.map((tab) => (
                <Button
                  variant="ghost"
                  key={tab.id}
                  className=" w-full justify-start gap-2"
                  size="sm"
                  onClick={() => setActiveTabAndNavigate(tab.id)}
                >
                  <TabItemContent {...tab} />
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TabSelector;
