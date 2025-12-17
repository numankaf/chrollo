import type { ReactNode } from 'react';
import { create } from 'zustand';

import type { AlertDialogAction, AlertDialogCancel } from '@/components/common/alert-dialog';

type ConfirmDialogOptions = {
  header?: string;
  message?: string;
  icon?: React.ReactNode;

  defaultFocus?: 'primary' | 'secondary' | 'cancel';

  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onCancel?: () => void;

  primaryLabel?: ReactNode;
  secondaryLabel?: ReactNode;
  cancelLabel?: ReactNode;

  primaryButtonProps?: React.ComponentProps<typeof AlertDialogAction>;
  secondaryButtonProps?: React.ComponentProps<typeof AlertDialogAction>;
  cancelButtonProps?: React.ComponentProps<typeof AlertDialogCancel>;
};

type ConfirmDialogState = {
  open: boolean;
  options: ConfirmDialogOptions | null;
  show: (opts: ConfirmDialogOptions) => void;
  close: () => void;
};

export const useConfirmDialogStore = create<ConfirmDialogState>((set) => ({
  open: false,
  options: null,
  show: (opts) => set({ open: true, options: opts }),
  close: () => set({ open: false, options: null }),
}));

export function confirmDialog(options: ConfirmDialogOptions) {
  useConfirmDialogStore.getState().show(options);
}
