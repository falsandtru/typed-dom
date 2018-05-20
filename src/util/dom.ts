export interface Factory<E extends Element> {
  (tag: string, children?: Iterable<Node> | string): E;
  (tag: string, attrs?: Record<string, string | EventListener>, children?: Iterable<Node> | string): E;
}

export function observe<F extends Factory<Element>>(factory: F, callback: (record: MutationRecord[]) => void, opts?: MutationObserverInit): F;
export function observe(factory: Factory<Element>, callback: (record: MutationRecord[]) => void, opts: MutationObserverInit = { childList: true }): typeof factory {
  return (tag: string, ...args: any[]) => {
    const obs = new MutationObserver(callback);
    const el = factory(tag);
    void obs.observe(el, opts);
    void define(el, ...args);
    return el;
  };
}

const cache = new Map<string, Element>();

export function html<T extends keyof HTMLElementTagNameMap>(tag: T, children?: Iterable<Node> | string): HTMLElementTagNameMap[T];
export function html<T extends keyof HTMLElementTagNameMap>(tag: T, attrs?: Record<string, string | EventListener>, children?: Iterable<Node> | string): HTMLElementTagNameMap[T];
export function html<T extends keyof HTMLElementTagNameMap>(tag: T, attrs: Record<string, string | EventListener> | Iterable<Node> | string = {}, children: Iterable<Node> | string = []): HTMLElementTagNameMap[T] {
  return element('html', tag, attrs, children);
}

export function svg<T extends keyof SVGElementTagNameMap_>(tag: T, children?: Iterable<Node> | string): SVGElementTagNameMap_[T];
export function svg<T extends keyof SVGElementTagNameMap_>(tag: T, attrs?: Record<string, string | EventListener>, children?: Iterable<Node> | string): SVGElementTagNameMap_[T];
export function svg<T extends keyof SVGElementTagNameMap_>(tag: T, attrs: Record<string, string | EventListener> | Iterable<Node> | string = {}, children: Iterable<Node> | string = []): SVGElementTagNameMap_[T] {
  return element('svg', tag, attrs, children);
}

export function frag(children: Iterable<Node> | string = []): DocumentFragment {
  children = typeof children === 'string' ? [text(children)] : children;
  const frag = document.createDocumentFragment();
  void [...children]
    .forEach(child =>
      void frag.appendChild(child));
  return frag;
}

export function text(source: string): Text {
  return document.createTextNode(source);
}

function element<T extends keyof HTMLElementTagNameMap>(ns: 'html', tag: T, attrs?: Record<string, string | EventListener> | Iterable<Node> | string, children?: Iterable<Node> | string): HTMLElementTagNameMap[T];
function element<T extends keyof SVGElementTagNameMap_>(ns: 'svg', tag: T, attrs?: Record<string, string | EventListener> | Iterable<Node> | string, children?: Iterable<Node> | string): SVGElementTagNameMap_[T];
function element(ns: string, tag: string, attrs: Record<string, string | EventListener> | Iterable<Node> | string = {}, children: Iterable<Node> | string = []): Element {
  const key = `${ns}:${tag}`;
  const el = cache.has(key)
    ? cache.get(key)!.cloneNode(true) as Element
    : cache.set(key, elem(ns, tag)).get(key)!.cloneNode(true) as Element;
  assert(el !== cache.get(key));
  assert(el.attributes.length === 0);
  assert(el.childNodes.length === 0);
  void define(el, attrs, children);
  return el;
}

function elem(ns: string, tag: string): Element {
  switch (ns) {
    case 'html':
      return document.createElement(tag);
    case 'svg':
      return document.createElementNS("http://www.w3.org/2000/svg", tag);
    default:
      throw new Error(`TypedDOM: Unknown namespace: ${ns}`);
  }
}

export function define(el: Element, children?: Iterable<Node> | string): void;
export function define(el: Element, attrs?: Record<string, string | EventListener> | Iterable<Node> | string, children?: Iterable<Node> | string): void;
export function define(el: Element, attrs: Record<string, string | EventListener> | Iterable<Node> | string = {}, children: Iterable<Node> | string = []): void {
  if (isChildren(attrs)) return define(el, {}, attrs);
  if (typeof children === 'string') return define(el, attrs, [text(children)]);
  void Object.entries(attrs)
    .forEach(([name, value]) =>
      typeof value === 'string'
        ? void el.setAttribute(name, value)
        : void el.addEventListener(name.slice(2), value, {
            passive: [
              'wheel',
              'mousewheel',
              'touchstart',
              'touchmove',
            ].includes(name.slice(2)),
          }));
  void [...children]
    .forEach(child =>
      void el.appendChild(child));
}

function isChildren(o: object | string | Iterable<any>): o is string | Iterable<any> {
  return !!o[Symbol.iterator];
}
