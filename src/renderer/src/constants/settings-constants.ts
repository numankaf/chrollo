import AboutPanel from '@/features/settings/components/panels/about-panel';
import PluginsPanel from '@/features/settings/components/panels/plugins-panel';
import ThemesPanel from '@/features/settings/components/panels/themes-panel';
import { BrickWallShield, Info, Keyboard, Palette, Plug, Settings } from 'lucide-react';

import type { SettingsItem } from '@/types/layout';
import ComingSoon from '@/components/app/empty/coming-soon';

export const SETTINGS_NAV_ITEMS: SettingsItem[] = [
  { id: 'general', name: 'General', icon: Settings, component: ComingSoon },
  { id: 'shortcuts', name: 'Shortcuts', icon: Keyboard, component: ComingSoon },
  { id: 'themes', name: 'Themes', icon: Palette, component: ThemesPanel },
  { id: 'plugins', name: 'Plugins', icon: Plug, component: PluginsPanel },
  { id: 'certificates', name: 'Certificates', icon: BrickWallShield, component: ComingSoon },
  { id: 'about', name: 'About', icon: Info, component: AboutPanel },
];
