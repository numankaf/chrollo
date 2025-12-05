import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/common/input';

interface InlineEditTextProps {
  value: string;
  editing: boolean;
  onComplete: (value: string) => void;
  textProps?: React.ComponentProps<'span'>;
  inputProps?: React.ComponentProps<'input'>;
}

function InlineEditText({ value, editing, onComplete, textProps, inputProps }: InlineEditTextProps) {
  const [inlineValue, setInlineValue] = useState<string>(value);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setTimeout(() => {
        ref.current?.focus();
        ref.current?.select();
      }, 0);
    }
  }, [editing]);

  function complete() {
    onComplete(inlineValue);
  }

  if (!editing) {
    return (
      <span className={cn('flex-1 overflow-hidden text-nowrap text-ellipsis w-0', textProps?.className)} {...textProps}>
        {value}
      </span>
    );
  }
  return (
    <Input
      ref={ref}
      value={inlineValue}
      onBlur={complete}
      onKeyDown={(e) => {
        if (e.key === 'Enter') complete();
      }}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        setInlineValue(e.target.value);
      }}
      className={cn(
        'text-sm! bg-background! hover:border-primary! h-6 focus-visible:ring-[0.5px]! px-1!',
        inputProps?.className
      )}
      {...inputProps}
    />
  );
}

export default InlineEditText;
