import { useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useFormContext } from 'react-hook-form';

import type { Header } from '@/types/common';
import { Button } from '@/components/common/button';
import { Checkbox } from '@/components/common/checkbox';
import { EditableTextCell } from '@/components/common/table';
import { TanstackDataTable } from '@/components/common/tanstack-data-table';

const PROPERTY_KEY = 'headers';

function RequestHeaders({ headers }: { headers: Header[] }) {
  const form = useFormContext();
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
                className="cursor-pointer"
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
        cell: EditableTextCell<Header>,
        size: 500,
      },
      {
        accessorKey: 'value',
        header: 'Value',
        cell: EditableTextCell<Header>,
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
        header: '',
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
    const updated = [...headers, { id: nanoid(8), key: '', value: '', description: '', enabled: false }];
    form.setValue(PROPERTY_KEY, updated, { shouldDirty: true });
  };

  return (
    <div className="mx-3">
      <p className="text-muted-foreground my-1">Headers</p>
      <TanstackDataTable<Header> data={headers} columns={columns} meta={{ updateData, deleteRow, addRow }} />
    </div>
  );
}

export default RequestHeaders;
