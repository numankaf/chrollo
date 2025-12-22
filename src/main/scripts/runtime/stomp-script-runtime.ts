import type { Request } from '@/types/collection';
import type { StompConnection } from '@/types/connection';
import type { SocketMessage } from '@/types/socket';

export type PreStompConnectHandler = (ctx: PreStompConnectCtx) => void;
export type PreStompSubscribeHandler = (ctx: PreStompSubscribeCtx) => void;
export type PreStompUnsubscribeHandler = (ctx: PreStompUnsubscribeCtx) => void;
export type PreStompSendHandler = (ctx: PreStompSendCtx) => void;
export type StompMessageHandler = (ctx: StompMessageCtx) => void;
export type StompScriptErrorHandler = (err: Error, hook: string) => void;

export interface PreStompConnectCtx {
  connection: StompConnection;
}

export interface PreStompSubscribeCtx {
  connectionId: string;
  subscriptionId: string;
  topic: string;
  subscribe(connectionId: string, subscriptionId: string, topic: string): void;
  disableDefault(): void;
}

export interface PreStompUnsubscribeCtx {
  connectionId: string;
  subscriptionId: string;
  topic: string;
  unsubscribe(connectionId: string, subscriptionId: string, topic: string): void;
  disableDefault(): void;
}

export interface PreStompSendCtx {
  connectionId: string;
  request: Request;
}

export interface StompMessageCtx {
  message: SocketMessage;
}

export class StompScriptRuntime {
  preConnect: PreStompConnectHandler[] = [];
  preSubscribe: PreStompSubscribeHandler[] = [];
  preUnsubscribe: PreStompUnsubscribeHandler[] = [];
  preSend: PreStompSendHandler[] = [];
  message: StompMessageHandler[] = [];
  private errorHandlers: StompScriptErrorHandler[] = [];

  onError(handler: StompScriptErrorHandler) {
    this.errorHandlers.push(handler);
  }

  private handleRuntimeError(err: unknown, hook: string) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error(`[SCRIPT ERROR: chrollo.stomp.${hook}]`, error);
    for (const handler of this.errorHandlers) {
      try {
        handler(error, hook);
      } catch (e) {
        console.error('Error in script error handler:', e);
      }
    }
  }

  runPreConnect(ctx: PreStompConnectCtx) {
    for (const fn of this.preConnect) {
      try {
        fn(ctx);
      } catch (err) {
        this.handleRuntimeError(err, 'preConnect');
      }
    }
  }

  runPreSubscribe(ctx: Omit<PreStompSubscribeCtx, 'disableDefault'>) {
    let defaultDisabled = false;

    const internalCtx: PreStompSubscribeCtx = {
      ...ctx,
      disableDefault() {
        defaultDisabled = true;
      },
    };

    for (const fn of this.preSubscribe) {
      try {
        fn(internalCtx);
      } catch (err) {
        this.handleRuntimeError(err, 'preSubscribe');
      }
    }

    return { defaultDisabled };
  }

  runPreUnsubscribe(ctx: Omit<PreStompUnsubscribeCtx, 'disableDefault'>) {
    let defaultDisabled = false;

    const internalCtx: PreStompUnsubscribeCtx = {
      ...ctx,
      disableDefault() {
        defaultDisabled = true;
      },
    };

    for (const fn of this.preUnsubscribe) {
      try {
        fn(internalCtx);
      } catch (err) {
        this.handleRuntimeError(err, 'preUnsubscribe');
      }
    }

    return { defaultDisabled };
  }

  runPreSend(ctx: PreStompSendCtx) {
    for (const fn of this.preSend) {
      try {
        fn(ctx);
      } catch (err) {
        this.handleRuntimeError(err, 'preSend');
      }
    }
  }

  runMessage(ctx: StompMessageCtx) {
    for (const fn of this.message) {
      try {
        fn(ctx);
      } catch (err) {
        this.handleRuntimeError(err, 'message');
      }
    }
  }
}
