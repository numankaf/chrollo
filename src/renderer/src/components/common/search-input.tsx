import { Input } from '@/components/common/input';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import * as React from 'react';

interface SearchBarProps {
  placeholder: string;
  onSearchChange: (value: string) => void;
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
    <div className={cn('flex items-center justify-between', className)}>
      <div className="relative w-full">
        <span className="absolute left-3 top-1.5 z-10 text-muted-foreground">{searchIcon}</span>
        <Input
          type="text"
          placeholder={placeholder}
          className="pl-8 pr-3 text-sm! bg-background shadow-none h-7!"
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}

export { SearchBar };
