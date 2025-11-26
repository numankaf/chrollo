import { useState } from 'react';
import useWorkspaceStore from '@/store/workspace-store';
import { applyTextSearch } from '@/utils/search-util';
import { Check, ChevronDown, Plus } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/components/common/button';
import { Label } from '@/components/common/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/popover';
import { SearchBar } from '@/components/common/search-input';
import { WorkspaceTypeIcon } from '@/components/icon/workspace-type-icon';

function WorkspaceSelector() {
  const { workspaces, selectWorkspace, selectedWorkspace } = useWorkspaceStore(
    useShallow((state) => ({
      workspaces: state.workspaces,
      selectWorkspace: state.selectWorkspace,
      selectedWorkspace: state.selectedWorkspace,
    }))
  );
  const [search, setSearch] = useState('');

  const filteredWorkspaces = applyTextSearch(workspaces, search, (workspace) => workspace.name);

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
            <Plus size={16} />
          </Button>
          <SearchBar
            placeholder="Search workspaces"
            className="flex-1"
            onSearchChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="mt-3 space-y-1">
          <Label className="text-secondary text-sm m-1"> Recently Visited</Label>
          {filteredWorkspaces.map((workspace) => (
            <Button
              onClick={() => selectWorkspace(workspace)}
              variant="ghost"
              key={workspace.id}
              className=" w-full justify-between gap-2 text-sm"
              size="sm"
            >
              <div className="flex gap-2">
                <WorkspaceTypeIcon workspaceType={workspace.type} size={16} />
                {workspace.name}
              </div>
              {workspace.id === selectedWorkspace?.id && <Check size={16} />}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default WorkspaceSelector;
