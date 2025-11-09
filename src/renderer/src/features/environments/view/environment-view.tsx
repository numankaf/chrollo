/* eslint-disable react-hooks/incompatible-library */
import { useEffect, useState } from 'react';
import type {
  CellContext,
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Input } from '@/components/common/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/common/table';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: string | number) => void;
  }
}

// Sample data
const initialData: Variable[] = [
  {
    id: '1',
    variable: 'service',
    value: 'corec2',
  },
  {
    id: '2',
    variable: 'path',
    value: 'bsi',
  },
];

export type Variable = {
  id: string;
  variable: string;
  value: string;
};

// Editable cell component for text inputs
function EditableTextCell({ getValue, row: { index }, column: { id }, table }: CellContext<Variable, unknown>) {
  const initialValue = getValue() as string;
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      className="focus-visible:ring-ring h-8 w-full border-0 bg-background! p-0 rounded-none focus-visible:ring-1 text-sm"
      aria-label="editable-text-input"
    />
  );
}

// Column definitions with editable cells
export const columns: ColumnDef<Variable>[] = [
  {
    accessorKey: 'variable',
    header: 'Variable',
    cell: EditableTextCell,
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: EditableTextCell,
  },
];

function EnvironmentView() {
  const [data, setData] = useState(() => [...initialData]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="m-2">
      <Table className="border">
        <TableHeader className="bg-card">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="*:border-border [&>:not(:last-child)]:border-r">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className="h-8" key={header.id} colSpan={header.colSpan}>
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="*:border-border [&>:not(:last-child)]:border-r"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="p-0.5" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default EnvironmentView;
