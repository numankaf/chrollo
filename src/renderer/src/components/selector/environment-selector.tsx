import { useState } from 'react';
import useWorkspaceStore from '@/store/workspace-store';
import { applyTextSearch } from '@/utils/search-util';
import { Check, ChevronDown, CircleOff, Plus } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import type { Environment } from '@/types/environment';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { useWorkspaceEnvironments } from '@/hooks/workspace/use-workspace-environments';
import { Button } from '@/components/common/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/popover';
import { ScrollArea } from '@/components/common/scroll-area';
import { SearchBar } from '@/components/common/search-input';

function EnvironmentSelector() {
  const environments = useWorkspaceEnvironments();
  const { updateWorkspaceSelection } = useWorkspaceStore(
    useShallow((state) => ({
      updateWorkspaceSelection: state.updateWorkspaceSelection,
    }))
  );

  const { activeEnvironment } = useActiveItem();

  const [search, setSearch] = useState('');

  const allEnvironments = [{ id: 'none', name: 'No Environment' }, ...environments] as Environment[];

  const filteredEnvironments = applyTextSearch(allEnvironments, search, (env) => env.name);

  return (
    <Popover
      onOpenChange={(open) => {
        if (open) setSearch('');
      }}
    >
      <PopoverTrigger className="w-40">
        <Button variant="ghost" className="text-sm justify-between" size="sm">
          {!activeEnvironment && <CircleOff size={16} />}
          <span
            className="overflow-x-auto no-scrollbar"
            title={activeEnvironment ? activeEnvironment.name : 'No Environment'}
          >
            {activeEnvironment ? activeEnvironment.name : 'No Environment'}
          </span>
          <ChevronDown />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[320px] p-2">
        <div className="flex items-center justify-between p-1 gap-1">
          <SearchBar
            placeholder="Search environment"
            className="flex-1"
            onSearchChange={(e) => setSearch(e.target.value)}
          />
          <Button size="sm" variant="ghost">
            <Plus size={16} />
          </Button>
        </div>

        <div className="mt-3 space-y-1 text-sm">
          <ScrollArea>
            <div className="max-h-[300px]">
              {filteredEnvironments.map((environment) => (
                <Button
                  variant="ghost"
                  key={environment.id}
                  className="w-full justify-start gap-2"
                  size="sm"
                  onClick={() =>
                    environment.id === 'none'
                      ? updateWorkspaceSelection({ activeEnvironmentId: undefined })
                      : updateWorkspaceSelection({ activeEnvironmentId: environment.id })
                  }
                >
                  {environment.id === activeEnvironment?.id || (!activeEnvironment && environment.id === 'none') ? (
                    <Check className="h-4 w-4" />
                  ) : null}
                  <p className={environment.id === 'none' ? 'text-muted-foreground' : undefined}>{environment.name}</p>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default EnvironmentSelector;
