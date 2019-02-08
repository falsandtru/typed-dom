import { noop } from './noop';

export const currentTargets = new WeakMap<Event, EventTarget>();

export function listen<T extends keyof WindowEventMap>(target: Window, type: T, listener: (ev: WindowEventMap[T]) => any, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof DocumentEventMap>(target: Document, type: T, listener: (ev: DocumentEventMap[T]) => any, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => any, option?: boolean | AddEventListenerOptions): () => undefined;
export function listen<T extends keyof HTMLElementEventMap>(target: Document | HTMLElement, selector: string, type: T, listener: (ev: HTMLElementEventMap[T]) => any, option?: AddEventListenerOptions): () => undefined;
export function listen<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof HTMLElementEventMap>(target: Window | Document | HTMLElement, a: T | string, b: ((ev: Event) => any) | T, c: boolean | AddEventListenerOptions | ((ev: Event) => any) = false, d: AddEventListenerOptions = {}): () => undefined {
  return typeof b === 'string'
    ? delegate(target as Document, a, b as keyof HTMLElementEventMap, c as () => void, d)
    : bind(target as HTMLElement, a as keyof HTMLElementEventMap, b, c as boolean);
}

export function once<T extends keyof WindowEventMap>(target: Window, type: T, listener: (ev: WindowEventMap[T]) => any, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof DocumentEventMap>(target: Document, type: T, listener: (ev: DocumentEventMap[T]) => any, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => any, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof HTMLElementEventMap>(target: Document | HTMLElement, selector: string, type: T, listener: (ev: HTMLElementEventMap[T]) => any, option?: AddEventListenerOptions): () => undefined;
export function once<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof HTMLElementEventMap>(target: Window | Document | HTMLElement, a: T | string, b: ((ev: Event) => any) | T, c: boolean | AddEventListenerOptions | ((ev: Event) => any) = false, d: AddEventListenerOptions = {}): () => undefined {
  return typeof b === 'string'
    ? delegate(target as Document, a, b as keyof HTMLElementEventMap, c as () => void, { ...(typeof d === 'boolean' ? { capture: d } : d), once: true })
    : bind(target as HTMLElement, a as keyof HTMLElementEventMap, b, { ...(typeof c === 'boolean' ? { capture: c } : c), once: true });
}

export function delegate<T extends keyof HTMLElementEventMap>(target: Document | HTMLElement, selector: string, type: T, listener: (ev: HTMLElementEventMap[T]) => any, option: AddEventListenerOptions = {}): () => undefined {
  return bind(target instanceof Document ? target.documentElement! : target, type, ev => {
    const cx = (((ev.target as Element).shadowRoot ? ev.composedPath()[0] : ev.target) as HTMLElement).closest(selector);
    if (cx instanceof HTMLElement) {
      void once(cx, type, listener, option);
    }
    return ev.returnValue;
  }, { ...option, capture: true });
}

export function bind<T extends keyof WindowEventMap>(target: Window, type: T, listener: (ev: WindowEventMap[T]) => any, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof DocumentEventMap>(target: Document, type: T, listener: (ev: DocumentEventMap[T]) => any, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => any, option?: boolean | AddEventListenerOptions): () => undefined;
export function bind<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof HTMLElementEventMap>(target: Window | Document | HTMLElement, type: T, listener: (ev: Event) => any, option: boolean | AddEventListenerOptions = false): () => undefined {
  void target.addEventListener(type, handler, adjustEventListenerOptions(option) as boolean);
  let unbind: () => undefined = () => (
    unbind = noop,
    void target.removeEventListener(type, handler, adjustEventListenerOptions(option) as boolean));
  return () => void unbind();

  function handler(ev: Event) {
    if (typeof option === 'object') {
      if (option.passive) {
        ev.preventDefault = noop;
      }
      if (option.once) {
        void unbind();
      }
    }
    assert(ev.currentTarget);
    void currentTargets.set(ev, ev.currentTarget!);
    return listener(ev);
  }

  function adjustEventListenerOptions(option: boolean | AddEventListenerOptions): boolean | AddEventListenerOptions {
    return supportEventListenerOptions
      ? option
      : typeof option === 'boolean' ? option : !!option.capture;
  }
}

let supportEventListenerOptions = false;
try {
  document.createElement("div").addEventListener("test", function () { }, {
    get capture() {
      return supportEventListenerOptions = true;
    }
  } as any);
} catch { }
