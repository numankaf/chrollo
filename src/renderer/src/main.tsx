import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

import './index.css';

import App from './app.tsx';
import { ThemeProvider } from './provider/theme-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Toaster position="top-right" richColors />
      <App />
    </ThemeProvider>
  </StrictMode>
);
