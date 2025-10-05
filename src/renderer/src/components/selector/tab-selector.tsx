import { Button } from '@/components/common/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/popover';
import { ChevronDown } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import useTabsStore from '../../store/tabs-store';
import { SearchBar } from '../common/search-input';

const TabSelector = () => {
  const { tabs } = useTabsStore(
    useShallow((state) => ({
      tabs: state.tabs,
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
          {tabs?.map((tab) => (
            <Button variant="ghost" key={tab.id} className=" w-full justify-start gap-2" size="sm">
              <p className="flex gap-1">{tab.title}</p>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TabSelector;
