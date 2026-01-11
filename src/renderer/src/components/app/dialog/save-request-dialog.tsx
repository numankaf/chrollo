import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/common/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/common/dialog';
import { Field, FieldError, FieldLabel } from '@/components/common/field';
import { Input } from '@/components/common/input';

import { CollectionTreeSelector } from '../selector/collection-tree-selector';

interface SaveRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: { name: string; parentId: string }) => Promise<void> | void;
  defaultName?: string;
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  parentId: z.string().min(1, 'Please select a collection/folder'),
});

type FormValues = z.infer<typeof formSchema>;

export function SaveRequestDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultName = 'New Request',
}: SaveRequestDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultName,
      parentId: '',
    },
  });

  const handleFormSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Request</DialogTitle>
          <DialogDescription className="sr-only">Select a collection or folder to save your request.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Request Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter request name"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="parentId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Save To <span className="text-muted-foreground">Select a collection/folder</span>
                </FieldLabel>
                <CollectionTreeSelector selectedId={field.value} onSelect={(id) => field.onChange(id)} height={250} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <DialogFooter>
            <Button variant="outline" type="button" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
