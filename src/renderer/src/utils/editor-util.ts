import { useAppConfigStore } from '@/store/app-config-store';
import { cssVar } from '@/utils/css-util';
import {
  draculaInit,
  eclipseInit,
  githubDarkInit,
  githubLightInit,
  materialDarkInit,
  materialLightInit,
  sublimeInit,
  tokyoNightDayInit,
  tokyoNightInit,
  vscodeDarkInit,
  vscodeLightInit,
  xcodeDarkInit,
  xcodeLightInit,
} from '@uiw/codemirror-themes-all';
import { js_beautify } from 'js-beautify';

import { REQUEST_BODY_TYPE, type RequestBodyType } from '@/types/collection';
import { ENVIRONMENT_VARIABLE_MATCH_REGEX } from '@/types/common';
import type { EditorTheme } from '@/types/setting';

const THEME_INIT_MAP: Record<EditorTheme, { dark: typeof vscodeDarkInit; light: typeof vscodeLightInit }> = {
  vscode: { dark: vscodeDarkInit, light: vscodeLightInit },
  xcode: { dark: xcodeDarkInit, light: xcodeLightInit },
  material: { dark: materialDarkInit, light: materialLightInit },
  github: { dark: githubDarkInit, light: githubLightInit },
  tokyoNight: { dark: tokyoNightInit, light: tokyoNightDayInit },
  dracula: { dark: draculaInit, light: draculaInit },
  eclipse: { dark: eclipseInit, light: eclipseInit },
  sublime: { dark: sublimeInit, light: sublimeInit },
};

export function getEditorTheme(
  editorThemeName: EditorTheme,
  resolvedTheme: string | undefined,
  nativeBackground: boolean
) {
  const isDark = resolvedTheme !== 'light';

  const pair = THEME_INIT_MAP[editorThemeName] ?? THEME_INIT_MAP.vscode;
  const themeInit = isDark ? pair.dark : pair.light;

  if (nativeBackground) {
    return themeInit({});
  }

  const settings = {
    background: cssVar('--background', isDark ? '#1e1e1e' : '#ffffff'),
    foreground: cssVar('--foreground', isDark ? '#d4d4d4' : '#000000'),
    caret: cssVar('--foreground', isDark ? '#569CD6' : '#5d00ff'),
    selection: cssVar('--accent', isDark ? '#264f78' : '#e0e0e0'),
    selectionMatch: cssVar('--accent', isDark ? '#264f78' : '#e0e0e0'),
    gutterBackground: cssVar('--background', isDark ? '#1e1e1e' : '#fafafa'),
    gutterForeground: cssVar('--muted-foreground', isDark ? '#858585' : '#8a919966'),
    gutterBorder: cssVar('--border', isDark ? '#2a2d2e' : '#e0e0e0'),
    gutterActiveForeground: cssVar('--foreground', isDark ? '#cccccc' : '#e0e0e0'),
  };

  return themeInit({ settings });
}

function getIndentSize(): number {
  return useAppConfigStore.getState().applicationSettings.editorTabSize;
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
      indent_size: getIndentSize(),
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
    const placeholders: { original: string; quoted: boolean }[] = [];
    // Match {{VAR}} both inside quotes ("{{VAR}}") and unquoted ({{VAR}}).
    // Both are replaced with a quoted placeholder string for valid JSON parsing.
    const protectedText = text.replace(
      /"(\{\{\s*[a-zA-Z_][\w.-]*\s*\}\})"|(\{\{\s*[a-zA-Z_][\w.-]*\s*\}\})/g,
      (_, quoted, unquoted) => {
        placeholders.push({ original: quoted || unquoted, quoted: !!quoted });
        return `"__CHROLLO_VAR_${placeholders.length - 1}__"`;
      }
    );

    const parsed = JSON.parse(protectedText);
    const formatted = JSON.stringify(parsed, null, getIndentSize()) + '\n';

    // Restore original tokens, re-wrapping in quotes if originally quoted
    return formatted.replace(/"__CHROLLO_VAR_(\d+)__"/g, (_, index) => {
      const { original, quoted } = placeholders[parseInt(index, 10)];
      return quoted ? `"${original}"` : original;
    });
  } catch {
    return text;
  }
}

export function formatCode(bodyType: RequestBodyType, data: string) {
  if (bodyType === REQUEST_BODY_TYPE.JSON) return formatJson(data);
  if ((bodyType as string) === 'JAVASCRIPT') return formatJs(data);
  return data;
}
