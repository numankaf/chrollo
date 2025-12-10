import { use, useLayoutEffect, useState } from 'react';
import { ActiveThemeProviderContext } from '@/provider/theme-provider';
import { formatJson, getEditorTheme } from '@/utils/editor-util';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter, lintGutter } from '@codemirror/lint';
import CodeMirror from '@uiw/react-codemirror';
import { useTheme } from 'next-themes';
import { Controller, useFormContext } from 'react-hook-form';

import { REQUEST_BODY_TYPE } from '@/types/collection';
import { Button } from '@/components/common/button';
import { ScrollArea } from '@/components/common/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/select';

const BODY_TYPE_PROPERTY_KEY = 'body.type';
const BODY_DATA_PROPERTY_KEY = 'body.data';

function BodyTypeSelector() {
  const form = useFormContext();
  return (
    <Controller
      name={BODY_TYPE_PROPERTY_KEY}
      control={form.control}
      render={({ field, fieldState }) => (
        <Select name={field.name} value={field.value} onValueChange={field.onChange}>
          <SelectTrigger size="sm" className="text-sm h-6! w-22 " aria-invalid={fieldState.invalid}>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(REQUEST_BODY_TYPE).map((value) => (
              <SelectItem className="text-sm h-6 rounded-md" key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}

function RequestBody() {
  const form = useFormContext();
  const bodyType = form.getValues(BODY_TYPE_PROPERTY_KEY);

  const { activeTheme } = use(ActiveThemeProviderContext);
  const { resolvedTheme } = useTheme();

  const [editorTheme, setEditorTheme] = useState(() => getEditorTheme(resolvedTheme));

  useLayoutEffect(() => {
    if (!resolvedTheme) return;

    // wait for DOM + CSS to flush
    requestAnimationFrame(() => {
      setEditorTheme(getEditorTheme(resolvedTheme));
    });
  }, [resolvedTheme, activeTheme]);

  const formatCode = () => {
    const text = form.getValues(BODY_DATA_PROPERTY_KEY);
    const formatted = bodyType === REQUEST_BODY_TYPE.JSON ? formatJson(text) : text;
    form.setValue(BODY_DATA_PROPERTY_KEY, formatted);
    return true;
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2 mx-2 mb-1 ">
        <p className="text-muted-foreground my-1 flex-1">Body</p>
        <BodyTypeSelector />
        <Button size="sm" className="h-6" variant="outline" type="button" onClick={formatCode}>
          Beautify
        </Button>
      </div>
      <ScrollArea className="mx-2 mb-2 border rounded-lg" style={{ height: 'calc(100% - 2.5rem)' }}>
        <Controller
          name={BODY_DATA_PROPERTY_KEY}
          control={form.control}
          render={({ field }) => (
            <CodeMirror
              value={field.value}
              height="auto"
              theme={editorTheme}
              extensions={[
                bodyType === REQUEST_BODY_TYPE.JSON ? [json(), linter(jsonParseLinter())] : [],
                lintGutter(),
              ]}
              onChange={(value) => {
                form.setValue(BODY_DATA_PROPERTY_KEY, value, {
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                // Check for Ctrl+S (Windows/Linux) or Cmd+S (Mac)
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                  e.preventDefault();
                  formatCode();
                }
              }}
            />
          )}
        />
      </ScrollArea>
    </>
  );
}

export default RequestBody;
