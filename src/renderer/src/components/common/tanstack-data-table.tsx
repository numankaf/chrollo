import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/common/table';

interface TanstackDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  meta: {
    updateData: (rowIndex: number, columnId: keyof T, value: unknown) => void;
    deleteRow: (rowIndex: number) => void;
    addRow: () => void;
  };
}

export function TanstackDataTable<T extends { id: string }>({ data, columns, meta }: TanstackDataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    meta: {
      updateData: meta.updateData,
      deleteRow: meta.deleteRow,
      addRow: meta.addRow,
    },
  });

  return (
    <Table className="border">
      <TableHeader className="bg-card">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="*:border-border [&>:not(:last-child)]:border-r">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                style={{ width: header.getSize() }}
                className="h-8 uppercase"
              >
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length === 0 ? (
          <TableRow>
            <TableCell className="text-center py-4 bg-background!" colSpan={columns.length}>
              No data available
            </TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              className="*:border-border [&>:not(:last-child)]:border-r bg-background!"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="p-0">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
