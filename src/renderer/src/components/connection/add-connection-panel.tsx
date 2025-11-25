import { useState } from 'react';
import { STOMP_DEFAULT_VALUES } from '@/constants/connection/stomp/stomp-schema';
import useConnectionStore from '@/store/connection-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { CONNECTION_TYPE, type ConnectionType, type StompConnection } from '@/types/connection';
import { DEFAULT_WORKSPACE_ID } from '@/types/workspace';
import { useTabNavigation } from '@/hooks/use-tab-navigation';
import { Button } from '@/components/common/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/common/dialog';
import { Field, FieldError, FieldLabel } from '@/components/common/field';
import { Input } from '@/components/common/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/popover';
import { SocketIoIcon } from '@/components/icon/socket-io-icon';
import { StompIcon } from '@/components/icon/stomp-icon';
import { WebSocketIcon } from '@/components/icon/websocket-icon';

function AddConnectionFormContent({
  connectionType,
  label,
  onClose,
}: {
  connectionType: ConnectionType;
  label: string;
  onClose: () => void;
}) {
  const { openAndNavigateToTab } = useTabNavigation();

  const { createConnection } = useConnectionStore(
    useShallow((state) => ({
      createConnection: state.createConnection,
    }))
  );

  const formSchema = z.object({
    name: z.string().min(1, 'Connection name is required'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: `New ${label} Connection`,
    },
  });

  function onSubmit(values: { name: string }) {
    try {
      switch (connectionType) {
        case CONNECTION_TYPE.RAW_WEBSOCKET:
          break;

        case CONNECTION_TYPE.STOMP: {
          const connectionPayload: StompConnection = {
            id: nanoid(8),
            name: values.name,
            workspaceId: DEFAULT_WORKSPACE_ID,
            ...STOMP_DEFAULT_VALUES,
          };

          const newConnection = createConnection(connectionPayload);
          openAndNavigateToTab(newConnection);
          onClose();
          break;
        }

        case CONNECTION_TYPE.SOCKETIO:
          break;

        default:
          throw new Error('Unsupported connection type');
      }
    } catch (error) {
      console.error('Failed to submit connection:', error);
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create {label} connection</DialogTitle>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-3">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Connection Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter a connection name"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function AddConnectionPanel() {
  const [dialogInfo, setDialogInfo] = useState<{
    connectionType: ConnectionType;
    label: string;
  } | null>(null);

  function openDialog(type: ConnectionType, label: string) {
    setDialogInfo({ connectionType: type, label });
  }

  function closeDialog() {
    setDialogInfo(null);
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm" variant="ghost">
          <Plus className="w-4! h-4!" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-68 bg-background flex flex-wrap items-center justify-center gap-1.5">
        <Button
          size="sm"
          variant="ghost"
          className="text-sm flex flex-col items-center w-18 h-18 [&>svg]:w-7! [&>svg]:h-7! disabled:cursor-not-allowed disabled:pointer-events-auto"
          onClick={() => openDialog(CONNECTION_TYPE.RAW_WEBSOCKET, 'WebSocket')}
          disabled
          title="Coming Soon"
        >
          <WebSocketIcon />
          WebSocket
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="text-sm flex flex-col items-center w-18 h-18 [&>svg]:w-7! [&>svg]:h-7!"
          onClick={() => openDialog(CONNECTION_TYPE.STOMP, 'STOMP')}
        >
          <StompIcon />
          STOMP
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="text-sm flex flex-col items-center w-18 h-18 [&>svg]:w-7! [&>svg]:h-7! disabled:cursor-not-allowed disabled:pointer-events-auto"
          onClick={() => openDialog(CONNECTION_TYPE.SOCKETIO, 'Socket.IO')}
          disabled
          title="Coming Soon"
        >
          <SocketIoIcon />
          Socket.IO
        </Button>
      </PopoverContent>

      {dialogInfo && (
        <Dialog open onOpenChange={(open) => !open && closeDialog()}>
          <AddConnectionFormContent
            connectionType={dialogInfo.connectionType}
            label={dialogInfo.label}
            onClose={closeDialog}
          />
        </Dialog>
      )}
    </Popover>
  );
}

export default AddConnectionPanel;
