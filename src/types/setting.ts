export const EDITOR_THEMES = {
  vscode: 'VS Code',
  xcode: 'Xcode',
  material: 'Material',
  github: 'GitHub',
  tokyoNight: 'Tokyo Night',
  dracula: 'Dracula',
  eclipse: 'Eclipse',
  sublime: 'Sublime',
} as const;

export type EditorTheme = keyof typeof EDITOR_THEMES;

export interface AppSettings {
  discardUnsavedChangesOnClose: boolean;
  formatResponses: boolean;
  showTabIcons: boolean;
  shortcutsEnabled: boolean;
  selectTabItemOnMainSidebar: boolean;
  editorTheme: EditorTheme;
  editorTabSize: number;
  editorFontSize: number;
  editorAutoCloseBrackets: boolean;
  editorShowLineNumbers: boolean;
  editorNativeThemeBackground: boolean;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  discardUnsavedChangesOnClose: false,
  formatResponses: true,
  showTabIcons: true,
  shortcutsEnabled: true,
  selectTabItemOnMainSidebar: true,
  editorTheme: 'vscode',
  editorTabSize: 2,
  editorFontSize: 14,
  editorAutoCloseBrackets: true,
  editorShowLineNumbers: true,
  editorNativeThemeBackground: false,
};

export interface SettingItem {
  key: keyof AppSettings;
  title: string;
  description: string;
}
export interface ShortcutItem {
  key: keyof AppSettings;
  title: string;
}
