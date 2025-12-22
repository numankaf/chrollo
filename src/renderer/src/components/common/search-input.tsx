import * as React from 'react';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/common/input-group';

interface SearchBarProps {
  placeholder: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchIcon?: React.ReactNode;
  className?: string;
}

function SearchBar({
  placeholder,
  onSearchChange,
  searchIcon = <Search className="w-3 h-3" />,
  className,
}: SearchBarProps) {
  return (
    <InputGroup className={cn('h-7!', className)}>
      <InputGroupInput
        className="text-sm! shadow-none"
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearchChange?.(e)}
      />
      <InputGroupAddon>{searchIcon}</InputGroupAddon>
    </InputGroup>
  );
}

export { SearchBar };
