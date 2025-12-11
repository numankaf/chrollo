import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

import './index.css';
import './styles/main.css';

import { ActiveThemeProvider } from '@/provider/active-theme-provider.tsx';
import { AppProvider } from '@/provider/app-init-provider.tsx';
import { ThemeProvider } from 'next-themes';

import { ConfirmDialog } from '@/components/app/dialog/confirm-dialog.tsx';

import App from './app.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" storageKey="theme-mode" enableSystem disableTransitionOnChange>
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
