import useConnectionStatusStore from '@/store/connection-status-store';
import { sendStompMessage } from '@/utils/stomp-util';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import type { Request } from '@/types/collection';
import { CONNECTION_STATUS, CONNECTION_TYPE } from '@/types/connection';
import { useActiveItem } from '@/hooks/app/use-active-item';

export function useConnection() {
  const { activeConnection } = useActiveItem();
  const { getStatus } = useConnectionStatusStore(
    useShallow((state) => ({
      getStatus: state.getStatus,
    }))
  );
  /**
   * Sends a request and returns the requestKey if user script set one.
   * The requestKey can be used to track request-response correlation.
   * @param request The request to send
   * @param options.enableMapping If true, does not update the requestId -> requestKey mapping. Useful for runner mode.
   */
  function sendRequest(request: Request): void {
    if (!activeConnection) {
      toast.warning('No connection selected. Please select a connection first.');
      return;
    }
    const status = getStatus(activeConnection.id);

    if (!(status === CONNECTION_STATUS.CONNECTED)) {
      toast.warning(`Connection "${activeConnection.name}" is not connected Please check connection status.`);
      return;
    }

    switch (activeConnection.connectionType) {
      case CONNECTION_TYPE.STOMP: {
        sendStompMessage(activeConnection.id, request);
        break;
      }
      default:
        return;
    }
  }

  return { sendRequest };
}
