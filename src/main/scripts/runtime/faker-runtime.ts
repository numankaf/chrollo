import { faker } from '@faker-js/faker';

export class FakerRuntime {
  constructor() {
    return new Proxy(faker, {
      get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
      },
    });
  }
}
