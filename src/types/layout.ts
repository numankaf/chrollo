import type { ComponentType } from 'react';
import { type LucideProps } from 'lucide-react';

import type { BaseModelType } from '@/types/base';
import type { CollectionItem } from '@/types/collection';
import type { Connection } from '@/types/connection';
import type { Environment } from '@/types/environment';
import type { Workspace } from '@/types/workspace';

export type TabItem = Workspace | Connection | CollectionItem | Environment;

export interface Tab {
  readonly id: string;
  readonly modelType: BaseModelType;
  readonly workspaceId?: string;
}

export type SidebarItem = {
  modelType: BaseModelType;
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
  component: ComponentType;
};

export type SettingsItem = {
  id: string;
  name: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
  component: ComponentType;
};

export const THEMES = {
  AMETHYST_HAZE: 'theme-amethyst-haze',
  CAFFEINE: 'theme-caffeine',
  CLAUDE: 'theme-claude',
  DARKMATTER: 'theme-darkmatter',
  DEFAULT: 'theme-default',
  GHIBLI_STUDIO: 'theme-ghibli-studio',
  GRAPHITE: 'theme-graphite',
  KODAMA_GROVE: 'theme-kodama-grove',
  MATERIAL_DESIGN: 'theme-material-design',
  NATURE: 'theme-nature',
  NOTEBOOK: 'theme-notebook',
  PERPETUITY: 'theme-perpetuity',
  SLACK: 'theme-slack',
  SPOTIFY: 'theme-spotify',
  TWITTER: 'theme-twitter',
  VS_CODE: 'theme-vs-code',
} as const;

export type Theme = (typeof THEMES)[keyof typeof THEMES];

export type ThemePreset = {
  name: string;
  theme: Theme;
};
