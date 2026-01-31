import { cssVar } from '@/utils/css-util';
import { vscodeDarkInit, vscodeLightInit } from '@uiw/codemirror-theme-vscode';
import { js_beautify } from 'js-beautify';

import { REQUEST_BODY_TYPE, type RequestBodyType } from '@/types/collection';
import { ENVIRONMENT_VARIABLE_MATCH_REGEX } from '@/types/common';

export function getEditorTheme(theme: string | undefined) {
  const settings = {
    background: cssVar('--background', theme === 'dark' ? '#1e1e1e' : '#ffffff'),
    foreground: cssVar('--foreground', theme === 'dark' ? '#d4d4d4' : '#000000'),
    caret: cssVar('--foreground', theme === 'dark' ? '#569CD6' : '#5d00ff'),
    selection: cssVar('--accent', theme === 'dark' ? '#264f78' : '#e0e0e0'),
    selectionMatch: cssVar('--accent', theme === 'dark' ? '#264f78' : '#e0e0e0'),
    gutterBackground: cssVar('--background', theme === 'dark' ? '#1e1e1e' : '#fafafa'),
    gutterForeground: cssVar('--muted-foreground', theme === 'dark' ? '#858585' : '#8a919966'),
    gutterBorder: cssVar('--border', theme === 'dark' ? '#2a2d2e' : '#e0e0e0'),
    gutterActiveForeground: cssVar('--foreground', theme === 'dark' ? '#cccccc' : '#e0e0e0'),
  };

  return theme === 'dark' ? vscodeDarkInit({ settings }) : vscodeLightInit({ settings });
}

export function formatJs(text: string) {
  try {
    // Protect {{VAR}} tokens from being mangled by beautifier
    const placeholders: string[] = [];
    const protectedText = text.replace(ENVIRONMENT_VARIABLE_MATCH_REGEX, (match) => {
      placeholders.push(match);
      return `__CHROLLO_VAR_${placeholders.length - 1}__`;
    });

    const formatted = js_beautify(protectedText, {
      indent_size: 2,
      space_in_empty_paren: true,
      e4x: false,
      end_with_newline: true,
    });

    // Restore original tokens
    return formatted.replace(/__CHROLLO_VAR_(\d+)__/g, (_, index) => {
      return placeholders[parseInt(index, 10)];
    });
  } catch {
    return text;
  }
}

export function formatJson(text: string): string {
  try {
    // JSON.parse will fail if variables are used outside of quotes: {"a": {{VAR}}}
    // We protect them by wrapping in placeholders that look like strings if they aren't already
    const placeholders: string[] = [];
    const protectedText = text.replace(ENVIRONMENT_VARIABLE_MATCH_REGEX, (match) => {
      placeholders.push(match);
      return `"__CHROLLO_VAR_${placeholders.length - 1}__"`;
    });

    const parsed = JSON.parse(protectedText);
    const formatted = JSON.stringify(parsed, null, 2) + '\n';

    // Restore original tokens
    return formatted.replace(/"__CHROLLO_VAR_(\d+)__"/g, (_, index) => {
      return placeholders[parseInt(index, 10)];
    });
  } catch {
    // Fallback if parsing still fails (e.g. invalid JSON even with placeholders)
    return text;
  }
}

export function formatCode(bodyType: RequestBodyType, data: string) {
  if (bodyType === REQUEST_BODY_TYPE.JSON) return formatJson(data);
  if ((bodyType as string) === 'JAVASCRIPT') return formatJs(data);
  return data;
}
