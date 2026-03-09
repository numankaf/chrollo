import { use } from 'react';
import { LayoutProviderContext } from '@/provider/layout-provider';

export function useLayout() {
  const ctx = use(LayoutProviderContext);
  if (!ctx) {
    throw new Error('useLayout must be used inside LayoutProvider');
  }
  return ctx;
}
