import ThemeSettings from '@/features/settings/components/theme-settings';
import { BrickWallShield, Info, Keyboard, Palette, Plug, Settings } from 'lucide-react';

import type { SettingsItem } from '@/types/layout';
import ComingSoon from '@/components/app/empty/coming-soon';

export const SETTINGS_NAV_ITEMS: SettingsItem[] = [
  { id: 'general', name: 'General', icon: Settings, component: ComingSoon },
  { id: 'shortcuts', name: 'Shortcuts', icon: Keyboard, component: ComingSoon },
  { id: 'themes', name: 'Themes', icon: Palette, component: ThemeSettings },
  { id: 'plugins', name: 'Plugins', icon: Plug, component: ComingSoon },
  { id: 'certificates', name: 'Certificates', icon: BrickWallShield, component: ComingSoon },
  { id: 'about', name: 'About', icon: Info, component: ComingSoon },
];
