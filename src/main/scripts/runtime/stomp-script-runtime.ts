import type { Request } from '@/types/collection';
import type { StompConnection } from '@/types/connection';
import type { SocketMessage } from '@/types/socket';

export type PreStompConnectHandler = (ctx: PreStompConnectCtx) => void;
export type PreStompSubscribeHandler = (ctx: PreStompSubscribeCtx) => void;
export type PostStompUnsubscribeHandler = (ctx: PostStompUnsubscribeCtx) => void;
export type PreStompSendHandler = (ctx: PreStompSendCtx) => void;
export type StompMessageHandler = (ctx: StompMessageCtx) => void;

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

export interface PostStompUnsubscribeCtx {
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
  postUnsubscribe: PostStompUnsubscribeHandler[] = [];
  preSend: PreStompSendHandler[] = [];
  message: StompMessageHandler[] = [];

  runPreConnect(ctx: PreStompConnectCtx) {
    for (const fn of this.preConnect) fn(ctx);
  }

  runPreSubscribe(ctx: Omit<PreStompSubscribeCtx, 'disableDefault'>) {
    let defaultDisabled = false;

    const internalCtx: PreStompSubscribeCtx = {
      ...ctx,
      disableDefault() {
        defaultDisabled = true;
      },
    };

    for (const fn of this.preSubscribe) fn(internalCtx);

    return { defaultDisabled };
  }

  runPostUnsubscribe(ctx: Omit<PostStompUnsubscribeCtx, 'disableDefault'>) {
    let defaultDisabled = false;

    const internalCtx: PostStompUnsubscribeCtx = {
      ...ctx,
      disableDefault() {
        defaultDisabled = true;
      },
    };

    for (const fn of this.postUnsubscribe) fn(internalCtx);

    return { defaultDisabled };
  }

  runPreSend(ctx: PreStompSendCtx) {
    for (const fn of this.preSend) fn(ctx);
  }

  runMessage(ctx: StompMessageCtx) {
    for (const fn of this.message) fn(ctx);
  }
}
