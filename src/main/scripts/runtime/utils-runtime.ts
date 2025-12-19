import { nanoid } from 'nanoid';

export class UtilsRuntime {
  randomId(size?: number): string {
    return nanoid(size);
  }

  now(): number {
    return Date.now();
  }
}
