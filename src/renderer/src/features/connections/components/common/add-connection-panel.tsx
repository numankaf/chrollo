import { useState } from 'react';
import { STOMP_DEFAULT_VALUES } from '@/constants/connection/stomp/stomp-schema';
import useConnectionStore from '@/store/connection-store';
import useTabsStore from '@/store/tab-store';
import useWorkspaceStore from '@/store/workspace-store';
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import { CONNECTION_TYPE, type ConnectionType, type StompConnection } from '@/types/connection';
import { Button } from '@/components/common/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/popover';
import { AddItemDialog } from '@/components/app/dialog/add-item-dialog';
import { SocketIoIcon } from '@/components/icon/socket-io-icon';
import { StompIcon } from '@/components/icon/stomp-icon';
import { WebSocketIcon } from '@/components/icon/websocket-icon';

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

  const { openTab } = useTabsStore(
    useShallow((state) => ({
      openTab: state.openTab,
    }))
  );

  const { saveConnection } = useConnectionStore(
    useShallow((state) => ({
      saveConnection: state.saveConnection,
    }))
  );
  const { activeWorkspaceId } = useWorkspaceStore(
    useShallow((state) => ({
      activeWorkspaceId: state.activeWorkspaceId,
    }))
  );

  async function onAddSubmit(values: { name: string }) {
    if (!activeWorkspaceId) {
      return;
    }
    try {
      switch (dialogInfo?.connectionType) {
        case CONNECTION_TYPE.RAW_WEBSOCKET:
          break;

        case CONNECTION_TYPE.STOMP: {
          const connectionPayload: StompConnection = {
            id: nanoid(),
            name: values.name,
            workspaceId: activeWorkspaceId,
            ...STOMP_DEFAULT_VALUES,
          };

          const newConnection = await saveConnection(connectionPayload);
          openTab(newConnection);
          closeDialog();
          break;
        }

        case CONNECTION_TYPE.SOCKETIO:
          break;

        default:
          throw new Error('Unsupported connection type');
      }
    } catch (error) {
      console.error('Failed to submit connection:', error);
      toast.error('Failed to submit connection.');
    }
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm" variant="ghost">
          <Plus size={16} />
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
        <AddItemDialog
          title={`Create ${dialogInfo?.label} Connection`}
          inputLabel={`${dialogInfo?.label} Name`}
          inputRequiredLabel="Connection name is required."
          inputPlaceholder="Enter a connection name"
          defaultValue={`New ${dialogInfo?.label} Connection`}
          open={!!dialogInfo}
          onOpenChange={(open) => {
            if (!open) {
              closeDialog();
            }
          }}
          onSubmit={onAddSubmit}
        />
      )}
    </Popover>
  );
}

export default AddConnectionPanel;
