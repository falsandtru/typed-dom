import { noop } from './noop';

export const currentTargets = new WeakMap<Event, EventTarget>();

export function bind<T extends keyof WindowEventMap>(target: Window, type: T, listener: (ev: WindowEventMap[T]) => any, option?: boolean | EventListenerOption): () => undefined;
export function bind<T extends keyof DocumentEventMap>(target: Document, type: T, listener: (ev: DocumentEventMap[T]) => any, option?: boolean | EventListenerOption): () => undefined;
export function bind<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => any, option?: boolean | EventListenerOption): () => undefined;
export function bind<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof HTMLElementEventMap>(target: Window | Document | HTMLElement, type: T, listener: (ev: Event) => any, option: boolean | EventListenerOption = false): () => undefined {
  void target.addEventListener(type, handler, adjustEventListenerOptions(option));
  let unbind: () => undefined = () => (
    unbind = noop,
    void target.removeEventListener(type, handler, adjustEventListenerOptions(option)));
  return () => void unbind();

  function handler(ev: Event) {
    if (typeof option === 'object' && option.passive) {
      ev.preventDefault = noop;
    }
    void currentTargets.set(ev, ev.currentTarget);
    void listener(ev);
  }
}

export function once<T extends keyof WindowEventMap>(target: Window, type: T, listener: (ev: WindowEventMap[T]) => any, option?: boolean | EventListenerOption): () => undefined;
export function once<T extends keyof DocumentEventMap>(target: Document, type: T, listener: (ev: DocumentEventMap[T]) => any, option?: boolean | EventListenerOption): () => undefined;
export function once<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => any, option?: boolean | EventListenerOption): () => undefined;
export function once<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof HTMLElementEventMap>(target: Window | Document | HTMLElement, type: T, listener: (ev: Event) => any, option: boolean | EventListenerOption = false): () => undefined {
  const unbind: () => undefined = bind(target as Window, type as keyof WindowEventMap, ev => {
    void unbind();
    void listener(ev);
  }, option);
  return () => void unbind();
}

export function delegate<T extends keyof HTMLElementEventMap>(target: Document | HTMLElement, selector: string, type: T, listener: (ev: HTMLElementEventMap[T]) => any, option: EventListenerOption = {}): () => undefined {
  return bind(target instanceof Document ? target.documentElement : target, type, ev => {
    const cx = (ev.target as HTMLElement).closest(selector);
    if (!cx) return;
    void Array.from(target.querySelectorAll(selector) as NodeListOf<HTMLElement>)
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
interface EventListenerOption {
  capture?: boolean;
  passive?: boolean;
}
function adjustEventListenerOptions(option: boolean | EventListenerOption): boolean | undefined {
  return supportEventListenerOptions
    ? option as boolean
    : typeof option === 'boolean' ? option : option.capture;
}
