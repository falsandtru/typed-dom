export type TagNameMap = object;
export type Attrs = Record<string, string | EventListener>;
type Children = Iterable<Node> | string;

export interface Factory<M extends TagNameMap> {
  <T extends keyof M>(tag: T, children?: Children): M[T];
  <T extends keyof M>(tag: T, attrs?: Attrs, children?: Children): M[T];
}

export function observe<F extends Factory<TagNameMap>>(factory: F, callback: (record: MutationRecord[]) => void, opts?: MutationObserverInit): F;
export function observe<M extends TagNameMap>(factory: Factory<M>, callback: (record: MutationRecord[]) => void, opts: MutationObserverInit = { childList: true }): Factory<M> {
  return (tag: keyof M, ...args: any[]) => {
    const obs = new MutationObserver(callback);
    const el = factory(tag) as any as Element;
    void obs.observe(el, opts);
    void define(el, ...args);
    return el as any as M[keyof M];
  };
}

const cache = new Map<string, Element>();

export function html<T extends keyof HTMLElementTagNameMap>(tag: T, children?: Children): HTMLElementTagNameMap[T];
export function html<T extends keyof HTMLElementTagNameMap>(tag: T, attrs?: Attrs, children?: Children): HTMLElementTagNameMap[T];
export function html<T extends keyof HTMLElementTagNameMap>(tag: T, attrs: Attrs | Children = {}, children: Children = []): HTMLElementTagNameMap[T] {
  return element('html', tag, attrs, children);
}

export function svg<T extends keyof SVGElementTagNameMap_>(tag: T, children?: Children): SVGElementTagNameMap_[T];
export function svg<T extends keyof SVGElementTagNameMap_>(tag: T, attrs?: Attrs, children?: Children): SVGElementTagNameMap_[T];
export function svg<T extends keyof SVGElementTagNameMap_>(tag: T, attrs: Attrs | Children = {}, children: Children = []): SVGElementTagNameMap_[T] {
  return element('svg', tag, attrs, children);
}

export function frag(children: Children = []): DocumentFragment {
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

function element<T extends keyof HTMLElementTagNameMap>(ns: 'html', tag: T, attrs?: Attrs | Children, children?: Children): HTMLElementTagNameMap[T];
function element<T extends keyof SVGElementTagNameMap_>(ns: 'svg', tag: T, attrs?: Attrs | Children, children?: Children): SVGElementTagNameMap_[T];
function element(ns: string, tag: string, attrs: Attrs | Children = {}, children: Children = []): Element {
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

export function define(el: Element, children?: Children): void;
export function define(el: Element, attrs?: Attrs | Children, children?: Children): void;
export function define(el: Element, attrs: Attrs | Children = {}, children: Children = []): void {
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

function isChildren(o: Attrs | Children): o is Children {
  return !!o[Symbol.iterator];
}
