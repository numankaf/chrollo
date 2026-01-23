import { RequestsRuntime } from '@/main/scripts/runtime/requests-runtime';
import { StompRuntime } from '@/main/scripts/runtime/stomp-runtime';
import { UtilsRuntime } from '@/main/scripts/runtime/utils-runtime';
import { VariablesRuntime } from '@/main/scripts/runtime/variables-runtime';

export class ChrolloRuntime {
  stomp: StompRuntime;
  variables: VariablesRuntime;
  utils: UtilsRuntime;
  requests: RequestsRuntime;

  constructor() {
    this.stomp = new StompRuntime();
    this.variables = new VariablesRuntime();
    this.utils = new UtilsRuntime();
    this.requests = new RequestsRuntime();
  }
}
