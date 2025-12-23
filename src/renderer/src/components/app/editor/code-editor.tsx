import { use, useLayoutEffect, useMemo, useState } from 'react';
import { ActiveThemeProviderContext } from '@/provider/active-theme-provider';
import { chrolloCompletions } from '@/utils/chrollo-completions';
import { getEditorTheme } from '@/utils/editor-util';
import { autocompletion } from '@codemirror/autocomplete';
import { indentWithTab } from '@codemirror/commands';
import { esLint, javascript, javascriptLanguage } from '@codemirror/lang-javascript';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter, lintGutter } from '@codemirror/lint';
import CodeMirror, { EditorView, keymap } from '@uiw/react-codemirror';
import { Linter } from 'eslint-linter-browserify';
import globals from 'globals';
import { useTheme } from 'next-themes';

const lineWrap = EditorView.lineWrapping;

export const EDITOR_BODY_TYPE = {
  TEXT: 'TEXT',
  JSON: 'JSON',
  JAVASCRIPT: 'JAVASCRIPT',
} as const;

export type EditorBodyType = (typeof EDITOR_BODY_TYPE)[keyof typeof EDITOR_BODY_TYPE];

export type CodeEditorProps = React.ComponentPropsWithRef<typeof CodeMirror> & {
  bodyType: EditorBodyType;
};
function CodeEditor({ readOnly, height, bodyType, ...props }: CodeEditorProps) {
  const { activeTheme } = use(ActiveThemeProviderContext);
  const { resolvedTheme } = useTheme();
  const [editorTheme, setEditorTheme] = useState(() => getEditorTheme(resolvedTheme));

  const extensions = useMemo(() => {
    const _extensions = [lineWrap, keymap.of([indentWithTab])];
    if (!readOnly) {
      _extensions.push(lintGutter());
    }

    switch (bodyType) {
      case EDITOR_BODY_TYPE.JSON:
        _extensions.push(json(), linter(jsonParseLinter()));
        break;

      case EDITOR_BODY_TYPE.JAVASCRIPT: {
        const config = {
          languageOptions: {
            globals: {
              ...globals.node,
            },
            parserOptions: {
              ecmaVersion: 2022,
              sourceType: 'module',
            },
          },
          rules: {},
        };
        _extensions.push(
          javascript(),
          javascriptLanguage.data.of({ autocomplete: chrolloCompletions }),
          linter(esLint(new Linter(), config)),
          autocompletion()
        );
        break;
      }

      case EDITOR_BODY_TYPE.TEXT:
      default:
        break;
    }
    return _extensions;
  }, [bodyType, readOnly]);

  useLayoutEffect(() => {
    if (!resolvedTheme) return;

    requestAnimationFrame(() => {
      setEditorTheme(getEditorTheme(resolvedTheme));
    });
  }, [resolvedTheme, activeTheme]);

  return (
    <CodeMirror
      key={bodyType}
      readOnly={readOnly}
      extensions={extensions}
      theme={editorTheme}
      height={height || 'auto'}
      {...props}
    />
  );
}

export default CodeEditor;
