import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';

import type { StompSubscription } from '@/types/connection';
import { Button } from '@/components/common/button';
import { Switch } from '@/components/common/switch';
import {
  EditableTextCell,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/common/table';

const initialData: ({ id: string } & StompSubscription)[] = [
  {
    id: nanoid(8),
    topic: 'bsi',
    description: '',
    enabled: false,
  },
  {
    id: nanoid(8),
    topic: 'oppplan',
    description: '',
    enabled: false,
  },
  {
    id: nanoid(8),
    topic: 'land/rgp',
    description: '',
    enabled: false,
  },
];

const columns: ColumnDef<StompSubscription>[] = [
  {
    id: 'Enabled',
    accessorKey: 'enabled',
    header: 'Enabled',
    size: 40,
    cell: ({ row, column, table }) => {
      const value = row.original.enabled;
      const topic = row.original.topic;
      const disabled = !topic?.trim();
      return (
        <div className="flex items-center justify-center">
          <Switch
            className="cursor-pointer"
            checked={value}
            disabled={disabled}
            onCheckedChange={(checked) => {
              if (disabled) return;
              table.options.meta?.updateData(row.index, column.id, checked);
            }}
          />
        </div>
      );
    },
  },
  {
    id: 'Topic',
    accessorKey: 'topic',
    header: ({ table }) => (
      <div className="flex items-center gap-3 justify-between">
        <span>Topic</span>
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
    cell: EditableTextCell<StompSubscription>,
    size: 500,
  },
  {
    id: 'Description',
    accessorKey: 'description',
    header: 'Description',
    cell: EditableTextCell<StompSubscription>,
    size: 500,
  },
  {
    id: 'Delete',
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
];

function StompSubsciptions() {
  const [data, setData] = useState(() => [...initialData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        setData((old) => old.map((row, index) => (index === rowIndex ? { ...row, [columnId]: value } : row)));
      },
      deleteRow: (rowIndex) => {
        setData((old) => old.filter((_, index) => index !== rowIndex));
      },
      addRow: () => {
        setData((old) => [
          ...old,
          {
            id: nanoid(8),
            topic: '',
            description: '',
            enabled: false,
          },
        ]);
      },
    },
  });

  return (
    <div className="mx-4 my-2">
      <Table className="border">
        <TableHeader className="bg-card">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="*:border-border [&>:not(:last-child)]:border-r">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="h-8 uppercase"
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              className="*:border-border [&>:not(:last-child)]:border-r bg-background!"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell className="p-0" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default StompSubsciptions;
