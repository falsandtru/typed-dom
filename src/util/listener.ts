import { AtomicPromise } from 'spica/promise';
import { once as once_ } from 'spica/function';
import { noop } from 'spica/noop';

export const currentTarget = Symbol.for('typed-dom::currentTarget');

declare global {
  interface Event {
    [currentTarget]?: Event['currentTarget'];
  }
}

export function listen<T extends keyof WindowEventMap>(target: typeof window, type: T, listener: (ev: WindowEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof DocumentEventMap>(target: Document | ShadowRoot, type: T, listener: (ev: DocumentEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof SVGElementEventMap>(target: SVGElement, type: T, listener: (ev: SVGElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof ElementEventMap>(target: Element, type: T, listener: (ev: ElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof HTMLElementEventMap>(target: Document | ShadowRoot | HTMLElement, selector: string, type: T, listener: (ev: HTMLElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function listen<T extends keyof SVGElementEventMap>(target: Document | ShadowRoot | SVGElement, selector: string, type: T, listener: (ev: SVGElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function listen<T extends keyof ElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, listener: (ev: ElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function listen<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof ElementEventMap>(target: typeof window | Document | ShadowRoot | Element, a: T | string, b: ((ev: Event) => unknown) | T, c: boolean | AddEventListenerOptions | ((ev: Event) => unknown) = false, d: AddEventListenerOptions = {}): () => undefined {
  return typeof b === 'string'
    ? delegate(target as Document, a, b as keyof ElementEventMap, c as () => void, d)
    : bind(target as Element, a as keyof ElementEventMap, b, c as boolean);
}

export function once<T extends keyof WindowEventMap>(target: typeof window, type: T, listener: (ev: WindowEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof DocumentEventMap>(target: Document | ShadowRoot, type: T, listener: (ev: DocumentEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof SVGElementEventMap>(target: SVGElement, type: T, listener: (ev: SVGElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof ElementEventMap>(target: Element, type: T, listener: (ev: ElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof HTMLElementEventMap>(target: Document | ShadowRoot | HTMLElement, selector: string, type: T, listener: (ev: HTMLElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function once<T extends keyof SVGElementEventMap>(target: Document | ShadowRoot | SVGElement, selector: string, type: T, listener: (ev: SVGElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function once<T extends keyof ElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, listener: (ev: ElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function once<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof ElementEventMap>(target: typeof window | Document | ShadowRoot | Element, a: T | string, b: ((ev: Event) => unknown) | T, c: boolean | AddEventListenerOptions | ((ev: Event) => unknown) = false, d: AddEventListenerOptions = {}): () => undefined {
  return typeof b === 'string'
    ? delegate(target as Document, a, b as keyof ElementEventMap, c as () => void, { ...typeof d === 'boolean' ? { capture: d } : d, once: true })
    : bind(target as Element, a as keyof ElementEventMap, b, { ...typeof c === 'boolean' ? { capture: c } : c, once: true });
}

export function wait<T extends keyof WindowEventMap>(target: typeof window, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<WindowEventMap[T]>;
export function wait<T extends keyof DocumentEventMap>(target: Document | ShadowRoot, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<DocumentEventMap[T]>;
export function wait<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<HTMLElementEventMap[T]>;
export function wait<T extends keyof SVGElementEventMap>(target: SVGElement, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<SVGElementEventMap[T]>;
export function wait<T extends keyof ElementEventMap>(target: Element, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<ElementEventMap[T]>;
export function wait<T extends keyof HTMLElementEventMap>(target: Document | ShadowRoot | HTMLElement, selector: string, type: T, option?: AddEventListenerOptions): AtomicPromise<HTMLElementEventMap[T]>;
export function wait<T extends keyof SVGElementEventMap>(target: Document | ShadowRoot | SVGElement, selector: string, type: T, option?: AddEventListenerOptions): AtomicPromise<SVGElementEventMap[T]>;
export function wait<T extends keyof ElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, option?: AddEventListenerOptions): AtomicPromise<ElementEventMap[T]>;
export function wait<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof ElementEventMap>(target: typeof window | Document | ShadowRoot | Element, a: T | string, b: T | boolean | AddEventListenerOptions = false, c: AddEventListenerOptions = {}): AtomicPromise<Event> {
  return new AtomicPromise(resolve =>
    typeof b === 'string'
      ? once(target as Document, a, b as keyof ElementEventMap, resolve, c)
      : once(target as Element, a as keyof ElementEventMap, resolve, b));
}

export function delegate<T extends keyof HTMLElementEventMap>(target: Document | ShadowRoot | HTMLElement, selector: string, type: T, listener: (ev: HTMLElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function delegate<T extends keyof SVGElementEventMap>(target: Document | ShadowRoot | SVGElement, selector: string, type: T, listener: (ev: SVGElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function delegate<T extends keyof ElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, listener: (ev: ElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function delegate<T extends keyof ElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, listener: (ev: ElementEventMap[T]) => unknown, option: AddEventListenerOptions = {}): () => undefined {
  let unbind = noop;
  return bind(target as Element, type, ev => {
    assert(ev.target instanceof Element);
    assert(ev.composedPath()[0] instanceof Element);
    unbind();
    const cx = (ev.target as Element).shadowRoot
      ? (ev.composedPath()[0] as Element)?.closest(selector)
      : (ev.target as Element)?.closest(selector);
    return cx
      ? unbind = once(cx, type, listener, option)
      : void 0,
      ev.returnValue;
  }, { ...option, capture: true });
}

export function bind<T extends keyof WindowEventMap>(target: typeof window, type: T, listener: (ev: WindowEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof DocumentEventMap>(target: Document | ShadowRoot, type: T, listener: (ev: DocumentEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof SVGElementEventMap>(target: SVGElement, type: T, listener: (ev: SVGElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof ElementEventMap>(target: Element, type: T, listener: (ev: ElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof ElementEventMap>(target: typeof window | Document | ShadowRoot | Element, type: T, listener: (ev: Event) => unknown, option: boolean | AddEventListenerOptions = false): () => undefined {
  target.addEventListener(type, handler, option);
  return once_(() => void target.removeEventListener(type, handler, option));

  function handler(ev: Event): unknown {
    assert(ev.currentTarget);
    return currentTarget in ev && !ev[currentTarget]
      ? void 0
      : ev[currentTarget] = ev.currentTarget,
      listener(ev);
  }
}
