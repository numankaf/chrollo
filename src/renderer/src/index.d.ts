import type { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface TableMeta<T extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: T) => void;
    deleteRow: (rowIndex: number) => void;
    addRow: () => void;
  }
}
