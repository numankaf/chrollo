import React from 'react';
import { CodeXml } from 'lucide-react';
import { nanoid } from 'nanoid';

import { BASE_MODEL_TYPE } from '@/types/base';
import { ENVIRONMENT_VARIABLE_CAPTURE_REGEX, ENVIRONMENT_VARIABLE_MATCH_REGEX } from '@/types/common';
import type { EnvironmentVariable } from '@/types/environment';
import type { Tab } from '@/types/layout';
import { cn } from '@/lib/utils';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { useTabNavigation } from '@/hooks/app/use-tab-navigation';
import useUpdateEnvironmentVariable from '@/hooks/environment/use-update-environment-variable';
import { Badge } from '@/components/common/badge';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/common/tooltip';

type VariableInputTooltipContentProps = {
  variable?: EnvironmentVariable;
  resolveFromScript?: boolean;
  onEnvironmentClick?: (tab: Tab) => void;
};

function VariableInputTooltipContent({
  variable,
  resolveFromScript,
  onEnvironmentClick,
}: VariableInputTooltipContentProps) {
  const { activeEnvironment, editingVariable, setEditingVariable } = useUpdateEnvironmentVariable();

  if (resolveFromScript && !variable) {
    return (
      <div className="flex flex-col gap-3 pointer-events-auto">
        <div className="flex items-center gap-1">
          <Badge variant="primary-bordered-ghost">
            <CodeXml />
          </Badge>
          <div className="text-sm">Local</div>
        </div>
        <div className="text-sm h-8 border border-border rounded px-2 py-1 flex items-center">Resolved via script</div>
      </div>
    );
  }

  const exists = !!variable;

  return (
    <div className="flex flex-col gap-3 pointer-events-auto">
      <div className="flex items-center gap-1">
        <Badge variant="primary-bordered-ghost">E</Badge>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1 text-sm"
          onClick={() =>
            activeEnvironment &&
            onEnvironmentClick?.({ id: activeEnvironment.id, modelType: BASE_MODEL_TYPE.ENVIRONMENT })
          }
        >
          {activeEnvironment?.name || 'No environment'}
        </Button>
      </div>

      <div className="flex flex-col">
        {exists && variable ? (
          <Input
            className="h-8 text-sm focus-visible:ring-primary/30"
            value={editingVariable?.id === variable.id ? editingVariable.value : variable.value}
            onFocus={() => setEditingVariable({ id: variable.id, value: variable.value })}
            onChange={(e) => setEditingVariable({ id: variable.id, value: e.target.value })}
          />
        ) : (
          <div className="text-sm text-muted-foreground">
            {activeEnvironment ? 'Variable not found in selected environment' : 'No environment selected'}
          </div>
        )}
      </div>
    </div>
  );
}

interface VariableInputProps extends React.ComponentProps<'input'> {
  containerClassName?: string;
}

function VariableInput({ className, containerClassName, value, onChange, ...props }: VariableInputProps) {
  const currentText = String(value || '');
  const { activeEnvironment } = useActiveItem();
  const { openTab } = useTabNavigation();
  const variables = activeEnvironment?.variables || [];

  const renderMirror = () => {
    const parts = currentText.split(new RegExp(`(${ENVIRONMENT_VARIABLE_MATCH_REGEX.source})`, 'g'));
    return parts.map((part) => {
      const match = ENVIRONMENT_VARIABLE_CAPTURE_REGEX.exec(part);
      if (match) {
        const varKey = match[1].trim();
        const variable = variables.find((v) => v.key === varKey && v.enabled);
        const exists = !!variable;

        return (
          <Tooltip key={nanoid()} delayDuration={500}>
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
              className="z-100 max-w-80 p-3 overflow-hidden min-w-64 shadow-xl border bg-card text-foreground animate-none"
            >
              <VariableInputTooltipContent variable={variable} onEnvironmentClick={(tab) => openTab(tab)} />
            </TooltipContent>
          </Tooltip>
        );
      }
      return <span key={nanoid()}>{part}</span>;
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

export { VariableInput, VariableInputTooltipContent };
