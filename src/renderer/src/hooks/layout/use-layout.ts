import { useContext } from 'react';
import { LayoutProviderContext } from '@/provider/layout-provider';

export function useLayout() {
  const ctx = useContext(LayoutProviderContext);
  if (!ctx) {
    throw new Error('useLayout must be used inside LayoutProvider');
  }
  return ctx;
}
