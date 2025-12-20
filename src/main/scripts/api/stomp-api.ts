import type {
  PreStompConnectCtx,
  PreStompSendCtx,
  PreStompSubscribeCtx,
  PreStompUnsubscribeCtx,
  StompMessageCtx,
  StompScriptRuntime,
} from '@/main/scripts/runtime/stomp-script-runtime';

export function createStompAPI(runtime: StompScriptRuntime) {
  return Object.freeze({
    onPreConnect(handler: (ctx: PreStompConnectCtx) => void) {
      runtime.preConnect.push(handler);
    },

    onPreSubscribe(handler: (ctx: PreStompSubscribeCtx) => void) {
      runtime.preSubscribe.push(handler);
    },

    onPreUnsubscribe(handler: (ctx: PreStompUnsubscribeCtx) => void) {
      runtime.preUnsubscribe.push(handler);
    },

    onPreSend(handler: (ctx: PreStompSendCtx) => void) {
      runtime.preSend.push(handler);
    },

    onMessage(handler: (ctx: StompMessageCtx) => void) {
      runtime.message.push(handler);
    },
  });
}
