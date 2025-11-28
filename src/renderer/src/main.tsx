import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

import './index.css';
import './styles/main.css';

import { AppProvider } from '@/provider/app-init-provider.tsx';

import { ConfirmDialog } from '@/components/app/confirm-dialog.tsx';

import App from './app.tsx';
import { ThemeProvider } from './provider/theme-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Toaster position="top-right" richColors />
      <ConfirmDialog />
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeProvider>
  </StrictMode>
);
