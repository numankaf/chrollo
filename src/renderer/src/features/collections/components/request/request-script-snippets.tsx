import { useState } from 'react';
import {
  REQUEST_SCRIPT_SNIPPETS,
  SNIPPET_CATEGORIES,
  type Snippet,
  type SnippetScope,
} from '@/features/collections/constants/request-script-snippets';
import { applyTextSearch } from '@/utils/search-util';
import { CodeXml } from 'lucide-react';

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

interface RequestScriptSnippetsProps {
  activeTab: SnippetScope;
  onInsert: (code: string) => void;
}

function RequestScriptSnippets({ activeTab, onInsert }: RequestScriptSnippetsProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const scopedSnippets = REQUEST_SCRIPT_SNIPPETS.filter((s) => !s.scope || s.scope === activeTab);
  const filteredSnippets = applyTextSearch(scopedSnippets, search, (s) => s.title);

  const handleSelect = (snippet: Snippet) => {
    onInsert(snippet.code);
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) setSearch('');
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7">
          <CodeXml />
          Snippets
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-64 p-0!">
        <Command shouldFilter={false}>
          <div className="border-b">
            <CommandInput value={search} onValueChange={setSearch} placeholder="Search snippets..." className="h-9" />
          </div>
          <CommandList>
            <CommandEmpty>No snippets found.</CommandEmpty>
            {SNIPPET_CATEGORIES.map((category) => {
              const items = filteredSnippets.filter((s) => s.category === category);
              if (items.length === 0) return null;
              return (
                <CommandGroup key={category} heading={category}>
                  {items.map((snippet) => (
                    <CommandItem key={snippet.id} value={snippet.id} onSelect={() => handleSelect(snippet)}>
                      {snippet.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default RequestScriptSnippets;
