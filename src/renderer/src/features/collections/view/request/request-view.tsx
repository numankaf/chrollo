import { use, useEffect, useState } from 'react';
import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/common/resizeable';
import { ScrollArea } from '@/components/common/scroll-area';

import { ThemeProviderContext } from '../../../../provider/theme-provider';
import { getEditorTheme } from '../../../../utils/editor-theme-util';
import SearchRequestInput from '../../components/request/search-request-input';

function RequestView() {
  const { theme } = use(ThemeProviderContext);
  const [editorTheme, setEditorTheme] = useState(() => getEditorTheme(theme));

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

  return (
    <>
      <SearchRequestInput />
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel minSize={25} className="border rounded-lg m-2">
          <ScrollArea className="h-full">
            <CodeMirror
              value="{}"
              height="auto"
              theme={editorTheme}
              extensions={[json()]}
              onChange={(value) => console.log('value:', value)}
            />
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle className="hover:bg-primary" />
        <ResizablePanel minSize={25}>Two</ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}

export default RequestView;
