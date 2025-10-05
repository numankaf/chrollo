import { Button } from '@/components/common/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/popover';
import { ScrollArea } from '@/components/common/scroll-area';
import { SearchBar } from '@/components/common/search-input';
import { Check, ChevronDown, CircleOff, Plus } from 'lucide-react';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useEnviromentStore from '../../store/enviroment-store';

const EnviromentSelector = () => {
  const { enviroments, selectEnviroment, selectedEnviroment } = useEnviromentStore(
    useShallow((state) => ({
      enviroments: state.enviroments,
      selectEnviroment: state.selectEnviroment,
      selectedEnviroment: state.selectedEnviroment,
    }))
  );

  const [search, setSearch] = useState('');
  const filteredEnviroments = enviroments.filter((env) => env.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <Popover
      onOpenChange={(open) => {
        if (open) setSearch('');
      }}
    >
      <PopoverTrigger className="w-[160px]">
        <Button variant="ghost" className="text-xs justify-between" size="sm">
          {!selectedEnviroment && <CircleOff className="w-4! h-4!" />}
          <span
            className="overflow-x-auto no-scrollbar"
            title={selectedEnviroment ? selectedEnviroment.name : 'No Enviroment'}
          >
            {selectedEnviroment ? selectedEnviroment.name : 'No Enviroment'}
          </span>
          <ChevronDown />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[320px] p-2!">
        <div className="flex items-center justify-between p-1 gap-1">
          <SearchBar placeholder="Search enviroment" className="flex-1" onSearchChange={(value) => setSearch(value)} />
          <Button size="sm" variant="ghost">
            <Plus className="w-4! h-4!" />
          </Button>
        </div>

        <div className="mt-3 space-y-1 text-xs">
          <ScrollArea className="h-[400px]!">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              size="sm"
              onClick={() => selectEnviroment(null)}
            >
              {!selectedEnviroment && <Check className="h-4 w-4" />}
              <p className="text-muted-foreground">No Enviroment</p>
            </Button>
            {filteredEnviroments.map((enviroment) => (
              <Button
                variant="ghost"
                key={enviroment.id}
                className="w-full justify-start gap-2"
                size="sm"
                onClick={() => selectEnviroment(enviroment)}
              >
                {enviroment.id === selectedEnviroment?.id && <Check className="h-4 w-4" />}
                <p>{enviroment.name}</p>
              </Button>
            ))}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EnviromentSelector;
