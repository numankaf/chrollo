import { use, useLayoutEffect, useState } from 'react';
import { ActiveThemeProviderContext } from '@/provider/active-theme-provider';
import { getEditorTheme } from '@/utils/editor-util';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter, lintGutter } from '@codemirror/lint';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { useTheme } from 'next-themes';

import { REQUEST_BODY_TYPE, type RequestBodyType } from '@/types/collection';

const lineWrap = EditorView.lineWrapping;

export type CodeEditorProps = React.ComponentPropsWithRef<typeof CodeMirror> & {
  bodyType: RequestBodyType;
};
function CodeEditor({ readOnly, height, bodyType, ...props }: CodeEditorProps) {
  const { activeTheme } = use(ActiveThemeProviderContext);
  const { resolvedTheme } = useTheme();
  const [editorTheme, setEditorTheme] = useState(() => getEditorTheme(resolvedTheme));

  function getExtensionsWithBodyType(bodyType: RequestBodyType) {
    switch (bodyType) {
      case REQUEST_BODY_TYPE.JSON:
        return [json(), linter(jsonParseLinter())];

      case REQUEST_BODY_TYPE.TEXT:
      default:
        return [];
    }
  }

  useLayoutEffect(() => {
    if (!resolvedTheme) return;

    requestAnimationFrame(() => {
      setEditorTheme(getEditorTheme(resolvedTheme));
    });
  }, [resolvedTheme, activeTheme]);

  return (
    <CodeMirror
      readOnly={readOnly}
      extensions={[lineWrap, ...getExtensionsWithBodyType(bodyType), readOnly ? [] : lintGutter()]}
      theme={editorTheme}
      height={height || 'auto'}
      {...props}
    />
  );
}

export default CodeEditor;
