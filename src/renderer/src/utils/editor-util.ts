import { cssVar } from '@/utils/css-util';
import { vscodeDarkInit, vscodeLightInit } from '@uiw/codemirror-theme-vscode';

import { REQUEST_BODY_TYPE, type RequestBodyType } from '@/types/collection';

export function getEditorTheme(theme: string | undefined) {
  const settings = {
    background: cssVar('--background', theme === 'dark' ? '#1e1e1e' : '#ffffff'),
    foreground: cssVar('--foreground', theme === 'dark' ? '#d4d4d4' : '#000000'),
    caret: cssVar('--foreground', theme === 'dark' ? '#569CD6' : '#5d00ff'),
    selection: cssVar('--muted', theme === 'dark' ? '#264f78' : '#e0e0e0'),
    selectionMatch: cssVar('--muted', theme === 'dark' ? '#264f78' : '#e0e0e0'),
    lineHighlight: cssVar('--muted', theme === 'dark' ? '#2a2d2e' : '#f5f5f5'),
    gutterBackground: cssVar('--background', theme === 'dark' ? '#1e1e1e' : '#fafafa'),
    gutterForeground: cssVar('--muted-foreground', theme === 'dark' ? '#858585' : '#8a919966'),
    gutterBorder: cssVar('--border', theme === 'dark' ? '#2a2d2e' : '#e0e0e0'),
    gutterActiveForeground: cssVar('--foreground', theme === 'dark' ? '#cccccc' : '#e0e0e0'),
  };

  return theme === 'dark' ? vscodeDarkInit({ settings }) : vscodeLightInit({ settings });
}

// old js-beautify code
// export function formatJson(text: string) {
//   try {
//     return beautify(text, {
//       indent_size: 2,
//       space_in_empty_paren: true,
//       e4x: false,
//       end_with_newline: true,
//     });
//   } catch {
//     return text;
//   }
// }

export function formatJson(text: string): string {
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed, null, 2) + '\n';
  } catch {
    return text;
  }
}

export function formatCode(bodyType: RequestBodyType, data: string) {
  const formatted = bodyType === REQUEST_BODY_TYPE.JSON ? formatJson(data) : data;
  return formatted;
}
