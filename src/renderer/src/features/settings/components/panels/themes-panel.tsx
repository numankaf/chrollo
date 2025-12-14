import { use } from 'react';
import { THEMES_LIST } from '@/constants/theme-constants';
import { ActiveThemeProviderContext } from '@/provider/active-theme-provider';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import type { ThemePreset } from '@/types/layout';
import { Button } from '@/components/common/button';
import { Label } from '@/components/common/label';
import { RadioGroup, RadioGroupItem } from '@/components/common/radio-group';
import { ScrollArea } from '@/components/common/scroll-area';
import { ThemePreviewSvg } from '@/components/app/theme/theme-preview-svg';

function ThemePresetItem({ themePreset }: { themePreset: ThemePreset }) {
  const { activeTheme, setActiveTheme } = use(ActiveThemeProviderContext);
  return (
    <div className="flex flex-col gap-2">
      <div className={`${activeTheme === themePreset.theme && 'border-primary!'} border border-transparent rounded-xs`}>
        <ThemePreviewSvg theme={themePreset.theme} />
      </div>
      <div
        className="w-full flex items-center gap-3 cursor-pointer"
        onClick={() => {
          setActiveTheme(themePreset.theme);
        }}
      >
        <RadioGroupItem className="cursor-pointer" value={themePreset.theme} id={themePreset.theme} />
        <Label className="cursor-pointer" htmlFor={themePreset.theme}>
          {themePreset.name}
        </Label>
      </div>
    </div>
  );
}

function ThemesPanel() {
  const { setTheme, resolvedTheme: theme } = useTheme();

  const { activeTheme } = use(ActiveThemeProviderContext);
  return (
    <ScrollArea style={{ height: 'calc(100% - 2rem)' }}>
      <div className="space-y-2 m-4">
        <p>Theme Mode</p>
        <div className="flex gap-4">
          <Button
            variant={theme === 'light' ? 'primary-bordered-ghost' : 'outline'}
            onClick={() => {
              setTheme('light');
            }}
          >
            <Sun />
            <span>Day Theme</span>
          </Button>
          <Button
            variant={theme === 'dark' ? 'primary-bordered-ghost' : 'outline'}
            onClick={() => {
              setTheme('dark');
            }}
          >
            <Moon />
            <span>Night Theme</span>
          </Button>
        </div>
      </div>

      <div className="space-y-2 m-4">
        <p>Theme Selection</p>
        <RadioGroup className="flex items-center justify-between gap-4 flex-wrap" defaultValue={activeTheme}>
          {THEMES_LIST.map((themePreset) => (
            <ThemePresetItem key={themePreset.theme} themePreset={themePreset} />
          ))}
        </RadioGroup>
      </div>
    </ScrollArea>
  );
}

export default ThemesPanel;
