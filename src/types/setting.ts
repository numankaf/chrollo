export interface AppSettings {
  discardUnsavedChangesOnClose: boolean;
  formatResponses: boolean;
  showTabIcons: boolean;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  discardUnsavedChangesOnClose: false,
  formatResponses: true,
  showTabIcons: true,
};

export interface SettingItem {
  key: keyof AppSettings;
  title: string;
  description: string;
}
