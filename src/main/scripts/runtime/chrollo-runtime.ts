import { FakerRuntime } from '@/main/scripts/runtime/faker-runtime';
import { RequestRuntime } from '@/main/scripts/runtime/request-runtime';
import { StompRuntime } from '@/main/scripts/runtime/stomp-runtime';
import { UtilsRuntime } from '@/main/scripts/runtime/utils-runtime';
import { VariablesRuntime } from '@/main/scripts/runtime/variables-runtime';

export class ChrolloRuntime {
  stomp: StompRuntime;
  variables: VariablesRuntime;
  utils: UtilsRuntime;
  request: RequestRuntime;
  faker: FakerRuntime;

  constructor() {
    this.stomp = new StompRuntime();
    this.variables = new VariablesRuntime();
    this.utils = new UtilsRuntime();
    this.request = new RequestRuntime();
    this.faker = new FakerRuntime();
  }
}
