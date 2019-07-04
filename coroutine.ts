import { Coroutine as Co, CoroutineOptions as Options } from 'spica/coroutine';
import { El, ElChildren } from './src/dom/proxy';

export interface CoroutineOptions extends Options {
  trigger?: string | symbol;
}

export abstract class Coroutine<T = unknown, R = unknown, S = unknown> extends Co<T, R, S> implements El {
  constructor(
    gen: (this: Coroutine<T, R, S>) => Generator<R, T> | AsyncGenerator<R, T>,
    opts: CoroutineOptions = {},
  ) {
    super(gen, { ...opts, syncrun: false });
    const prop = opts.trigger || 'element';
    void Object.defineProperty(this, prop, {
      set: (el: Element) => {
        void Object.defineProperty(this, prop, {
          value: el,
          enumerable: true,
          configurable: true,
          writable: true,
        });
        void this[Coroutine.run]();
      },
      enumerable: true,
      configurable: true,
    });
  }
  public abstract element: Element;
  public abstract children: ElChildren;
}
