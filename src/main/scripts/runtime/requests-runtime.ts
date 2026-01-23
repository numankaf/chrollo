import { getMainWindow } from '@/main/index';

import type { Request } from '@/types/collection';
import type { RequestPendingEvent, RequestResolvedEvent } from '@/types/request-response';
import type { SocketMessage } from '@/types/socket';

export class RequestsRuntime {
  // Context for current execution - set before running preSend/message handlers
  private currentRequestKey: string | null = null;
  private currentConnectionId: string | null = null;
  private currentRequest: Request | null = null;
  private currentMessage: SocketMessage | null = null;

  /**
   * Called before running preSend handlers to set context
   */
  beginSendContext(connectionId: string, request: Request) {
    this.currentConnectionId = connectionId;
    this.currentRequest = request;
    this.currentRequestKey = null;
  }

  /**
   * Called after preSend handlers complete. Returns the requestKey if set.
   */
  endSendContext(): string | null {
    const requestKey = this.currentRequestKey;
    this.currentConnectionId = null;
    this.currentRequest = null;
    this.currentRequestKey = null;
    return requestKey;
  }

  /**
   * Called before running message handlers to set context
   */
  beginMessageContext(message: SocketMessage) {
    this.currentMessage = message;
  }

  /**
   * Called after message handlers complete
   */
  endMessageContext() {
    this.currentMessage = null;
  }

  /**
   * Called by user script in onPreSend to set the correlation key
   * Emits REQUEST_PENDING event to renderer
   */
  setRequestKey(requestKey: string) {
    if (!this.currentConnectionId || !this.currentRequest) {
      console.warn('[RequestsRuntime] setRequestKey called outside of send context');
      return;
    }

    this.currentRequestKey = requestKey;

    const mainWindow = getMainWindow();
    if (mainWindow) {
      const event: RequestPendingEvent = {
        requestKey,
        requestId: this.currentRequest.id,
        connectionId: this.currentConnectionId,
        request: this.currentRequest,
        timestamp: Date.now(),
      };
      mainWindow.webContents.send('stomp:request-pending', event);
    }
  }

  /**
   * Called by user script in onMessage to resolve a pending request
   * Emits REQUEST_RESOLVED event to renderer
   */
  resolveRequestKey(requestKey: string) {
    if (!this.currentMessage) {
      console.warn('[RequestsRuntime] resolveRequestKey called outside of message context');
      return;
    }

    const mainWindow = getMainWindow();
    if (mainWindow) {
      const event: RequestResolvedEvent = {
        requestKey,
        response: this.currentMessage,
        timestamp: Date.now(),
      };
      mainWindow.webContents.send('stomp:request-resolved', event);
    }
  }
}
