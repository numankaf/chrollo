import { createContext, useEffect, useState } from 'react';

import type { Theme } from '@/types/layout';

export type AcviteThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export type ActiveThemeProviderState = {
  activeTheme: Theme;
  setActiveTheme: (theme: Theme) => void;
};

const initialState: ActiveThemeProviderState = {
  activeTheme: 'theme-default',
  setActiveTheme: () => null,
};

export const ActiveThemeProviderContext = createContext<ActiveThemeProviderState>(initialState);

export function ActiveThemeProvider({
  children,
  defaultTheme = 'theme-default',
  storageKey = 'theme',
  ...props
}: AcviteThemeProviderProps) {
  const [activeTheme, setActiveTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme;
    return storedTheme || defaultTheme;
  });

  useEffect(() => {
    Array.from(document.body.classList)
      .filter((className) => className.startsWith('theme-'))
      .forEach((className) => {
        document.body.classList.remove(className);
      });

    document.body.classList.add(activeTheme);
  }, [activeTheme]);

  const value = {
    activeTheme,
    setActiveTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setActiveTheme(theme);
    },
  };

  return (
    <ActiveThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ActiveThemeProviderContext.Provider>
  );
}
