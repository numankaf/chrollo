import type { PostStompUnsubscribeCtx, StompScriptRuntime } from '@/main/scripts/runtime/stomp-script-runtime';

import type { PreStompConnectCtx, PreStompSendCtx, PreStompSubscribeCtx, StompMessageCtx } from '@/types/chrollo';

export function createStompAPI(runtime: StompScriptRuntime) {
  return Object.freeze({
    onPreConnect(handler: (ctx: PreStompConnectCtx) => void) {
      runtime.preConnect.push(handler);
    },

    onPreSubscribe(handler: (ctx: PreStompSubscribeCtx) => void) {
      runtime.preSubscribe.push(handler);
    },

    onPostUnsubscribe(handler: (ctx: PostStompUnsubscribeCtx) => void) {
      runtime.postUnsubscribe.push(handler);
    },

    onPreSend(handler: (ctx: PreStompSendCtx) => void) {
      runtime.preSend.push(handler);
    },

    onMessage(handler: (ctx: StompMessageCtx) => void) {
      runtime.message.push(handler);
    },
  });
}
