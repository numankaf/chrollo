import { StompScriptRuntime } from '@/main/scripts/runtime/stomp-script-runtime';
import { UtilsRuntime } from '@/main/scripts/runtime/utils-runtime';
import { VariablesRuntime } from '@/main/scripts/runtime/variables-runtime';

export class ChrolloRuntime {
  stomp: StompScriptRuntime;
  variables: VariablesRuntime;
  utils: UtilsRuntime;

  constructor() {
    this.stomp = new StompScriptRuntime();
    this.variables = new VariablesRuntime();
    this.utils = new UtilsRuntime();
  }
}
