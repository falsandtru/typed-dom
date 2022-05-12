import { ObjectDefineProperty } from 'spica/alias';
import { AtomicPromise } from 'spica/promise';
import { singleton } from 'spica/function';

export const currentTarget = Symbol.for('typed-dom::currentTarget');

declare global {
  interface Event {
    [currentTarget]?: Event['currentTarget'];
  }
}

export function listen<T extends keyof WindowEventMap>(target: Window, type: T, listener: (ev: WindowEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof WindowEventMap>(target: Window, selector: string, type: T, listener: (ev: WindowEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof DocumentEventMap>(target: Document | ShadowRoot, type: T, listener: (ev: DocumentEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof DocumentEventMap>(target: Document | ShadowRoot, selector: string, type: T, listener: (ev: DocumentEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof HTMLElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, listener: (ev: HTMLElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof SVGElementEventMap>(target: SVGElement, type: T, listener: (ev: SVGElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof SVGElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, listener: (ev: SVGElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof MathMLElementEventMap>(target: MathMLElement, type: T, listener: (ev: MathMLElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof MathMLElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, listener: (ev: MathMLElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof ElementEventMap>(target: Element, type: T, listener: (ev: ElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof ElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, listener: (ev: ElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof ElementEventMap>(
  target: Window | Document | ShadowRoot | Element,
  selector: T | string,
  type: T | ((ev: Event) => void),
  listener?: boolean | AddEventListenerOptions | ((ev: Event) => void),
  option?: boolean | AddEventListenerOptions,
): () => undefined {
  return typeof type === 'string'
    ? delegate(target as Document, selector, type as keyof ElementEventMap, listener as () => void, option)
    : bind(target as Element, selector as keyof ElementEventMap, type, listener as boolean);
}

export function once<T extends keyof WindowEventMap>(target: Window, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<WindowEventMap[T]>;
export function once<T extends keyof WindowEventMap>(target: Window, type: T, listener: (ev: WindowEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof WindowEventMap>(target: Window, selector: string, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<WindowEventMap[T]>;
export function once<T extends keyof WindowEventMap>(target: Window, selector: string, type: T, listener: (ev: WindowEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof DocumentEventMap>(target: Document | ShadowRoot, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<DocumentEventMap[T]>;
export function once<T extends keyof DocumentEventMap>(target: Document | ShadowRoot, type: T, listener: (ev: DocumentEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof DocumentEventMap>(target: Document | ShadowRoot, selector: string, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<DocumentEventMap[T]>;
export function once<T extends keyof DocumentEventMap>(target: Document | ShadowRoot, selector: string, type: T, listener: (ev: DocumentEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<HTMLElementEventMap[T]>;
export function once<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof HTMLElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<HTMLElementEventMap[T]>;
export function once<T extends keyof HTMLElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, listener: (ev: HTMLElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof SVGElementEventMap>(target: SVGElement, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<SVGElementEventMap[T]>;
export function once<T extends keyof SVGElementEventMap>(target: SVGElement, type: T, listener: (ev: SVGElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof SVGElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<SVGElementEventMap[T]>;
export function once<T extends keyof SVGElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, listener: (ev: SVGElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof MathMLElementEventMap>(target: MathMLElement, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<MathMLElementEventMap[T]>;
export function once<T extends keyof MathMLElementEventMap>(target: MathMLElement, type: T, listener: (ev: MathMLElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof MathMLElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<MathMLElementEventMap[T]>;
export function once<T extends keyof MathMLElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, listener: (ev: MathMLElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof ElementEventMap>(target: Element, type: T, option?: boolean | AddEventListenerOptions): AtomicPromise<ElementEventMap[T]>;
export function once<T extends keyof ElementEventMap>(target: Element, type: T, listener: (ev: ElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof ElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, option?: AddEventListenerOptions): AtomicPromise<ElementEventMap[T]>;
export function once<T extends keyof ElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, listener: (ev: ElementEventMap[T]) => void, option?: AddEventListenerOptions): () => undefined;
export function once<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof ElementEventMap>(
  target: Window | Document | ShadowRoot | Element,
  selector: T | string,
  type?: T | boolean | AddEventListenerOptions | ((ev: Event) => void),
  listener?: boolean | AddEventListenerOptions | ((ev: Event) => void),
  option?: boolean | AddEventListenerOptions,
): (() => undefined) | AtomicPromise<Event> {
  switch (typeof type) {
    case 'string':
      switch (typeof listener) {
        case 'function':
          return delegate(target as Document, selector, type as keyof ElementEventMap, listener as () => void, { ...typeof option === 'boolean' ? { capture: option } : option, once: true });
        case 'object':
          option = { ...listener, once: true };
          break;
        default:
          option = { once: true };
      }
      return new AtomicPromise(resolve =>
        void delegate(target as Element, selector, type as keyof ElementEventMap, resolve, option));
    case 'function':
      return bind(target as Element, selector as keyof ElementEventMap, type, { ...typeof listener === 'boolean' ? { capture: listener } : listener, once: true });
    case 'object':
      option = { ...type, once: true };
      break;
    default:
      option = { once: true };
  }
  return new AtomicPromise(resolve =>
    void bind(target as Element, selector as keyof ElementEventMap, resolve, option));
}

export function delegate<T extends keyof WindowEventMap>(target: Window, selector: string, type: T, listener: (ev: WindowEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function delegate<T extends keyof DocumentEventMap>(target: Document | ShadowRoot, selector: string, type: T, listener: (ev: DocumentEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function delegate<T extends keyof HTMLElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, listener: (ev: HTMLElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function delegate<T extends keyof SVGElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, listener: (ev: SVGElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function delegate<T extends keyof MathMLElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, listener: (ev: MathMLElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function delegate<T extends keyof ElementEventMap>(target: Document | ShadowRoot | Element, selector: string, type: T, listener: (ev: ElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function delegate<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof ElementEventMap>(
  target: Window | Document | ShadowRoot | Element,
  selector: string,
  type: T,
  listener: (ev: Event) => void,
  option?: boolean | AddEventListenerOptions,
): () => undefined {
  return bind(target as Element, type as keyof ElementEventMap, ev => {
    assert(ev.target instanceof Element);
    assert(ev.composedPath()[0] instanceof Element);
    const cx = (ev.target as Element).shadowRoot
      ? (ev.composedPath()[0] as Element)?.closest(selector)
      : (ev.target as Element)?.closest(selector);
    cx && once(cx, type as keyof ElementEventMap, e => { e === ev && listener(ev); }, option);
  }, { ...typeof option === 'boolean' ? { capture: true } : option, capture: true });
}

export function bind<T extends keyof WindowEventMap>(target: Window, type: T, listener: (ev: WindowEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof DocumentEventMap>(target: Document | ShadowRoot, type: T, listener: (ev: DocumentEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof SVGElementEventMap>(target: SVGElement, type: T, listener: (ev: SVGElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof MathMLElementEventMap>(target: MathMLElement, type: T, listener: (ev: MathMLElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof ElementEventMap>(target: Element, type: T, listener: (ev: ElementEventMap[T]) => void, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof ElementEventMap>(
  target: Window | Document | ShadowRoot | Element,
  type: T,
  listener: (ev: Event) => void,
  option?: boolean | AddEventListenerOptions,
): () => undefined {
  switch (type) {
    case 'mutate':
    case 'connect':
    case 'disconnect':
      const prop = `on${type}`;
      target[prop] ?? ObjectDefineProperty(target, prop, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: prop in target
          ? (ev: Event) => ev.returnValue
          : '',
      });
  }
  target.addEventListener(type, handler, option);
  return singleton(() => void target.removeEventListener(type, handler, option));

  function handler(ev: Event): void {
    assert(ev.currentTarget);
    ev[currentTarget] = ev.currentTarget;
    listener(ev);
  }
}
