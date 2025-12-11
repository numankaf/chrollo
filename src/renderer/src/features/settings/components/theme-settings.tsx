import { use } from 'react';
import { THEMES_LIST } from '@/constants/theme-constants';
import { ActiveThemeProviderContext } from '@/provider/active-theme-provider';

import type { ThemePreset } from '@/types/layout';
import { Label } from '@/components/common/label';
import { RadioGroup, RadioGroupItem } from '@/components/common/radio-group';
import { ScrollArea, ScrollBar } from '@/components/common/scroll-area';
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

function ThemeSettings() {
  const { activeTheme } = use(ActiveThemeProviderContext);
  return (
    <ScrollArea style={{ height: 'calc(100% - 2rem)' }}>
      <RadioGroup className="m-3 flex items-center justify-evenly gap-4 flex-wrap" defaultValue={activeTheme}>
        {THEMES_LIST.map((themePreset) => (
          <ThemePresetItem themePreset={themePreset} />
        ))}
      </RadioGroup>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}

export default ThemeSettings;
