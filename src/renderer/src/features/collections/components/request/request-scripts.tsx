import { formatJs } from '@/utils/editor-util';
import { Controller, useFormContext } from 'react-hook-form';

import { Button } from '@/components/common/button';
import { ScrollArea } from '@/components/common/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/tabs';
import { BeautifyButton } from '@/components/app/button/beautify-button';
import CodeEditor, { EDITOR_BODY_TYPE } from '@/components/app/editor/code-editor';

function RequestScripts() {
  const form = useFormContext();

  const handleBeautify = (field: string) => {
    const value = form.getValues(field);
    const formatted = formatJs(value);
    form.setValue(field, formatted, { shouldDirty: true });
  };

  return (
    <div className="w-full h-full px-2">
      <Tabs defaultValue="pre-request" className="gap-1 flex-1 min-h-0 flex flex-col h-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="pre-request" className="text-sm">
              Pre-request
            </TabsTrigger>
            <TabsTrigger value="post-response" className="text-sm">
              Post-response
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center justify-end">
            <Button variant="ghost" size="sm" className="h-6 gap-1.5 pointer-events-none!">
              {EDITOR_BODY_TYPE.JAVASCRIPT}
            </Button>
            <BeautifyButton onClick={() => handleBeautify('scripts.preRequest')} />
          </div>
        </div>

        <div className="flex-1 min-h-0 relative mb-2 border rounded-md">
          <TabsContent value="pre-request" className="h-full absolute inset-0 ">
            <Controller
              name="scripts.preRequest"
              control={form.control}
              render={({ field }) => (
                <ScrollArea className="h-full">
                  <CodeEditor
                    value={field.value}
                    bodyType={EDITOR_BODY_TYPE.JAVASCRIPT}
                    onChange={field.onChange}
                    height="100%"
                  />
                </ScrollArea>
              )}
            />
          </TabsContent>
          <TabsContent value="post-response" className="h-full absolute inset-0">
            <Controller
              name="scripts.postResponse"
              control={form.control}
              render={({ field }) => (
                <ScrollArea className="h-full">
                  <CodeEditor
                    value={field.value}
                    bodyType={EDITOR_BODY_TYPE.JAVASCRIPT}
                    onChange={field.onChange}
                    height="100%"
                  />
                </ScrollArea>
              )}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default RequestScripts;
