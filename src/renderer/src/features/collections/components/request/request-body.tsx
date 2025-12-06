import { use, useEffect, useState } from 'react';
import { ThemeProviderContext } from '@/provider/theme-provider';
import { formatJson, getEditorTheme } from '@/utils/editor-util';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter, lintGutter } from '@codemirror/lint';
import CodeMirror from '@uiw/react-codemirror';
import { Controller, useFormContext } from 'react-hook-form';

import { REQUEST_BODY_TYPE } from '@/types/collection';
import { Button } from '@/components/common/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/common/resizeable';
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
  const { theme } = use(ThemeProviderContext);
  const [editorTheme, setEditorTheme] = useState(() => getEditorTheme(theme));
  const form = useFormContext();
  const bodyType = form.getValues(BODY_TYPE_PROPERTY_KEY);
  const bodyData = form.getValues(BODY_DATA_PROPERTY_KEY);

  useEffect(() => {
    const html = document.documentElement;

    const updateTheme = () => {
      setEditorTheme(getEditorTheme(theme));
    };

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          updateTheme();
        }
      }
    });

    observer.observe(html, { attributes: true });

    return () => observer.disconnect();
  }, [theme]);

  const formatCode = () => {
    const text = form.getValues(BODY_DATA_PROPERTY_KEY);
    const formatted = bodyType === REQUEST_BODY_TYPE.JSON ? formatJson(text) : text;
    form.setValue(BODY_DATA_PROPERTY_KEY, formatted);
    return true;
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2 mx-2 mb-1 -mt-5">
        <BodyTypeSelector />
        <Button size="sm" className="h-6" variant="outline" type="button" onClick={formatCode}>
          Beautify
        </Button>
      </div>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel minSize={25} className="border rounded-lg mx-2 mb-2">
          <ScrollArea className="h-full">
            <CodeMirror
              value={bodyData}
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
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={25}>Response</ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}

export default RequestBody;
