import { THEMES } from '@/types/layout';
import { ThemePreviewSvg } from '@/components/app/theme/theme-preview-svg';

function ThemeSettings() {
  return (
    <div className="flex gap-3">
      <ThemePreviewSvg theme={THEMES.DEFAULT} />
      <ThemePreviewSvg theme={THEMES.SPOTIFY} />
      <ThemePreviewSvg theme={THEMES.TWITTER} />
      <ThemePreviewSvg theme={THEMES.CLAUDE} />
    </div>
  );
}

export default ThemeSettings;
