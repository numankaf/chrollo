import type { Theme } from '@/types/layout';

interface ThemePreviewSvgProps {
  theme: Theme;
}

export function ThemePreviewSvg({ theme }: ThemePreviewSvgProps) {
  return (
    <svg width="180" height="120" viewBox="0 0 180 100" className={`${theme}`}>
      <rect x="1" y="1" width="168" height="98" rx="2" fill="var(--background)" stroke="var(--border)" />

      <rect x="1" y="1" width="168" height="10" rx="2" fill="var(--sidebar)" />
      <line x1="1" y1="11" x2="169" y2="11" stroke="var(--border)" />

      <rect x="70" y="2.5" width="40" height="6" rx="2" fill="var(--sidebar)" stroke="var(--border)" />
      <rect x="5" y="3" width="20" height="4" rx="2" fill="var(--accent)" />
      <rect x="28" y="3" width="20" height="4" rx="2" fill="var(--accent)" />
      <circle cx="150" cy="5" r="3" fill="var(--muted)" />
      <circle cx="160" cy="5" r="3" fill="var(--muted)" />

      <rect x="1" y="12" width="50" height="88" rx="2" fill="var(--sidebar)" />
      <line x1="1" y1="99" x2="50" y2="99" stroke="var(--border)" />
      <line x1="50" y1="10" x2="50" y2="98" stroke="var(--border)" />
      <line x1="15" y1="10" x2="15" y2="98" stroke="var(--border)" />

      <rect x="2" y="14" width="11" height="10" rx="1" fill="var(--sidebar-primary)" />
      <rect x="2" y="26" width="11" height="10" rx="1" fill="var(--accent)" />
      <rect x="2" y="38" width="11" height="10" rx="1" fill="var(--accent)" />

      <rect x="18" y="14" width="30" height="5" rx="1" fill="var(--sidebar-primary)" />
      <rect x="18" y="20" width="30" height="5" rx="1" fill="var(--accent)" />
      <rect x="18" y="26" width="30" height="5" rx="1" fill="var(--accent)" />

      <rect x="60" y="30" width="25" height="5" rx="2" fill="var(--muted)" />
      <rect x="60" y="40" width="80" height="8" rx="2" fill="var(--input)" stroke="var(--border)" />
      <rect x="145" y="40" width="15" height="8" rx="2" fill="var(--primary)" />

      <rect x="60" y="55" width="20" height="5" rx="2" fill="var(--muted)" />
      <line x1="60" y1="65" x2="80" y2="65" stroke="var(--primary)" />
      <rect x="85" y="55" width="20" height="5" rx="2" fill="var(--muted)" />
      <rect x="110" y="55" width="20" height="5" rx="2" fill="var(--muted)" />
    </svg>
  );
}
