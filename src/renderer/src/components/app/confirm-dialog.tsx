import { useConfirmDialogStore } from '@/store/confirm-dialog-store';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/common/alert-dialog';

export function ConfirmDialog() {
  const { open, options, close } = useConfirmDialogStore();

  const handleAccept = () => {
    options?.accept?.();
    close();
  };

  const handleReject = () => {
    options?.reject?.();
    close();
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && close()}>
      <AlertDialogContent className="data-[state=closed]:animate-none!">
        <AlertDialogHeader className="overflow-hidden text-ellipsis">
          <AlertDialogTitle className="overflow-hidden text-ellipsis ">
            {options?.header ?? 'Confirmation'}
          </AlertDialogTitle>
          <AlertDialogDescription className="overflow-hidden text-ellipsis ">
            {options?.message ?? ''}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {options?.icon && <div className="flex items-center gap-2 text-muted-foreground">{options.icon}</div>}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleReject} {...options?.actionButtonProps}>
            {options?.cancelLabel ?? 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAccept} {...options?.cancelButtonProps}>
            {options?.actionLabel ?? 'Accept'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
