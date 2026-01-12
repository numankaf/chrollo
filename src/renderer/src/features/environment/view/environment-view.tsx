import { useMemo } from 'react';
import useEnvironmentStore from '@/store/environment-store';
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useShallow } from 'zustand/react/shallow';

import type { EnvironmentVariable } from '@/types/environment';
import { useActiveItem } from '@/hooks/app/use-active-item';
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
import { ScrollArea } from '@/components/common/scroll-area';
import { EditableTextCell } from '@/components/common/table';
import { TanstackDataTable } from '@/components/common/tanstack-data-table';

const COLUMN_VISIBILITY_STORAGE_KEY = 'environment-column-visibility';

function EnvironmentView() {
  const { activeTab } = useActiveItem();
  const [columnVisibility, setColumnVisibility] = useColumnVisibility(COLUMN_VISIBILITY_STORAGE_KEY);
  const { environment, updateEnvironment } = useEnvironmentStore(
    useShallow((state) => ({
      updateEnvironment: state.updateEnvironment,
      environment: state.environments.find((e) => e.id === activeTab?.id),
    }))
  );
  const variables = environment ? environment.variables : [];

  const columns = useMemo(
    () => [
      {
        accessorKey: 'enabled',
        header: '',
        size: 40,
        cell: ({ row, column, table }) => {
          return (
            <div className="flex items-center justify-center">
              <Checkbox
                checked={row.original.enabled}
                onCheckedChange={(checked) => {
                  table.options.meta?.updateData(row.index, column.id, checked);
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
        cell: EditableTextCell<EnvironmentVariable>,
        size: 500,
      },
      {
        accessorKey: 'value',
        header: 'Value',
        cell: EditableTextCell<EnvironmentVariable>,
        size: 500,
        meta: {
          placeholder: 'Add Value',
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: EditableTextCell<EnvironmentVariable>,
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

  const updateData = (rowIndex: number, columnId: keyof EnvironmentVariable, value: unknown) => {
    const updated = variables.map((row: EnvironmentVariable, i: number) =>
      i === rowIndex ? { ...row, [columnId]: value } : row
    );
    if (environment) updateEnvironment({ ...environment, variables: updated });
  };

  const deleteRow = (rowIndex: number) => {
    const updated = variables.filter((_: EnvironmentVariable, i: number) => i !== rowIndex);
    if (environment) updateEnvironment({ ...environment, variables: updated });
  };

  const addRow = () => {
    const updated = [...variables, { id: nanoid(), key: '', value: '', description: '', enabled: true }];
    if (environment) updateEnvironment({ ...environment, variables: updated });
  };

  return (
    <ScrollArea className="px-4 py-2 h-full">
      <TanstackDataTable<EnvironmentVariable>
        data={environment ? environment.variables : []}
        columns={columns}
        meta={{ updateData, deleteRow, addRow }}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />
    </ScrollArea>
  );
}

export default EnvironmentView;
