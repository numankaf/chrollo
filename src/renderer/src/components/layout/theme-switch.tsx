import { Button } from '@/components/common/button';
import { Moon, Sun } from 'lucide-react';
import { use } from 'react';
import { ThemeProviderContext } from '../../provider/theme-provider';

const ThemeSwitcher = () => {
  const { theme, setTheme } = use(ThemeProviderContext);

  const handleChangeTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button variant="ghost" onClick={handleChangeTheme}>
      {theme === 'dark' ? <Moon /> : <Sun />}
    </Button>
  );
};

export default ThemeSwitcher;
