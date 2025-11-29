import { useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useFormContext } from 'react-hook-form';

import type { StompSubscription } from '@/types/connection';
import { useActiveItem } from '@/hooks/workspace/use-active-item';
import { Button } from '@/components/common/button';
import { Switch } from '@/components/common/switch';
import { EditableTextCell } from '@/components/common/table';
import { TanstackDataTable } from '@/components/common/tanstack-data-table';

const PROPERTY_KEY = 'subscriptions';

function StompSubsciptions() {
  const { activeTab } = useActiveItem();
  const form = useFormContext();
  const subscriptions = form.getValues(PROPERTY_KEY);

  const columns = useMemo(
    () => [
      {
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
                  table.options.meta?.updateData(row.index, column.id, checked);
                  if (activeTab) {
                    if (checked) {
                      window.api.stomp.subscribe(activeTab.id, topic);
                    } else {
                      window.api.stomp.unsubscribe(activeTab.id, topic);
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
        cell: EditableTextCell<StompSubscription>,
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
        header: '',
        size: 40,
        cell: ({ row, table }) => {
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
                    window.api.stomp.unsubscribe(activeTab.id, topic);
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
    const updated = [...subscriptions, { id: nanoid(8), topic: '', description: '', enabled: false }];
    form.setValue(PROPERTY_KEY, updated, { shouldDirty: true });
  };

  return (
    <div className="mx-4">
      <p className="text-muted-foreground my-1">Stomp Subscriptions</p>

      <TanstackDataTable<StompSubscription>
        data={subscriptions}
        columns={columns}
        meta={{ updateData, deleteRow, addRow }}
      />
    </div>
  );
}

export default StompSubsciptions;
