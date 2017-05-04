import { noop } from './noop';

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
    void listener(ev);
  }
}

export function once<T extends keyof WindowEventMap>(target: Window, type: T, listener: (ev: WindowEventMap[T]) => any, option?: boolean | EventListenerOption): () => undefined;
export function once<T extends keyof DocumentEventMap>(target: Document, type: T, listener: (ev: DocumentEventMap[T]) => any, option?: boolean | EventListenerOption): () => undefined;
export function once<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => any, option?: boolean | EventListenerOption): () => undefined;
export function once<T extends keyof WindowEventMap | keyof DocumentEventMap | keyof HTMLElementEventMap>(target: Window | Document | HTMLElement, type: T, listener: (ev: Event) => any, option: boolean | EventListenerOption = false): () => undefined {
  const unbind: () => undefined = bind(<Window>target, <keyof WindowEventMap>type, ev => {
    void unbind();
    void listener(ev);
  }, option);
  return () => void unbind();
}

export function delegate<T extends keyof HTMLElementEventMap>(target: HTMLElement, selector: string, type: T, listener: (ev: HTMLElementEventMap[T]) => any, option: EventListenerOption = {}): () => undefined {
  return bind(target, type, ev => {
    const cx = (<HTMLElement>ev.target).closest(selector);
    if (!cx) return;
    void Array.from(<NodeListOf<HTMLElement>>target.querySelectorAll(selector))
      .filter(el => el === cx)
      .forEach(el =>
        void once(el, type, ev => {
          void listener(ev);
        }, option));
  }, { ...option, capture: true });
}

let supportEventListenerOptions = false;
try {
  document.createElement("div").addEventListener("test", function () { }, <any>{
    get capture() {
      return supportEventListenerOptions = true;
    }
  });
} catch (e) { }
interface EventListenerOption {
  capture?: boolean;
  passive?: boolean;
}
function adjustEventListenerOptions(option: boolean | EventListenerOption): boolean | undefined {
  return supportEventListenerOptions
    ? <boolean>option
    : typeof option === 'boolean' ? option : option.capture;
}
