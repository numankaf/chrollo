import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/common/button';

function ThemeSwitcher() {
  const { setTheme, resolvedTheme: theme } = useTheme();

  const handleChangeTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button variant="ghost" onClick={handleChangeTheme}>
      {theme === 'dark' ? <Moon /> : <Sun />}
    </Button>
  );
}

export default ThemeSwitcher;
