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

  const handlePrimaryClick = () => {
    options?.onPrimaryAction?.();
    close();
  };

  const handleSecondaryClick = () => {
    options?.onSecondaryAction?.();
    close();
  };

  const handleCancelClick = () => {
    options?.onCancel?.();
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

        <AlertDialogFooter className="justify-between!">
          <div>
            {options?.secondaryLabel && (
              <AlertDialogCancel onClick={handleSecondaryClick} {...options?.secondaryButtonProps}>
                {options.secondaryLabel}
              </AlertDialogCancel>
            )}
          </div>

          <div className="flex items-center gap-2">
            <AlertDialogCancel onClick={handleCancelClick} {...options?.cancelButtonProps}>
              {options?.cancelLabel ?? 'Cancel'}
            </AlertDialogCancel>

            <AlertDialogAction onClick={handlePrimaryClick} {...options?.primaryButtonProps}>
              {options?.primaryLabel ?? 'Accept'}
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
