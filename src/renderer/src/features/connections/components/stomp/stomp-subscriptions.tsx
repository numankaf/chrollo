import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { nanoid } from 'nanoid';

import type { StompSubscription } from '@/types/connection';
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
];

export const columns: ColumnDef<StompSubscription>[] = [
  {
    accessorKey: 'topic',
    header: 'Topic',
    cell: EditableTextCell<StompSubscription>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: EditableTextCell<StompSubscription>,
  },
];

function StompSubsciptions() {
  const [data, setData] = useState(() => [...initialData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }

            return row;
          })
        );
      },
    },
    state: {},
  });

  return (
    <div className="mx-4 my-2">
      <Table className="border">
        <TableHeader className="bg-card">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="*:border-border [&>:not(:last-child)]:border-r">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className="h-8 uppercase" key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    )}
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
              className="*:border-border [&>:not(:last-child)]:border-r"
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
