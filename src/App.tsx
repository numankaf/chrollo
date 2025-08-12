import { use } from 'react';
import './App.css';
import { ThemeProviderContext } from './context/ThemeProviderContext';

function App() {
  const { theme, setTheme } = use(ThemeProviderContext);

  return (
    <div className="bg-background">
      <button
        className=" p-3 rounded-md cursor-pointer bg-primary"
        onClick={() => (theme === 'dark' ? setTheme('light') : setTheme('dark'))}
      >
        Change Theme
      </button>
      <div>Subscriptions</div>
    </div>
  );
}

export default App;
