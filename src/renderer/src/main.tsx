import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

import './index.css';
import './styles/main.css';

import { AppProvider } from '@/provider/app-init-provider.tsx';
import { ActiveThemeProvider } from '@/provider/theme-provider.tsx';
import { ThemeProvider } from 'next-themes';

import { ConfirmDialog } from '@/components/app/dialog/confirm-dialog.tsx';

import App from './app.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" storageKey="theme-mode" enableSystem>
      <ActiveThemeProvider>
        <Toaster position="top-right" richColors />
        <ConfirmDialog />
        <AppProvider>
          <App />
        </AppProvider>
      </ActiveThemeProvider>
    </ThemeProvider>
  </StrictMode>
);
