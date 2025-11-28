import type { AlertDialogAction, AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { create } from 'zustand';

type ConfirmDialogOptions = {
  header?: string;
  message?: string;
  icon?: React.ReactNode;
  defaultFocus?: 'accept' | 'cancel';
  accept?: () => void;
  reject?: () => void;
  actionLabel?: string;
  cancelLabel?: string;
  actionButtonProps?: React.ComponentProps<typeof AlertDialogAction>;
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
