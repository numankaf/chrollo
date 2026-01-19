import { useState } from 'react';
import useWorkspaceStore from '@/store/workspace-store';
import { applyTextSearch } from '@/utils/search-util';
import { Check, ChevronDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/components/common/button';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/common/popover';
import { ScrollArea } from '@/components/common/scroll-area';
import { SearchBar } from '@/components/common/search-input';
import { WorkspaceTypeIcon } from '@/components/icon/workspace-type-icon';

function WorkspaceSelector() {
  const navigate = useNavigate();
  const { workspaces, activeWorkspaceId, setActiveWorkspace } = useWorkspaceStore(
    useShallow((state) => ({
      workspaces: state.workspaces,
      setActiveWorkspace: state.setActiveWorkspace,
      activeWorkspaceId: state.activeWorkspaceId,
    }))
  );

  const [search, setSearch] = useState('');

  const filteredWorkspaces = applyTextSearch(workspaces, search, (workspace) => workspace.name);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          Workspaces <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[320px] p-1!">
        <div className="flex items-center justify-between p-1 gap-1">
          <PopoverClose asChild>
            <Button size="sm" variant="ghost" onClick={() => navigate('/workspace/create')}>
              <Plus size={16} />
            </Button>
          </PopoverClose>
          <SearchBar
            placeholder="Search workspaces"
            className="flex-1"
            onSearchChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="mt-3 space-y-1">
          <ScrollArea className="px-4">
            <div className="max-h-[300px]">
              {filteredWorkspaces.map((workspace) => (
                <Button
                  key={workspace.id}
                  onClick={async () => {
                    await setActiveWorkspace(workspace.id);
                    navigate('/main/workspace/' + workspace.id);
                  }}
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm"
                  size="sm"
                >
                  <WorkspaceTypeIcon workspaceType={workspace.type} size={16} className="shrink-0" />
                  <span className="truncate flex-1 text-left">{workspace.name}</span>
                  <div className="w-4 shrink-0 flex items-center justify-center">
                    {workspace.id === activeWorkspaceId && <Check size={16} />}
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default WorkspaceSelector;
