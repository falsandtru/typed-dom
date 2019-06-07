import { noop } from './noop';

export const currentTargets = new WeakMap<Event, EventTarget>();

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
    ? delegate(target as Document, a, b as keyof ElementEventMap, c as () => void, { ...(typeof d === 'boolean' ? { capture: d } : d), once: true })
    : bind(target as Element, a as keyof ElementEventMap, b, { ...(typeof c === 'boolean' ? { capture: c } : c), once: true });
}

export function wait<T extends keyof WindowEventMap>(target: Window, type: T, option?: boolean | AddEventListenerOptions): Promise<WindowEventMap[T]>;
export function wait<T extends keyof DocumentEventMap>(target: Document, type: T, option?: boolean | AddEventListenerOptions): Promise<DocumentEventMap[T]>;
export function wait<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, option?: boolean | AddEventListenerOptions): Promise<HTMLElementEventMap[T]>;
export function wait<T extends keyof SVGElementEventMap>(target: SVGElement, type: T, option?: boolean | AddEventListenerOptions): Promise<SVGElementEventMap[T]>;
export function wait<T extends keyof ElementEventMap>(target: Element, type: T, option?: boolean | AddEventListenerOptions): Promise<ElementEventMap[T]>;
export function wait<T extends keyof HTMLElementEventMap>(target: Document | HTMLElement, selector: string, type: T, option?: AddEventListenerOptions): Promise<HTMLElementEventMap[T]>;
export function wait<T extends keyof SVGElementEventMap>(target: Document | SVGElement, selector: string, type: T, option?: AddEventListenerOptions): Promise<SVGElementEventMap[T]>;
export function wait<T extends keyof ElementEventMap>(target: Document | Element, selector: string, type: T, option?: AddEventListenerOptions): Promise<ElementEventMap[T]>;
export function wait<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof ElementEventMap>(target: Window | Document | Element, a: T | string, b: T | boolean | AddEventListenerOptions = false, c: AddEventListenerOptions = {}): Promise<Event> {
  return new Promise(resolve =>
    typeof b === 'string'
      ? void once(target as Document, a, b as keyof ElementEventMap, resolve, c)
      : void once(target as Element, a as keyof ElementEventMap, resolve, b as boolean));
}

export function delegate<T extends keyof HTMLElementEventMap>(target: Document | HTMLElement, selector: string, type: T, listener: (ev: HTMLElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function delegate<T extends keyof SVGElementEventMap>(target: Document | SVGElement, selector: string, type: T, listener: (ev: SVGElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function delegate<T extends keyof ElementEventMap>(target: Document | Element, selector: string, type: T, listener: (ev: ElementEventMap[T]) => unknown, option?: AddEventListenerOptions): () => undefined;
export function delegate<T extends keyof ElementEventMap>(target: Document | Element, selector: string, type: T, listener: (ev: ElementEventMap[T]) => unknown, option: AddEventListenerOptions = {}): () => undefined {
  return bind(target instanceof Document ? target.documentElement! : target, type, ev => {
    const cx = (((ev.target as Element).shadowRoot && ev.composedPath()[0] || ev.target) as Element).closest(selector);
    if (cx instanceof Element) {
      void once(cx, type, listener, option);
    }
    return ev.returnValue;
  }, { ...option, capture: true });
}

export function bind<T extends keyof WindowEventMap>(target: Window, type: T, listener: (ev: WindowEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof DocumentEventMap>(target: Document, type: T, listener: (ev: DocumentEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof SVGElementEventMap>(target: SVGElement, type: T, listener: (ev: SVGElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof ElementEventMap>(target: Element, type: T, listener: (ev: ElementEventMap[T]) => unknown, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof ElementEventMap>(target: Window | Document | Element, type: T, listener: (ev: Event) => unknown, option: boolean | AddEventListenerOptions = false): () => undefined {
  void target.addEventListener(type, handler, option);
  let unbind: () => undefined = () => (
    unbind = noop,
    void target.removeEventListener(type, handler, option));
  return () => void unbind();

  function handler(ev: Event) {
    assert(ev.currentTarget);
    void currentTargets.set(ev, ev.currentTarget!);
    return listener(ev);
  }
}
