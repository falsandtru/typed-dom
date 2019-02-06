export type TagNameMap = object;
export type Attrs = Record<string, string | EventListener | null | undefined>;
type Children = Iterable<Node> | string;

export interface Factory<M extends TagNameMap> {
  <T extends keyof M>(tag: T, children?: Children): M[T];
  <T extends keyof M>(tag: T, attrs?: Attrs, children?: Children): M[T];
}

namespace cache {
  export const elem = new Map<string, Element>();
  export const text = document.createTextNode('');
  export const frag = document.createDocumentFragment();
}

export function frag(children: Children = []): DocumentFragment {
  children = typeof children === 'string' ? [text(children)] : children;
  const frag = cache.frag.cloneNode() as DocumentFragment;
  void frag.append(...children);
  return frag;
}

export function shadow(el: Element, opts?: ShadowRootInit): ShadowRoot;
export function shadow(el: Element, children?: Children, opts?: ShadowRootInit): ShadowRoot;
export function shadow(el: Element, children?: Children | ShadowRootInit, opts: ShadowRootInit = { mode: 'closed' }): ShadowRoot {
  if (children !== undefined && !isChildren(children)) return shadow(el, undefined, children);
  if (typeof children === 'string') return shadow(el, [text(children)]);
  return define(el.attachShadow(opts), children);
}

export function html<T extends keyof HTMLElementTagNameMap>(tag: T, children?: Children): HTMLElementTagNameMap[T];
export function html<T extends keyof HTMLElementTagNameMap>(tag: T, attrs?: Attrs, children?: Children): HTMLElementTagNameMap[T];
export function html<T extends keyof HTMLElementTagNameMap>(tag: T, attrs: Attrs | Children = {}, children: Children = []): HTMLElementTagNameMap[T] {
  return element(NS.HTML, tag, attrs, children);
}

export function svg<T extends keyof SVGElementTagNameMap_>(tag: T, children?: Children): SVGElementTagNameMap_[T];
export function svg<T extends keyof SVGElementTagNameMap_>(tag: T, attrs?: Attrs, children?: Children): SVGElementTagNameMap_[T];
export function svg<T extends keyof SVGElementTagNameMap_>(tag: T, attrs: Attrs | Children = {}, children: Children = []): SVGElementTagNameMap_[T] {
  return element(NS.SVG, tag, attrs, children);
}

export function text(source: string): Text {
  const text = cache.text.cloneNode() as Text;
  text.data = source;
  return text;
}

const enum NS {
  HTML,
  SVG,
}

function element<T extends keyof HTMLElementTagNameMap>(ns: NS.HTML, tag: T, attrs?: Attrs | Children, children?: Children): HTMLElementTagNameMap[T];
function element<T extends keyof SVGElementTagNameMap_>(ns: NS.SVG, tag: T, attrs?: Attrs | Children, children?: Children): SVGElementTagNameMap_[T];
function element(ns: NS, tag: string, attrs: Attrs | Children = {}, children: Children = []): Element {
  const key = `${ns}:${tag}`;
  const el = tag.includes('-')
    ? elem(ns, tag)
    : cache.elem.has(key)
      ? cache.elem.get(key)!.cloneNode(true) as Element
      : cache.elem.set(key, elem(ns, tag)).get(key)!.cloneNode(true) as Element;
  assert(tag.includes('-') || el !== cache.elem.get(key));
  assert(el.attributes.length === 0);
  assert(el.childNodes.length === 0);
  void define(el, attrs, children);
  return el;
}

function elem(ns: NS, tag: string): Element {
  switch (ns) {
    case NS.HTML:
      return document.createElement(tag);
    case NS.SVG:
      return document.createElementNS("http://www.w3.org/2000/svg", tag);
    default:
      throw new Error(`TypedDOM: Unknown namespace: ${ns}`);
  }
}

export function define<T extends Element | ShadowRoot>(el: T, children?: Children): T;
export function define<T extends Element>(el: T, attrs?: Attrs | Children, children?: Children): T;
export function define<T extends Element>(el: T, attrs: Attrs | Children = {}, children?: Children): T {
  if (isChildren(attrs)) return define(el, undefined, attrs);
  if (typeof children === 'string') return define(el, attrs, [text(children)]);
  void Object.entries(attrs)
    .forEach(([name, value]) => {
      switch (typeof value) {
        case 'string':
          return void el.setAttribute(name, value);
        case 'function':
          assert(name.startsWith('on'));
          return void el.addEventListener(name.slice(2), value, {
            passive: [
              'wheel',
              'mousewheel',
              'touchstart',
              'touchmove',
            ].includes(name.slice(2)),
          });
        case 'object':
          return void el.removeAttribute(name);
        default:
          return;
      }
    });
  if (children) {
    el.innerHTML = '';
    while (el.firstChild) {
      void el.removeChild(el.firstChild);
    }
    void el.append(...children);
  }
  return el;
}

function isChildren(o: Attrs | Children | ShadowRootInit): o is Children {
  return !!o[Symbol.iterator];
}
