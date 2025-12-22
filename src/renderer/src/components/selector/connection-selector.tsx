import { useState } from 'react';
import ConnectionStatusBadge from '@/features/connections/components/common/connection-status-badge';
import useConnectionStatusStore from '@/store/connection-status-store';
import useWorkspaceStore from '@/store/workspace-store';
import { getConnectionButtonVariant } from '@/utils/connection-util';
import { applyTextSearch } from '@/utils/search-util';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { cn } from '@/lib/utils';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { useWorkspaceConnections } from '@/hooks/workspace/use-workspace-connections';
import { Button } from '@/components/common/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/common/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/popover';

function ConnectionSelector() {
  const connections = useWorkspaceConnections();
  const { updateWorkspaceSelection } = useWorkspaceStore(
    useShallow((state) => ({
      updateWorkspaceSelection: state.updateWorkspaceSelection,
    }))
  );
  const { activeConnection } = useActiveItem();
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const status = useConnectionStatusStore((s) => (activeConnection ? s.statuses[activeConnection.id] : undefined));
  const filteredConnections = applyTextSearch(connections, search, (c) => c.name);

  const { variant } = getConnectionButtonVariant(status);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={variant} role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            {activeConnection && <ConnectionStatusBadge connectionId={activeConnection.id} />}
            <span className="flex-1 truncate">
              {activeConnection
                ? connections.find((connection) => connection.id === activeConnection.id)?.name
                : 'Select connection...'}
            </span>
          </div>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandInput value={search} onValueChange={setSearch} placeholder="Search connection..." className="h-9" />
          <CommandList>
            <CommandEmpty>No connection found.</CommandEmpty>
            <CommandGroup>
              {filteredConnections.map((connection) => (
                <CommandItem
                  key={connection.id}
                  value={connection.id}
                  data-search={connection.name.toLowerCase()}
                  onSelect={(value) => {
                    updateWorkspaceSelection({ activeConnectionId: value });
                    setOpen(false);
                  }}
                >
                  <ConnectionStatusBadge connectionId={connection.id} />
                  <span className="flex-1 truncate">{connection.name}</span>
                  <Check
                    className={cn('ml-auto', activeConnection?.id === connection.id ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ConnectionSelector;
