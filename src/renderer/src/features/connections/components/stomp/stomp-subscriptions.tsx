import { useMemo } from 'react';
import { subscribeStomp, unsubscribeStomp } from '@/utils/stomp-util';
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useFormContext } from 'react-hook-form';

import type { StompSubscription } from '@/types/connection';
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
import { Switch } from '@/components/common/switch';
import { EditableTextCell, EditableVariableTextCell } from '@/components/common/table';
import { TanstackDataTable } from '@/components/common/tanstack-data-table';

const PROPERTY_KEY = 'subscriptions';
const COLUMN_VISIBILITY_STORAGE_KEY = 'stomp-subscriptions-column-visibility';

function StompSubsciptions({ subscriptions }: { subscriptions: StompSubscription[] }) {
  const { activeTab } = useActiveItem();
  const form = useFormContext();
  const [columnVisibility, setColumnVisibility] = useColumnVisibility(COLUMN_VISIBILITY_STORAGE_KEY);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'enabled',
        header: 'Enabled',
        size: 40,
        cell: ({ row, column, table }) => {
          const subscriptionId = row.original.id;
          const value = row.original.enabled;
          const topic = row.original.topic;
          const disabled = !topic?.trim();
          return (
            <div className="flex items-center justify-center">
              <Switch
                checked={value}
                disabled={disabled}
                onCheckedChange={(checked) => {
                  table.options.meta?.updateData(row.index, column.id, checked);
                  if (activeTab) {
                    if (checked) {
                      subscribeStomp(activeTab.id, subscriptionId, topic);
                    } else {
                      unsubscribeStomp(activeTab.id, subscriptionId, topic);
                    }
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        accessorKey: 'topic',
        meta: {
          placeholder: 'Add Topic',
        },
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
        cell: EditableVariableTextCell<StompSubscription>,
        size: 500,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: EditableTextCell<StompSubscription>,
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
                  .filter((column) => ['description'].includes(column.id))
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
          const subscriptionId = row.original.id;
          const topic = row.original.topic;
          const disabled = !topic?.trim();
          return (
            <div className="flex items-center justify-center">
              <Button
                type="button"
                variant="error-bordered-ghost"
                size="icon"
                className="w-6 h-6"
                onClick={() => {
                  table.options.meta?.deleteRow(row.index);
                  if (activeTab && !disabled) {
                    unsubscribeStomp(activeTab.id, subscriptionId, topic);
                  }
                }}
              >
                <Trash2 />
              </Button>
            </div>
          );
        },
      },
    ],
    [activeTab]
  );

  const updateData = (rowIndex: number, columnId: keyof StompSubscription, value: unknown) => {
    const updated = subscriptions.map((row: StompSubscription, i: number) =>
      i === rowIndex ? { ...row, [columnId]: value } : row
    );
    form.setValue(PROPERTY_KEY, updated, { shouldDirty: true });
  };

  const deleteRow = (rowIndex: number) => {
    const updated = subscriptions.filter((_: StompSubscription, i: number) => i !== rowIndex);
    form.setValue(PROPERTY_KEY, updated, { shouldDirty: true });
  };

  const addRow = () => {
    const updated = [...subscriptions, { id: nanoid(), topic: '', description: '', enabled: false }];
    form.setValue(PROPERTY_KEY, updated, { shouldDirty: true });
  };

  return (
    <div className="mx-4 pb-2">
      <p className="text-muted-foreground my-1">Stomp Subscriptions</p>

      <TanstackDataTable<StompSubscription>
        data={subscriptions}
        columns={columns}
        meta={{ updateData, deleteRow, addRow }}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />
    </div>
  );
}

export default StompSubsciptions;
