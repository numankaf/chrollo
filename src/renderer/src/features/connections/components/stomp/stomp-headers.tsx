import { useMemo } from 'react';
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useFormContext } from 'react-hook-form';

import type { Header } from '@/types/common';
import { useColumnVisibility } from '@/hooks/common/use-column-visibility';
import { Button } from '@/components/common/button';
import { Checkbox } from '@/components/common/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';
import { EditableTextCell, EditableVariableTextCell } from '@/components/common/table';
import { TanstackDataTable } from '@/components/common/tanstack-data-table';

const PROPERTY_KEY = 'connectHeaders';
const COLUMN_VISIBILITY_STORAGE_KEY = 'stomp-headers-column-visibility';

function StompHeaders({ headers }: { headers: Header[] }) {
  const form = useFormContext();
  const [columnVisibility, setColumnVisibility] = useColumnVisibility(COLUMN_VISIBILITY_STORAGE_KEY);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'enabled',
        header: '',
        size: 40,
        cell: ({ row, column, table }) => {
          const key = row.original.key;
          const disabled = !key?.trim();

          if (disabled && row.original.enabled) {
            table.options.meta?.updateData(row.index, column.id, false);
          }

          return (
            <div className="flex items-center justify-center">
              <Checkbox
                checked={row.original.enabled}
                disabled={disabled}
                onCheckedChange={(checked) => {
                  if (!disabled) {
                    table.options.meta?.updateData(row.index, column.id, checked);
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        accessorKey: 'key',
        meta: {
          placeholder: 'Add Key',
        },
        header: ({ table }) => (
          <div className="flex items-center gap-3 justify-between">
            <span>Key</span>
            <Button
              type="button"
              onClick={() => table.options.meta?.addRow()}
              className="w-6 h-6"
              size="icon"
              variant="primary-bordered-ghost"
            >
              <Plus />
            </Button>
          </div>
        ),
        cell: EditableVariableTextCell<Header>,
        size: 500,
      },
      {
        accessorKey: 'value',
        header: 'Value',
        cell: EditableVariableTextCell<Header>,
        size: 500,
        meta: {
          placeholder: 'Add Value',
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: EditableTextCell<Header>,
        size: 500,
        meta: {
          placeholder: 'Add Description',
        },
      },
      {
        accessorKey: 'delete',
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="w-6 h-6 border-none bg-muted/50 hover:bg-muted">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel className="text-sm px-2 py-1">Show columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllLeafColumns()
                  .filter((column) => ['value', 'description'].includes(column.id))
                  .map((column) => {
                    return (
                      <DropdownMenuItem
                        key={column.id}
                        className="flex items-center gap-2 px-2 py-1 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          column.toggleVisibility(!column.getIsVisible());
                        }}
                      >
                        <Checkbox
                          id={`col-${column.id}`}
                          checked={column.getIsVisible()}
                          className="size-3.5"
                          onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        />
                        <label
                          htmlFor={`col-${column.id}`}
                          className="text-sm capitalize flex-1 cursor-pointer select-none"
                        >
                          {column.id}
                        </label>
                      </DropdownMenuItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        size: 40,
        cell: ({ row, table }) => {
          return (
            <div className="flex items-center justify-center">
              <Button
                type="button"
                variant="error-bordered-ghost"
                size="icon"
                className="w-6 h-6"
                onClick={() => table.options.meta?.deleteRow(row.index)}
              >
                <Trash2 />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const updateData = (rowIndex: number, columnId: keyof Header, value: unknown) => {
    const updated = headers.map((row: Header, i: number) => (i === rowIndex ? { ...row, [columnId]: value } : row));
    form.setValue(PROPERTY_KEY, updated, { shouldDirty: true });
  };

  const deleteRow = (rowIndex: number) => {
    const updated = headers.filter((_: Header, i: number) => i !== rowIndex);
    form.setValue(PROPERTY_KEY, updated, { shouldDirty: true });
  };

  const addRow = () => {
    const updated = [...headers, { id: nanoid(), key: '', value: '', description: '', enabled: false }];
    form.setValue(PROPERTY_KEY, updated, { shouldDirty: true });
  };

  return (
    <div className="mx-4 pb-2">
      <p className="text-muted-foreground my-1">Connect Headers</p>
      <TanstackDataTable<Header>
        data={headers}
        columns={columns}
        meta={{ updateData, deleteRow, addRow }}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />
    </div>
  );
}

export default StompHeaders;
