import 'mocha';
import _assert from 'power-assert';

declare global {
  export const assert: typeof _assert;

  interface PromiseLike<T> {
    _?: T;
  }

  interface Promise<T> {
    _?: T;
  }

}