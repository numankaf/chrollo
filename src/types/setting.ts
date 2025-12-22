export interface AppSettings {
  discardUnsavedChangesOnClose: boolean;
  formatResponses: boolean;
  showTabIcons: boolean;
  shortcutsEnabled: boolean;
  selectTabItemOnMainSidebar: boolean;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  discardUnsavedChangesOnClose: false,
  formatResponses: true,
  showTabIcons: true,
  shortcutsEnabled: true,
  selectTabItemOnMainSidebar: true,
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
