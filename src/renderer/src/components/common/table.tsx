import * as React from 'react';
import type { CellContext } from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import { Input } from '@/components/common/input';
import { VariableInput } from '@/components/common/variable-input';

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto ">
      <table data-slot="table" className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return <thead data-slot="table-header" className={cn('[&_tr]:border-b', className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return <tbody data-slot="table-body" className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn('hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors', className)}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  );
}

function EditableTextCell<T>({ getValue, row, column, table }: CellContext<T, unknown>) {
  const initialValue = getValue() as string;
  const [value, setValue] = React.useState(initialValue);
  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const placeholder = (column.columnDef.meta as { placeholder?: string } | undefined)?.placeholder;

  return (
    <Input
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      onBlur={onBlur}
      placeholder={placeholder}
      className="focus-visible:ring-ring px-2 py-1 h-8 w-full border border-transparent bg-background! rounded-none focus-visible:ring-1 text-sm"
      aria-label="editable-text-input"
    />
  );
}

function EditableVariableTextCell<T>({ getValue, row, column, table }: CellContext<T, unknown>) {
  const initialValue = getValue() as string;
  const [value, setValue] = React.useState(initialValue);
  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const placeholder = (column.columnDef.meta as { placeholder?: string } | undefined)?.placeholder;

  return (
    <VariableInput
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      containerClassName="rounded-none"
      className=" px-2 py-1 h-8 w-full border border-transparent rounded-none text-sm "
      onBlur={onBlur}
      placeholder={placeholder}
      aria-label="editable-variable-text-input"
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return (
    <caption data-slot="table-caption" className={cn('text-muted-foreground mt-4 text-sm', className)} {...props} />
  );
}

export {
  EditableTextCell,
  EditableVariableTextCell,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
