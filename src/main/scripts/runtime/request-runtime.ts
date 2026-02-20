import { getMainWindow } from '@/main/index';
import logger from '@/main/lib/logger';

import type { Request } from '@/types/collection';
import type { RequestPendingEvent } from '@/types/request-response';
import type { SocketMessage } from '@/types/socket';

export interface ResolvedRequest {
  requestKey: string;
  request: Request;
  message: SocketMessage;
  locals: Map<string, unknown>;
  responseTime: number;
}

interface PendingRequest {
  request: Request;
  locals: Map<string, unknown>;
  sentAt: number;
}

export class RequestRuntime {
  // Context for current execution - set before running preSend/message handlers
  private currentRequestKey: string | null = null;
  private currentConnectionId: string | null = null;
  private currentRequest: Request | null = null;
  private currentMessage: SocketMessage | null = null;
  private currentResponseTime: number | null = null;

  // Pending requests waiting for resolution (requestKey -> PendingRequest)
  private pendingRequests = new Map<string, PendingRequest>();

  // Deferred resolutions - populated by resolveRequestKey, consumed by stomp-ipc
  private resolvedRequests: ResolvedRequest[] = [];

  /**
   * Called before running preSend handlers to set context
   */
  beginSendContext(connectionId: string, request: Request) {
    this.currentConnectionId = connectionId;
    this.currentRequest = request;
    this.currentRequestKey = null;
  }

  /**
   * Called after the full pre-request script completes.
   * Attaches the final locals snapshot to the pending request, then clears context.
   * Returns the requestKey if set.
   */
  endSendContext(locals: Map<string, unknown>): string | null {
    const requestKey = this.currentRequestKey;
    if (requestKey) {
      const pending = this.pendingRequests.get(requestKey);
      if (pending) pending.locals = locals;
    }
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
    this.resolvedRequests = [];
  }

  /**
   * Called after message handlers complete
   */
  endMessageContext() {
    this.currentMessage = null;
    this.currentResponseTime = null;
  }

  getMessage(): SocketMessage | null {
    return this.currentMessage;
  }

  setCurrentResponseTime(responseTime: number) {
    this.currentResponseTime = responseTime;
  }

  getResponseTime(): number | null {
    return this.currentResponseTime;
  }

  /**
   * Called by user script in onPreSend to set the correlation key.
   * Stores the request for later retrieval and emits REQUEST_PENDING event.
   * locals are attached later by endSendContext after the full script completes.
   */
  setRequestKey(requestKey: string) {
    if (!this.currentConnectionId || !this.currentRequest) {
      logger.warn('[RequestsRuntime] setRequestKey called outside of send context');
      return;
    }

    const sentAt = Date.now();
    this.currentRequestKey = requestKey;
    this.pendingRequests.set(requestKey, { request: this.currentRequest, locals: new Map(), sentAt });

    const mainWindow = getMainWindow();
    if (mainWindow) {
      const event: RequestPendingEvent = {
        requestKey,
        requestId: this.currentRequest.id,
        connectionId: this.currentConnectionId,
        request: this.currentRequest,
        timestamp: sentAt,
      };
      mainWindow.webContents.send('stomp:request-pending', event);
    }
  }

  /**
   * Called by user script in onMessage to resolve a pending request.
   * Defers IPC emission — stores resolved state for stomp-ipc to consume
   * after running postResponse scripts.
   */
  resolveRequestKey(requestKey: string) {
    if (!this.currentMessage) {
      logger.warn('[RequestsRuntime] resolveRequestKey called outside of message context');
      return;
    }

    const pending = this.pendingRequests.get(requestKey);
    if (!pending) {
      logger.warn(`[RequestsRuntime] No pending request found for key: ${requestKey}`);
      return;
    }

    this.resolvedRequests.push({
      requestKey,
      request: pending.request,
      message: this.currentMessage,
      locals: pending.locals,
      responseTime: this.currentMessage.timestamp - pending.sentAt,
    });

    this.pendingRequests.delete(requestKey);
  }

  /**
   * Consume all deferred resolved requests (called by stomp-ipc after running postResponse).
   * Returns empty array if no requests were resolved in this message context.
   */
  consumeResolvedRequests(): ResolvedRequest[] {
    const resolved = this.resolvedRequests;
    this.resolvedRequests = [];
    return resolved;
  }

  /**
   * Clear all pending requests. Called on disconnect to prevent memory leaks.
   */
  clearPendingRequests() {
    this.pendingRequests.clear();
  }
}
