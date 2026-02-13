import { use, useLayoutEffect, useMemo, useState } from 'react';
import { ActiveThemeProviderContext } from '@/provider/active-theme-provider';
import { getEditorTheme } from '@/utils/editor-util';
import { autocompletion } from '@codemirror/autocomplete';
import { indentWithTab } from '@codemirror/commands';
import { esLint, javascript, javascriptLanguage } from '@codemirror/lang-javascript';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter, lintGutter, type Diagnostic } from '@codemirror/lint';
import CodeMirror, { EditorView, keymap } from '@uiw/react-codemirror';
import { Linter } from 'eslint-linter-browserify';
import globals from 'globals';
import { useTheme } from 'next-themes';

import { useActiveItem } from '@/hooks/app/use-active-item';
import { useTabNavigation } from '@/hooks/app/use-tab-navigation';
import { chrolloCompletions } from '@/components/app/editor/code-mirror/completions/chrollo-completions';
import { variableExtension } from '@/components/app/editor/code-mirror/extensions/variable-extension';

const lineWrap = EditorView.lineWrapping;

function variableSafeLinter(baseLinter: (view: EditorView) => Diagnostic[]) {
  return async (view: EditorView) => {
    const text = view.state.doc.toString();
    if (!text.includes('{{')) return baseLinter(view);

    // Replace {{...}} with '8's of the same length.
    // '8888' is a valid number in JSON and JS, and inside strings it's just characters.
    // This maintains exact character offsets.
    const safeText = text.replace(/\{\{.*?\}\}/g, (match) => '8'.repeat(match.length));

    // Create a temporary safe state to run the linter against
    const safeState = view.state.update({
      changes: { from: 0, to: view.state.doc.length, insert: safeText },
    }).state;

    // Create a proxy view that returns the safe state
    const proxyView = new Proxy(view, {
      get(target, prop, receiver) {
        if (prop === 'state') return safeState;
        return Reflect.get(target, prop, receiver);
      },
    });

    return baseLinter(proxyView as EditorView);
  };
}

export const EDITOR_BODY_TYPE = {
  TEXT: 'TEXT',
  JSON: 'JSON',
  JAVASCRIPT: 'JAVASCRIPT',
} as const;

export type EditorBodyType = (typeof EDITOR_BODY_TYPE)[keyof typeof EDITOR_BODY_TYPE];

export type CodeEditorProps = React.ComponentPropsWithRef<typeof CodeMirror> & {
  bodyType: EditorBodyType;
  enableVariables?: boolean;
  enableResolveFromScript?: boolean;
};
function CodeEditor({
  readOnly,
  height,
  bodyType,
  enableVariables = false,
  enableResolveFromScript = false,
  ...props
}: CodeEditorProps) {
  const { activeTheme } = use(ActiveThemeProviderContext);
  const { activeEnvironment, globalEnvironment } = useActiveItem();
  const { openTab } = useTabNavigation();
  const { resolvedTheme } = useTheme();
  const [editorTheme, setEditorTheme] = useState(() => getEditorTheme(resolvedTheme));

  const extensions = useMemo(() => {
    const _extensions = [lineWrap, keymap.of([indentWithTab])];
    if (!readOnly) {
      _extensions.push(lintGutter());
    }

    switch (bodyType) {
      case EDITOR_BODY_TYPE.JSON:
        _extensions.push(json(), linter(enableVariables ? variableSafeLinter(jsonParseLinter()) : jsonParseLinter()));
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
        const jsLinter = esLint(new Linter(), config);
        _extensions.push(
          javascript(),
          javascriptLanguage.data.of({ autocomplete: chrolloCompletions }),
          linter(enableVariables ? variableSafeLinter(jsLinter) : jsLinter),
          autocompletion()
        );
        break;
      }

      case EDITOR_BODY_TYPE.TEXT:
      default:
        break;
    }
    if (enableVariables) {
      const globalVars = globalEnvironment?.variables.filter((v) => v.enabled) || [];
      const envVars = activeEnvironment?.variables.filter((v) => v.enabled) || [];

      // Environment precedence is higher, so environment variables come first in the merged list
      const mergedVariables = [...envVars, ...globalVars];

      _extensions.push(variableExtension(mergedVariables, enableResolveFromScript, openTab));
    }

    return _extensions;
  }, [bodyType, readOnly, enableVariables, activeEnvironment, globalEnvironment, enableResolveFromScript, openTab]);

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
