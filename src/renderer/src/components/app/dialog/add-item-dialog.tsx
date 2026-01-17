import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/common/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/common/dialog';
import { Field, FieldError, FieldLabel } from '@/components/common/field';
import { Input } from '@/components/common/input';

interface AddItemDialogProps {
  title: string;
  inputLabel?: string;
  inputRequiredLabel?: string;
  inputPlaceholder?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: { name: string }) => Promise<void> | void;
  defaultValue?: string;
}

export function AddItemDialog({
  title,
  inputLabel = 'Name',
  inputRequiredLabel = 'Name is required',
  inputPlaceholder = 'Enter a name',
  open,
  onOpenChange,
  onSubmit,
  defaultValue = '',
}: AddItemDialogProps) {
  const formSchema = z.object({
    name: z.string().min(1, inputRequiredLabel),
  });

  const form = useForm<{ name: string }>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: defaultValue },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onKeyDown={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">Add a new item here.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-3">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{inputLabel}</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder={inputPlaceholder}
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
