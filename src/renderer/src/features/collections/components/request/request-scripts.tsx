import { useRef, useState } from 'react';
import RequestScriptSnippets from '@/features/collections/components/request/request-script-snippets';
import { type SnippetScope } from '@/features/collections/constants/request-script-snippets';
import { formatJs } from '@/utils/editor-util';
import { type ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { Controller, useFormContext } from 'react-hook-form';

import { Button } from '@/components/common/button';
import { ScrollArea } from '@/components/common/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/tabs';
import { BeautifyButton } from '@/components/app/button/beautify-button';
import CodeEditor, { EDITOR_BODY_TYPE } from '@/components/app/editor/code-editor';

const TAB_FIELD_MAP: Record<SnippetScope, string> = {
  'pre-request': 'scripts.preRequest',
  'post-response': 'scripts.postResponse',
};

function RequestScripts() {
  const form = useFormContext();
  const [activeTab, setActiveTab] = useState<SnippetScope>('pre-request');
  const preRequestRef = useRef<ReactCodeMirrorRef>(null);
  const postResponseRef = useRef<ReactCodeMirrorRef>(null);

  const handleBeautify = () => {
    const field = TAB_FIELD_MAP[activeTab];
    const value = form.getValues(field);
    const formatted = formatJs(value);
    form.setValue(field, formatted, { shouldDirty: true });
  };

  const handleInsertSnippet = (code: string) => {
    const ref = activeTab === 'pre-request' ? preRequestRef : postResponseRef;
    const view = ref.current?.view;
    if (!view) return;

    const cursor = view.state.selection.main.head;
    const insert = `\n${code}`;
    view.dispatch({
      changes: { from: cursor, insert },
      selection: { anchor: cursor + insert.length },
    });
    view.focus();
  };

  return (
    <div className="w-full h-full px-2 relative">
      <div className="absolute bottom-5 right-5 z-50">
        <RequestScriptSnippets activeTab={activeTab} onInsert={handleInsertSnippet} />
      </div>
      <Tabs
        defaultValue="pre-request"
        selectionId="request-view-scripts-tab"
        className="gap-1 flex-1 min-h-0 flex flex-col h-full"
        onValueChange={(v) => setActiveTab(v as SnippetScope)}
      >
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
            <BeautifyButton onClick={handleBeautify} />
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
                    ref={preRequestRef}
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
                    ref={postResponseRef}
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
