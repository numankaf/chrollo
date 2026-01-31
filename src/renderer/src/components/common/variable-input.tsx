import React, { useEffect, useState } from 'react';
import useEnvironmentStore from '@/store/environment-store';
import useTabsStore from '@/store/tab-store';
import { useShallow } from 'zustand/react/shallow';

import { ENVIRONMENT_VAR_CAPTURE_REGEX, ENVIRONMENT_VAR_REGEX } from '@/types/common';
import { cn } from '@/lib/utils';
import { useActiveItem } from '@/hooks/app/use-active-item';
import useDebouncedValue from '@/hooks/common/use-debounced-value';
import { Badge } from '@/components/common/badge';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/common/tooltip';

interface VariableInputProps extends React.ComponentProps<'input'> {
  containerClassName?: string;
}

function VariableInput({ className, containerClassName, value, onChange, ...props }: VariableInputProps) {
  const currentText = String(value || '');
  const { activeEnvironment } = useActiveItem();
  const updateEnvironment = useEnvironmentStore((s) => s.updateEnvironment);
  const variables = activeEnvironment?.variables || [];
  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );

  // Management for debounced editing of variables within tooltips
  const [editingVar, setEditingVar] = useState<{ id: string; value: string } | null>(null);
  const debouncedEditingVar = useDebouncedValue(editingVar, 500);

  useEffect(() => {
    if (!debouncedEditingVar || !activeEnvironment) return;

    const { id, value: newValue } = debouncedEditingVar;
    const variable = activeEnvironment.variables.find((v) => v.id === id);

    // Only update if the value has actually changed to avoid infinite loops
    if (variable && variable.value !== newValue) {
      const newVariables = activeEnvironment.variables.map((v) => (v.id === id ? { ...v, value: newValue } : v));
      updateEnvironment({ ...activeEnvironment, variables: newVariables }, { persist: true });
    }
  }, [debouncedEditingVar, activeEnvironment, updateEnvironment]);

  const renderMirror = () => {
    const parts = currentText.split(new RegExp(`(${ENVIRONMENT_VAR_REGEX.source})`, 'g'));
    return parts.map((part, i) => {
      const match = ENVIRONMENT_VAR_CAPTURE_REGEX.exec(part);
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
              className="z-100 max-w-80 p-3 overflow-hidden min-w-64 shadow-xl border bg-card text-foreground"
            >
              <div className="flex flex-col gap-3 pointer-events-auto">
                <div className="flex items-center gap-1">
                  <Badge variant="primary-bordered-ghost">E</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 px-1 text-sm"
                    onClick={() => {
                      if (activeEnvironment) openTab(activeEnvironment);
                    }}
                  >
                    {activeEnvironment?.name || 'No environment'}
                  </Button>
                </div>
                <div className="flex flex-col">
                  {exists && variable ? (
                    <Input
                      autoFocus
                      className="h-8 text-sm focus-visible:ring-primary/30"
                      value={editingVar?.id === variable.id ? editingVar.value : variable.value}
                      onFocus={() => setEditingVar({ id: variable.id, value: variable.value })}
                      onChange={(e) => setEditingVar({ id: variable.id, value: e.target.value })}
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {activeEnvironment ? 'Variable not found in selected environment' : 'No environment selected'}
                    </div>
                  )}
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
      <div className={cn('relative flex-1 group overflow-hidden caret-foreground rounded-md', containerClassName)}>
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
