const { document } = global;

export type TagNameMap = object;
export type Attrs = Record<string, string | EventListener | null | undefined>;
type Children = Iterable<Node> | string;

export interface Factory<M extends TagNameMap> {
  <T extends Extract<keyof M, string>>(tag: T, children?: Children): M[T];
  <T extends Extract<keyof M, string>>(tag: T, attrs?: Attrs, children?: Children): M[T];
}

const shadows = new WeakMap<Element, ShadowRoot>();

namespace cache {
  export const elem = new Map<string, Element>();
  export const text = document.createTextNode('');
  export const frag = document.createDocumentFragment();
}

export function frag(children?: Children): DocumentFragment {
  children = typeof children === 'string'
    ? [text(children)]
    : children;
  const frag = cache.frag.cloneNode() as DocumentFragment;
  children && void frag.append(...children);
  return frag;
}

export function shadow(el: keyof ShadowHostElementTagNameMap | HTMLElement, opts?: ShadowRootInit): ShadowRoot;
export function shadow(el: keyof ShadowHostElementTagNameMap | HTMLElement, children?: Children, opts?: ShadowRootInit): ShadowRoot;
export function shadow(el: keyof ShadowHostElementTagNameMap | HTMLElement, children?: Children | ShadowRootInit, opts?: ShadowRootInit): ShadowRoot {
  if (typeof el === 'string') return shadow(html(el), children as Children, opts);
  if (children && !isChildren(children)) return shadow(el, undefined, children);
  return el.shadowRoot || shadows.has(el)
    ? define(
        opts
          ? opts.mode === 'open'
            ? el.shadowRoot || el.attachShadow(opts)
            : shadows.get(el) || shadows.set(el, el.attachShadow(opts)).get(el)!
          : el.shadowRoot || shadows.get(el)!,
        children)
    : define(
        !opts || opts.mode === 'open'
          ? el.attachShadow({ mode: 'open' })
          : shadows.set(el, el.attachShadow(opts)).get(el)!,
        children === undefined
          ? el.childNodes
          : children);
}

export function html<T extends keyof HTMLElementTagNameMap>(tag: T, children?: Children): HTMLElementTagNameMap[T];
export function html<T extends keyof HTMLElementTagNameMap>(tag: T, attrs?: Attrs, children?: Children): HTMLElementTagNameMap[T];
export function html<T extends keyof HTMLElementTagNameMap>(tag: T, attrs?: Attrs | Children, children?: Children): HTMLElementTagNameMap[T] {
  return element(document, NS.HTML, tag, attrs, children);
}

export function svg<T extends keyof SVGElementTagNameMap>(tag: T, children?: Children): SVGElementTagNameMap[T];
export function svg<T extends keyof SVGElementTagNameMap>(tag: T, attrs?: Attrs, children?: Children): SVGElementTagNameMap[T];
export function svg<T extends keyof SVGElementTagNameMap>(tag: T, attrs?: Attrs | Children, children?: Children): SVGElementTagNameMap[T] {
  return element(document, NS.SVG, tag, attrs, children);
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

function element<T extends keyof HTMLElementTagNameMap>(context: Document, ns: NS.HTML, tag: T, attrs?: Attrs | Children, children?: Children): HTMLElementTagNameMap[T];
function element<T extends keyof SVGElementTagNameMap>(context: Document, ns: NS.SVG, tag: T, attrs?: Attrs | Children, children?: Children): SVGElementTagNameMap[T];
function element(context: Document, ns: NS, tag: string, attrs?: Attrs | Children, children?: Children): Element {
  const key = `${ns}:${tag}`;
  const el = tag.includes('-')
    ? elem(context, ns, tag)
    : cache.elem.has(key)
      ? cache.elem.get(key)!.cloneNode(true) as Element
      : cache.elem.set(key, elem(context, ns, tag)).get(key)!.cloneNode(true) as Element;
  assert(tag.includes('-') || el !== cache.elem.get(key));
  assert(el.attributes.length === 0);
  assert(el.childNodes.length === 0);
  void define(el, attrs, children);
  return el;
}

function elem(context: Document, ns: NS, tag: string): Element {
  switch (ns) {
    case NS.HTML:
      return context.createElement(tag);
    case NS.SVG:
      return context.createElementNS("http://www.w3.org/2000/svg", tag);
  }
}

export function define<T extends Element | ShadowRoot>(el: T, children?: Children): T;
export function define<T extends Element>(el: T, attrs?: Attrs | Children, children?: Children): T;
export function define<T extends Element>(el: T, attrs?: Attrs | Children, children?: Children): T {
  if (isChildren(attrs)) return define(el, undefined, attrs);
  if (typeof children === 'string') return define(el, attrs, [text(children)]);
  if (attrs) for (const name in attrs) {
    if (!attrs.hasOwnProperty(name)) continue;
    const value = attrs[name];
    switch (typeof value) {
      case 'string':
        void el.setAttribute(name, value);
        continue;
      case 'function':
        if (name.length < 3) throw new Error(`TypedDOM: Attribute names for event listeners must have an event name but got "${name}".`);
        if (!name.startsWith('on')) throw new Error(`TypedDOM: Attribute names for event listeners must start with "on" but got "${name}".`);
        void el.addEventListener(name.slice(2), value, {
          passive: [
            'wheel',
            'mousewheel',
            'touchstart',
            'touchmove',
          ].includes(name.slice(2)),
        });
        continue;
      case 'object':
        void el.removeAttribute(name);
        continue;
      default:
        continue;
    }
  }
  if (children) {
    el.innerHTML = '';
    while (el.firstChild) {
      void el.removeChild(el.firstChild);
    }
    void el.append(...children);
  }
  return el;
}

function isChildren(o: Attrs | Children | ShadowRootInit | undefined): o is Children {
  return !!o && !!o[Symbol.iterator];
}
