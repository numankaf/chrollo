import { use, useLayoutEffect, useMemo, useState } from 'react';
import { ActiveThemeProviderContext } from '@/provider/active-theme-provider';
import { useAppConfigStore } from '@/store/app-config-store';
import { getEditorTheme } from '@/utils/editor-util';
import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { indentWithTab } from '@codemirror/commands';
import { esLint, javascript, javascriptLanguage } from '@codemirror/lang-javascript';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter, lintGutter, type Diagnostic } from '@codemirror/lint';
import CodeMirror, { EditorState, EditorView, keymap, lineNumbers } from '@uiw/react-codemirror';
import { Linter } from 'eslint-linter-browserify';
import globals from 'globals';
import { useTheme } from 'next-themes';
import { useShallow } from 'zustand/react/shallow';

import { useActiveItem } from '@/hooks/app/use-active-item';
import useActiveRequestLocalVarKeys from '@/hooks/app/use-active-request-local-var-keys';
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
};
function CodeEditor({ readOnly, height, bodyType, enableVariables = false, ...props }: CodeEditorProps) {
  const { activeTheme } = use(ActiveThemeProviderContext);
  const { activeEnvironment, globalEnvironment } = useActiveItem();
  const { openTab } = useTabNavigation();
  const { resolvedTheme } = useTheme();
  const editorSettings = useAppConfigStore(
    useShallow((state) => ({
      editorTheme: state.applicationSettings.editorTheme,
      editorTabSize: state.applicationSettings.editorTabSize,
      editorFontSize: state.applicationSettings.editorFontSize,
      editorAutoCloseBrackets: state.applicationSettings.editorAutoCloseBrackets,
      editorShowLineNumbers: state.applicationSettings.editorShowLineNumbers,
      editorNativeThemeBackground: state.applicationSettings.editorNativeThemeBackground,
    }))
  );
  const [cmTheme, setCmTheme] = useState(() =>
    getEditorTheme(editorSettings.editorTheme, resolvedTheme, editorSettings.editorNativeThemeBackground)
  );
  const scriptLocalVarKeys = useActiveRequestLocalVarKeys();

  const editorKey = `${bodyType}-${editorSettings.editorShowLineNumbers}-${editorSettings.editorAutoCloseBrackets}`;

  const extensions = useMemo(() => {
    const _extensions = [
      lineWrap,
      keymap.of([indentWithTab]),
      EditorState.tabSize.of(editorSettings.editorTabSize),
      EditorView.theme({
        '&': { fontSize: `${editorSettings.editorFontSize}px` },
        '.cm-gutters': { fontSize: `${editorSettings.editorFontSize}px` },
      }),
    ];

    if (editorSettings.editorShowLineNumbers) {
      _extensions.push(lineNumbers());
    }

    if (editorSettings.editorAutoCloseBrackets) {
      _extensions.push(closeBrackets());
    }

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
      _extensions.push(
        variableExtension(
          envVars,
          globalVars,
          scriptLocalVarKeys,
          openTab,
          activeEnvironment ?? undefined,
          globalEnvironment ?? undefined
        )
      );
    }

    return _extensions;
  }, [
    bodyType,
    readOnly,
    enableVariables,
    activeEnvironment,
    globalEnvironment,
    scriptLocalVarKeys,
    openTab,
    editorSettings.editorTabSize,
    editorSettings.editorFontSize,
    editorSettings.editorAutoCloseBrackets,
    editorSettings.editorShowLineNumbers,
  ]);

  useLayoutEffect(() => {
    if (!resolvedTheme) return;

    requestAnimationFrame(() => {
      setCmTheme(getEditorTheme(editorSettings.editorTheme, resolvedTheme, editorSettings.editorNativeThemeBackground));
    });
  }, [resolvedTheme, activeTheme, editorSettings.editorTheme, editorSettings.editorNativeThemeBackground]);

  return (
    <CodeMirror
      key={editorKey}
      readOnly={readOnly}
      extensions={extensions}
      theme={cmTheme}
      height={height || 'auto'}
      {...props}
    />
  );
}

export default CodeEditor;
