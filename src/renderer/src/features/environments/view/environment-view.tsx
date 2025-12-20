import { useMemo } from 'react';
import useEnvironmentStore from '@/store/environment-store';
import { Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useShallow } from 'zustand/react/shallow';

import type { EnvironmentVariable } from '@/types/environment';
import { useActiveItem } from '@/hooks/app/use-active-item';
import { Button } from '@/components/common/button';
import { Checkbox } from '@/components/common/checkbox';
import { ScrollArea } from '@/components/common/scroll-area';
import { EditableTextCell } from '@/components/common/table';
import { TanstackDataTable } from '@/components/common/tanstack-data-table';

function EnvironmentView() {
  const { activeTab } = useActiveItem();
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
      />
    </ScrollArea>
  );
}

export default EnvironmentView;
