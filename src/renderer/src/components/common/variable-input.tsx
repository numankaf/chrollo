import * as React from 'react';

import { cn } from '@/lib/utils';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { Badge } from '@/components/common/badge';
import { Input } from '@/components/common/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/common/tooltip';

function VariableInput({ className, value, onChange, ...props }: React.ComponentProps<'input'>) {
  const currentText = String(value || '');
  const { activeEnvironment } = useActiveItem();
  const variables = activeEnvironment?.variables || [];

  const renderMirror = () => {
    const parts = currentText.split(/(\{\{.+?\}\})/g);
    return parts.map((part, i) => {
      const match = part.match(/^\{\{(.+?)\}\}$/);
      if (match) {
        const varKey = match[1].trim();
        const variable = variables.find((v) => v.key === varKey && v.enabled);
        const exists = !!variable;

        return (
          /* eslint-disable-next-line react/no-array-index-key */
          <Tooltip key={`var-${i}`} delayDuration={500}>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  'pointer-events-auto cursor-text transition-colors rounded-md',
                  exists ? 'text-primary bg-primary/10' : 'text-destructive bg-destructive/10'
                )}
              >
                {part}
              </span>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="start"
              className="[&_svg]:invisible max-w-80 p-2 overflow-hidden min-w-48 shadow-xl border bg-card text-foreground"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold uppercase text-muted-foreground">{activeEnvironment?.name}</span>
                  <Badge variant={exists ? 'primary-bordered-ghost' : 'error-bordered-ghost'}>
                    {exists ? 'E' : 'Missing'}
                  </Badge>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground truncate">{varKey}</span>
                  <span className="text-sm text-muted-foreground">
                    {exists ? variable.value || '(empty)' : 'Variable not found in selected environment'}
                  </span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        );
      }
      /* eslint-disable-next-line react/no-array-index-key */
      return <span key={`text-${i}`}>{part}</span>;
    });
  };

  return (
    <TooltipProvider delayDuration={500}>
      <div className="relative flex-1 h-9 group overflow-hidden">
        <div
          className={cn(
            'absolute inset-0 flex items-center bg-transparent px-3 py-1 pointer-events-none overflow-hidden h-full select-none',
            className
          )}
          aria-hidden="true"
        >
          {renderMirror()}
        </div>

        <Input
          value={currentText}
          onChange={onChange}
          spellCheck={false}
          autoComplete="off"
          className={cn(
            'bg-transparent! selection:bg-primary/30 caret-foreground',
            currentText.length > 0 && 'text-transparent',
            className
          )}
          {...props}
        />
      </div>
    </TooltipProvider>
  );
}

export { VariableInput };
