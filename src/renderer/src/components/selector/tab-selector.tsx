import { Button } from '@/components/common/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/popover';
import { ChevronDown } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import useTabsStore from '../../store/tab-store';
import { SearchBar } from '../common/search-input';
import TabItemContent from '../tab/tab-item-content';

const TabSelector = () => {
  const { tabs, setActiveTab } = useTabsStore(
    useShallow((state) => ({
      tabs: state.tabs,
      setActiveTab: state.setActiveTab,
    }))
  );

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" size="sm">
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[240px] p-2!">
        <div className="flex items-center justify-between p-1 gap-1">
          <SearchBar placeholder="Search tabs" className="flex-1" onSearchChange={() => {}} />
        </div>
        <div className="mt-3 space-y-1 text-xs">
          {tabs.length === 0 && <p className="px-1 text-muted-foreground">No open tabs</p>}

          {tabs?.map((tab) => (
            <Button
              variant="ghost"
              key={tab.id}
              className=" w-full justify-start gap-2"
              size="sm"
              onClick={() => setActiveTab(tab.id)}
            >
              <TabItemContent {...tab} />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TabSelector;
