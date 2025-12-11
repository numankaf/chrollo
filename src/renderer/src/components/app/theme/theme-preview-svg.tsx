import type { Theme } from '@/types/layout';

interface ThemePreviewSvgProps {
  theme: Theme;
}

export function ThemePreviewSvg({ theme }: ThemePreviewSvgProps) {
  return (
    <svg width="180" height="120" viewBox="0 0 180 120" className={`${theme}`}>
      <rect x="1" y="1" width="180" height="120" fill="var(--background)" />

      <rect x="1" y="1" width="179" height="10" fill="var(--sidebar)" stroke="var(--border)" />

      <rect x="70" y="2.5" width="40" height="6" rx="2" fill="var(--sidebar)" stroke="var(--border)" />
      <rect x="5" y="3" width="20" height="4" rx="2" fill="var(--accent)" />
      <rect x="28" y="3" width="20" height="4" rx="2" fill="var(--accent)" />
      <circle cx="160" cy="5" r="3" fill="var(--accent)" />
      <circle cx="170" cy="5" r="3" fill="var(--accent)" />

      <rect x="1" y="11" width="50" height="120" rx="2" fill="var(--sidebar)" stroke="var(--border)" />
      <line x1="1" y1="120" x2="180" y2="120" stroke="var(--border)" />
      <line x1="15" y1="11" x2="15" y2="120" stroke="var(--border)" />
      <line x1="180" y1="11" x2="180" y2="120" stroke="var(--border)" />

      <rect x="3" y="16" width="10" height="10" rx="1" fill="var(--sidebar-primary)" />
      <rect x="3" y="29" width="10" height="10" rx="1" fill="var(--accent)" />
      <rect x="3" y="42" width="10" height="10" rx="1" fill="var(--accent)" />

      <rect x="18" y="14" width="30" height="5" rx="1" fill="var(--sidebar-primary)" />
      <rect x="18" y="21" width="30" height="5" rx="1" fill="var(--accent)" />
      <rect x="18" y="28" width="30" height="5" rx="1" fill="var(--accent)" />

      <rect x="60" y="30" width="30" height="5" rx="2" fill="var(--muted)" />
      <rect x="60" y="40" width="90" height="8" rx="2" fill="var(--input)" stroke="var(--border)" />
      <rect x="155" y="40" width="18" height="8" rx="2" fill="var(--primary)" />

      <rect x="60" y="55" width="20" height="5" rx="2" fill="var(--muted)" />
      <line x1="60" y1="65" x2="80" y2="65" stroke="var(--primary)" />
      <rect x="85" y="55" width="20" height="5" rx="2" fill="var(--muted)" />
      <rect x="110" y="55" width="20" height="5" rx="2" fill="var(--muted)" />
    </svg>
  );
}
