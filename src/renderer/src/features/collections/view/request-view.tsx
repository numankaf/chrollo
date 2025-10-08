import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/common/resizeable';
import { json } from '@codemirror/lang-json';
import { materialDark, materialLight } from '@uiw/codemirror-theme-material';
import CodeMirror from '@uiw/react-codemirror';
import { use } from 'react';
import { ThemeProviderContext } from '../../../provider/theme-provider';

const RequestView = () => {
  const { theme } = use(ThemeProviderContext);

  return (
    <ResizablePanelGroup direction="vertical" className="h-[990px]">
      <ResizablePanel minSize={10}>
        <CodeMirror
          value="{
                id: nanoid(8),
                name: 'ws-connection-tukks',
                state: 'connected',
                type: 'connection',
              }"
          height="400px"
          extensions={[json()]}
          theme={theme === 'dark' ? materialDark : materialLight}
          onChange={(value) => console.log(value)}
        />
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary" />
      <ResizablePanel minSize={10}>Two</ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default RequestView;
