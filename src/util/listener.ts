import { global, undefined } from 'spica/global';
import { AtomicPromise } from 'spica/promise';
import { noop } from 'spica/noop';

export const currentTarget = Symbol.for('currentTarget');

declare global {
  interface Event {
    readonly [currentTarget]?: Event['currentTarget'];
  }
}

export function listen<T extends keyof WindowEventMap>(target: Window, type: T, listener: (ev: WindowEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof DocumentEventMap>(target: Document, type: T, listener: (ev: DocumentEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof SVGElementEventMap>(target: SVGElement, type: T, listener: (ev: SVGElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof ElementEventMap>(target: Element, type: T, listener: (ev: ElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof HTMLElementEventMap>(target: Document | HTMLElement, selector: string, type: T, listener: (ev: HTMLElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function listen<T extends keyof SVGElementEventMap>(target: Document | SVGElement, selector: string, type: T, listener: (ev: SVGElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function listen<T extends keyof ElementEventMap>(target: Document | Element, selector: string, type: T, listener: (ev: ElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function listen<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof ElementEventMap>(target: Window | Document | Element, a: T | string, b: ((ev: Event) => unknown) | T, c: boolean | AddEventListenerOptions | ((ev: Event) => unknown) = false, d: AddEventListenerOptions = {}): () => undefined {
  return typeof b === 'string'
    ? delegate(target as Document, a, b as keyof ElementEventMap, c as () => void, d)
    : bind(target as Element, a as keyof ElementEventMap, b, c as boolean);
}

export function once<T extends keyof WindowEventMap>(target: Window, type: T, listener: (ev: WindowEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof DocumentEventMap>(target: Document, type: T, listener: (ev: DocumentEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof SVGElementEventMap>(target: SVGElement, type: T, listener: (ev: SVGElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof ElementEventMap>(target: Element, type: T, listener: (ev: ElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof HTMLElementEventMap>(target: Document | HTMLElement, selector: string, type: T, listener: (ev: HTMLElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function once<T extends keyof SVGElementEventMap>(target: Document | SVGElement, selector: string, type: T, listener: (ev: SVGElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function once<T extends keyof ElementEventMap>(target: Document | Element, selector: string, type: T, listener: (ev: ElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function once<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof ElementEventMap>(target: Window | Document | Element, a: T | string, b: ((ev: Event) => unknown) | T, c: boolean | AddEventListenerOptions | ((ev: Event) => unknown) = false, d: AddEventListenerOptions = {}): () => undefined {
  return typeof b === 'string'
    ? delegate(target as Document, a, b as keyof ElementEventMap, c as () => void, { ...typeof d === 'boolean' ? { capture: d } : d, once: true })
    : bind(target as Element, a as keyof ElementEventMap, b, { ...typeof c === 'boolean' ? { capture: c } : c, once: true });
}

export function wait<T extends keyof WindowEventMap>(target: Window, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<WindowEventMap[T]>;
export function wait<T extends keyof DocumentEventMap>(target: Document, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<DocumentEventMap[T]>;
export function wait<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<HTMLElementEventMap[T]>;
export function wait<T extends keyof SVGElementEventMap>(target: SVGElement, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<SVGElementEventMap[T]>;
export function wait<T extends keyof ElementEventMap>(target: Element, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<ElementEventMap[T]>;
export function wait<T extends keyof HTMLElementEventMap>(target: Document | HTMLElement, selector: string, type: T, option?: AddEventListenerOptions): AtomicPromise<HTMLElementEventMap[T]>;
export function wait<T extends keyof SVGElementEventMap>(target: Document | SVGElement, selector: string, type: T, option?: AddEventListenerOptions): AtomicPromise<SVGElementEventMap[T]>;
export function wait<T extends keyof ElementEventMap>(target: Document | Element, selector: string, type: T, option?: AddEventListenerOptions): AtomicPromise<ElementEventMap[T]>;
export function wait<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof ElementEventMap>(target: Window | Document | Element, a: T | string, b: T | boolean | AddEventListenerOptions = false, c: AddEventListenerOptions = {}): AtomicPromise<Event> {
  return new AtomicPromise(resolve =>
    typeof b === 'string'
      ? once(target as Document, a, b as keyof ElementEventMap, resolve, c)
      : once(target as Element, a as keyof ElementEventMap, resolve, b));
}

export function delegate<T extends keyof HTMLElementEventMap>(target: Document | HTMLElement, selector: string, type: T, listener: (ev: HTMLElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function delegate<T extends keyof SVGElementEventMap>(target: Document | SVGElement, selector: string, type: T, listener: (ev: SVGElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function delegate<T extends keyof ElementEventMap>(target: Document | Element, selector: string, type: T, listener: (ev: ElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function delegate<T extends keyof ElementEventMap>(target: Document | Element, selector: string, type: T, listener: (ev: ElementEventMap[T]) => unknown, option: AddEventListenerOptions = {}): () => undefined {
  let unbind = noop;
  return bind(
    target.nodeType === 9
      ? (target as Document).documentElement!
      : target as Element,
    type,
    ev => {
      unbind();
      const cx = (((ev.target as Element).shadowRoot && ev.composedPath()[0] || ev.target) as Element).closest(selector);
      return cx
        ? unbind = once(cx, type, listener, option)
        : undefined,
        ev.returnValue;
    },
    { ...option, capture: true });
}

export function bind<T extends keyof WindowEventMap>(target: Window, type: T, listener: (ev: WindowEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof DocumentEventMap>(target: Document, type: T, listener: (ev: DocumentEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof SVGElementEventMap>(target: SVGElement, type: T, listener: (ev: SVGElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof ElementEventMap>(target: Element, type: T, listener: (ev: ElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof ElementEventMap>(target: Window | Document | Element, type: T, listener: (ev: Event) => unknown, option: boolean | AddEventListenerOptions = false): () => undefined {
  target.addEventListener(type, handler, option);
  let unbind = () => void target.removeEventListener(type, handler, option);
  return () => void (unbind = unbind() || noop);

  interface Event extends global.Event {
    [currentTarget]?: Event['currentTarget'];
  }

  function handler(ev: Event): unknown {
    assert(ev.currentTarget);
    return currentTarget in ev
      ? undefined
      : ev[currentTarget] = ev.currentTarget,
      listener(ev);
  }
}
