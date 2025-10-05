import { Button } from '@/components/common/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/popover';
import { Check, ChevronDown, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { SearchBar } from '../common/search-input';

const ENVIROMENT_DATA = [
  { id: nanoid(8), name: 'No Enviroment', selected: true },
  { id: nanoid(8), name: 'Enviroment 1', selected: false },
  { id: nanoid(8), name: 'Enviroment 2', selected: false },
  { id: nanoid(8), name: 'Enviroment 3', selected: false },
  { id: nanoid(8), name: 'Enviroment 4', selected: false },
  { id: nanoid(8), name: 'Enviroment 5', selected: false },
];

const EnviromentSelector = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" className="text-xs" size="sm">
          No Enviroment <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[320px] p-2!">
        <div className="flex items-center justify-between p-1 gap-1">
          <SearchBar placeholder="Search enviroment" className="flex-1" onSearchChange={() => {}} />
          <Button size="sm" variant="ghost">
            <Plus className="w-4! h-4!" />
          </Button>
        </div>
        <div className="mt-3 space-y-1 text-xs">
          {ENVIROMENT_DATA.map((enviroment) => (
            <Button variant="ghost" key={enviroment.id} className=" w-full justify-start gap-2" size="sm">
              {enviroment.selected && <Check className="h-4 w-4" />}
              <p className="flex gap-1">{enviroment.name}</p>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EnviromentSelector;
