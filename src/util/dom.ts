import { noop } from './noop';

export const currentTargets = new WeakMap<Event, EventTarget>();

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
    void currentTargets.set(ev, ev.currentTarget);
    void listener(ev);
  }

  function adjustEventListenerOptions(option: boolean | AddEventListenerOptions): boolean | AddEventListenerOptions {
    return supportEventListenerOptions
      ? option
      : typeof option === 'boolean' ? option : !!option.capture;
  }
}

export function once<T extends keyof WindowEventMap>(target: Window, type: T, listener: (ev: WindowEventMap[T]) => any, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof DocumentEventMap>(target: Document, type: T, listener: (ev: DocumentEventMap[T]) => any, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => any, option?: boolean | AddEventListenerOptions): () => undefined;
export function once<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof HTMLElementEventMap>(target: Window | Document | HTMLElement, type: T, listener: (ev: Event) => any, option: boolean | AddEventListenerOptions = false): () => undefined {
  return bind(
    target as Window, type as keyof WindowEventMap,
    ev => void listener(ev),
    { ...(typeof option === 'boolean' ? { capture: option } : option), once: true });
}

export function delegate<T extends keyof HTMLElementEventMap>(target: Document | HTMLElement, selector: string, type: T, listener: (ev: HTMLElementEventMap[T]) => any, option: AddEventListenerOptions = {}): () => undefined {
  return bind(target instanceof Document ? target.documentElement : target, type, ev => {
    const cx = (ev.target as HTMLElement).closest(selector);
    if (!cx) return;
    void [...target.querySelectorAll<HTMLElement>(selector)]
      .filter(el => el === cx)
      .forEach(el =>
        void once(el, type, ev => {
          void listener(ev);
        }, option));
  }, { ...option, capture: true });
}

let supportEventListenerOptions = false;
try {
  document.createElement("div").addEventListener("test", function () { }, {
    get capture() {
      return supportEventListenerOptions = true;
    }
  } as any);
} catch (e) { }
