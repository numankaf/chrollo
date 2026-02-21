import React from 'react';
import { resolveVariableSource } from '@/utils/script-util';
import { CircleOff, CodeXml } from 'lucide-react';

import { BASE_MODEL_TYPE } from '@/types/base';
import {
  ENVIRONMENT_VARIABLE_CAPTURE_REGEX,
  ENVIRONMENT_VARIABLE_MATCH_REGEX,
  VARIABLE_SOURCE,
  type VariableSource,
} from '@/types/common';
import type { Environment, EnvironmentVariable } from '@/types/environment';
import type { Tab } from '@/types/layout';
import { cn } from '@/lib/utils';
import { useActiveItem } from '@/hooks/app/use-active-item';
import useActiveRequestLocalVarKeys from '@/hooks/app/use-active-request-local-var-keys';
import { useTabNavigation } from '@/hooks/app/use-tab-navigation';
import useUpdateEnvironmentVariable from '@/hooks/environment/use-update-environment-variable';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/common/tooltip';
import { EnvironmentIcon } from '@/components/icon/environment-icon';

type VariableInputTooltipContentProps = {
  variable?: EnvironmentVariable;
  source?: VariableSource;
  environment?: Environment;
  onEnvironmentClick?: (tab: Tab) => void;
};

function VariableInputTooltipContent({
  variable,
  source,
  environment,
  onEnvironmentClick,
}: VariableInputTooltipContentProps) {
  const { editingVariable, setEditingVariable } = useUpdateEnvironmentVariable();

  if (!source) {
    return (
      <div className="flex flex-col gap-3 pointer-events-auto">
        <div className="flex items-center gap-1">
          <CircleOff size={14} />
          <div className="text-sm">Variable not found</div>
        </div>
        <div className="text-sm text-muted-foreground">
          This variable is not defined in globals, active environment, or pre-request script.
        </div>
      </div>
    );
  }

  if (source === VARIABLE_SOURCE.SCRIPT) {
    return (
      <div className="flex flex-col gap-3 pointer-events-auto">
        <div className="flex items-center gap-1">
          <CodeXml size={14} />
          <div className="text-sm">Local</div>
        </div>
        <div className="text-sm h-8 border border-border rounded px-2 py-1 flex items-center">Resolved via script</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pointer-events-auto">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 pl-1! text-sm font-medium"
          onClick={() =>
            environment && onEnvironmentClick?.({ id: environment.id, modelType: BASE_MODEL_TYPE.ENVIRONMENT })
          }
        >
          <EnvironmentIcon isGlobal={source === VARIABLE_SOURCE.GLOBAL} size={14} />
          {environment?.name}
        </Button>
      </div>
      <Input
        className="h-8 text-sm focus-visible:ring-primary/30"
        value={editingVariable?.id === variable?.id ? (editingVariable?.value ?? '') : (variable?.value ?? '')}
        onFocus={() => variable && setEditingVariable({ id: variable.id, value: variable.value })}
        onChange={(e) => variable && setEditingVariable({ id: variable.id, value: e.target.value })}
      />
    </div>
  );
}

interface VariableInputProps extends React.ComponentProps<'input'> {
  containerClassName?: string;
}

function VariableInput({ className, containerClassName, value, onChange, ...props }: VariableInputProps) {
  const currentText = String(value || '');
  const { activeEnvironment, globalEnvironment } = useActiveItem();
  const { openTab } = useTabNavigation();
  const scriptLocalVarKeys = useActiveRequestLocalVarKeys();

  const envVars = activeEnvironment?.variables.filter((v) => v.enabled) ?? [];
  const globalVars = globalEnvironment?.variables.filter((v) => v.enabled) ?? [];

  const renderMirror = () => {
    const parts = currentText.split(new RegExp(`(${ENVIRONMENT_VARIABLE_MATCH_REGEX.source})`, 'g')).filter(Boolean);
    let charOffset = 0;
    return parts.map((part) => {
      const key = charOffset;
      charOffset += part.length;

      const match = ENVIRONMENT_VARIABLE_CAPTURE_REGEX.exec(part);
      if (match) {
        const varKey = match[1].trim();
        const { source, variable } = resolveVariableSource(varKey, envVars, globalVars, scriptLocalVarKeys);
        const resolvedEnv = source === VARIABLE_SOURCE.ENVIRONMENT ? activeEnvironment : globalEnvironment;
        const found = !!source;

        return (
          <Tooltip key={key} delayDuration={500}>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  'pointer-events-auto cursor-text transition-colors rounded-md',
                  found ? 'text-primary bg-primary/10' : 'text-destructive bg-destructive/10'
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
              <VariableInputTooltipContent
                variable={variable}
                source={source}
                environment={resolvedEnv ?? undefined}
                onEnvironmentClick={(tab) => openTab(tab)}
              />
            </TooltipContent>
          </Tooltip>
        );
      }
      return <span key={key}>{part}</span>;
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
