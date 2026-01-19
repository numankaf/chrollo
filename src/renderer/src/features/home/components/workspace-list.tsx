import { useMemo, useState } from 'react';
import useWorkspaceStore from '@/store/workspace-store';
import { applyTextSearch } from '@/utils/search-util';
import { ChevronDown, Lock, Users } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { WORKSPACE_TYPE, type WorkspaceType } from '@/types/workspace';
import useDebouncedValue from '@/hooks/common/use-debounced-value';
import { Button } from '@/components/common/button';
import { Checkbox } from '@/components/common/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';
import { Item, ItemActions, ItemContent, ItemTitle } from '@/components/common/item';
import { ScrollArea } from '@/components/common/scroll-area';
import { SearchBar } from '@/components/common/search-input';
import NoResultsFound from '@/components/app/empty/no-results-found';
import NoWorkspaceFound from '@/components/app/empty/no-workspace-found';
import { WorkspaceTypeIcon } from '@/components/icon/workspace-type-icon';

export function WorkspaceList() {
  const navigate = useNavigate();
  const { workspaces, setActiveWorkspace } = useWorkspaceStore(
    useShallow((state) => ({
      workspaces: state.workspaces,
      setActiveWorkspace: state.setActiveWorkspace,
    }))
  );

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue<string>(search, 300);
  const [selectedTypes, setSelectedTypes] = useState<WorkspaceType[]>([]);

  const filteredWorkspaces = useMemo(() => {
    let result = workspaces;

    if (selectedTypes.length > 0) {
      result = result.filter((ws) => selectedTypes.includes(ws.type));
    }

    return applyTextSearch(result, debouncedSearch, (ws) => ws.name);
  }, [workspaces, debouncedSearch, selectedTypes]);

  const toggleType = (type: WorkspaceType) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-h-0">
      <div className="flex flex-wrap items-center gap-2 px-6 pb-6 shrink-0">
        <div className="w-full md:w-64">
          <SearchBar placeholder="Search workspaces..." onSearchChange={(e) => setSearch(e.target.value)} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 px-3 border-muted-foreground/20 hover:bg-accent/50">
              Type <ChevronDown className="ml-2 size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-auto p-1">
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer h-7"
              onClick={(e) => {
                e.preventDefault();
                toggleType(WORKSPACE_TYPE.INTERNAL);
              }}
            >
              <Checkbox checked={selectedTypes.includes(WORKSPACE_TYPE.INTERNAL)} className="pointer-events-none" />
              <div className="flex items-center gap-2">
                <Lock className="size-4" />
                Internal
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer h-7"
              onClick={(e) => {
                e.preventDefault();
                toggleType(WORKSPACE_TYPE.PUBLIC);
              }}
            >
              <Checkbox checked={selectedTypes.includes(WORKSPACE_TYPE.PUBLIC)} className="pointer-events-none" />
              <div className="flex items-center gap-2">
                <Users className="size-4" />
                Public
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="flex-1 px-6 pb-6" style={{ height: 'calc(100% - 5rem)' }}>
        <div className="grid gap-3">
          {workspaces.length === 0 && <NoWorkspaceFound />}
          {workspaces.length !== 0 && filteredWorkspaces.length === 0 && (
            <NoResultsFound searchTerm={debouncedSearch} />
          )}
          {filteredWorkspaces.map((ws) => (
            <Item
              variant="outline"
              key={ws.id}
              className="hover:border-primary/50 transition-colors group/ws-item cursor-pointer"
              onClick={() => {
                setActiveWorkspace(ws.id);
                navigate('/main/workspace/' + ws.id);
              }}
            >
              <WorkspaceTypeIcon
                size={16}
                workspaceType={ws.type}
                className="group-hover/ws-item:text-primary transition-colors"
              />
              <ItemContent>
                <ItemTitle className="group-hover/ws-item:text-primary transition-colors">{ws.name}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover/ws-item:opacity-100 transition-opacity"
                >
                  Open
                </Button>
              </ItemActions>
            </Item>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
