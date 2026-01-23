import useConnectionStatusStore from '@/store/connection-status-store';
import useRequestResponseStore from '@/store/request-response-store';
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
  const { requestIdToRequestKey, setRequestIdMapping } = useRequestResponseStore(
    useShallow((state) => ({
      requestIdToRequestKey: state.requestIdToRequestKey,
      setRequestIdMapping: state.setRequestIdMapping,
    }))
  );

  /**
   * Sends a request and returns the requestKey if user script set one.
   * The requestKey can be used to track request-response correlation.
   * @param request The request to send
   * @param options.enableMapping If true, does not update the requestId -> requestKey mapping. Useful for runner mode.
   */
  async function sendRequest(request: Request, options?: { enableMapping?: boolean }): Promise<string | null> {
    if (!activeConnection) {
      toast.warning('No connection selected. Please select a connection first.');
      return null;
    }
    const status = getStatus(activeConnection.id);

    if (!(status === CONNECTION_STATUS.CONNECTED)) {
      toast.warning(`Connection "${activeConnection.name}" is not connected Please check connection status.`);
      return null;
    }

    switch (activeConnection.connectionType) {
      case CONNECTION_TYPE.STOMP: {
        const requestKey = await sendStompMessage(activeConnection.id, request);
        if (requestKey && options?.enableMapping) {
          setRequestIdMapping(request.id, requestKey);
        }
        return requestKey;
      }
      default:
        return null;
    }
  }

  /**
   * Gets the requestKey for a given request ID (if one was set by user script)
   */
  function getRequestKey(requestId: string): string | undefined {
    return requestIdToRequestKey[requestId];
  }

  return { sendRequest, getRequestKey };
}
