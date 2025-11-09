import { Button } from '@/components/common/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/popover';
import { Check, ChevronDown, Lock, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Label } from '../common/label';
import { SearchBar } from '../common/search-input';

const WORKSPACES_DATA = [
  { id: nanoid(8), name: 'Workspace 1', selected: true },
  { id: nanoid(8), name: 'Workspace 2' },
  { id: nanoid(8), name: 'Workspace 3' },
  { id: nanoid(8), name: 'Workspace 4' },
  { id: nanoid(8), name: 'Workspace 5' },
];

function WorkspaceSelector() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost">
          Workspaces <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[320px] p-2!">
        <div className="flex items-center justify-between p-1 gap-1">
          <Button size="sm" variant="ghost">
            <Plus className="w-4! h-4!" />
          </Button>
          <SearchBar placeholder="Search workspaces" className="flex-1" onSearchChange={() => {}} />
        </div>
        <div className="mt-3 space-y-1">
          <Label className="text-secondary text-sm m-1"> Recently Visited</Label>
          {WORKSPACES_DATA.map((workspace) => (
            <Button variant="ghost" key={workspace.id} className=" w-full justify-between gap-2" size="sm">
              <div className="flex gap-1">
                <Lock className="h-4 w-4" />
                {workspace.name}
              </div>
              {workspace.selected && <Check className="h-4 w-4" />}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default WorkspaceSelector;
