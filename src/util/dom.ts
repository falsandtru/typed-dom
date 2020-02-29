import { Symbol, document } from 'spica/global';
import { isArray, ObjectKeys } from 'spica/alias';
import { memoize } from 'spica/memoize';

const enum NS {
  HTML = 'HTML',
  SVG = 'SVG',
}

export type TagNameMap = object;
export type Attrs = Record<string, string | EventListener | null | undefined>;
export type Children = Iterable<string | Node> | string;

export interface Factory<M extends TagNameMap> {
  <T extends Extract<keyof M, string>>(tag: T, children?: Children): M[T];
  <T extends Extract<keyof M, string>>(tag: T, attrs?: Attrs, children?: Children): M[T];
}

const shadows = new WeakMap<Element, ShadowRoot>();

namespace caches {
  export const elem = memoize<Document | Element, Map<string, Element>>(() => new Map(), new WeakMap());
  export const frag = document.createDocumentFragment();
}

export function frag(children?: Children): DocumentFragment {
  if (typeof children === 'string') return frag([children]);
  const node = caches.frag.cloneNode() as DocumentFragment;
  children && void node.append(...children);
  return node;
}

export function shadow(el: keyof ShadowHostElementTagNameMap | HTMLElement, opts?: ShadowRootInit): ShadowRoot;
export function shadow(el: keyof ShadowHostElementTagNameMap | HTMLElement, children?: Children, opts?: ShadowRootInit): ShadowRoot;
export function shadow(el: keyof ShadowHostElementTagNameMap | HTMLElement, children?: Children | ShadowRootInit, opts?: ShadowRootInit): ShadowRoot {
  if (typeof el === 'string') return shadow(html(el), children as Children, opts);
  if (children && !isChildren(children)) return shadow(el, void 0, children);
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
        children === void 0
          ? el.childNodes
          : children);
}

export function html<T extends keyof HTMLElementTagNameMap>(tag: T, children?: Children): HTMLElementTagNameMap[T];
export function html<T extends keyof HTMLElementTagNameMap>(tag: T, attrs?: Attrs, children?: Children): HTMLElementTagNameMap[T];
export function html<T extends keyof HTMLElementTagNameMap>(tag: T, attrs?: Attrs | Children, children?: Children): HTMLElementTagNameMap[T] {
  return element(document, NS.HTML, tag, attrs as Attrs, children);
}

export function svg<T extends keyof SVGElementTagNameMap>(tag: T, children?: Children): SVGElementTagNameMap[T];
export function svg<T extends keyof SVGElementTagNameMap>(tag: T, attrs?: Attrs, children?: Children): SVGElementTagNameMap[T];
export function svg<T extends keyof SVGElementTagNameMap>(tag: T, attrs?: Attrs | Children, children?: Children): SVGElementTagNameMap[T] {
  return element(document, NS.SVG, tag, attrs as Attrs, children);
}

export function text(source: string): Text {
  return document.createTextNode(source);
}

export function element<T extends keyof HTMLElementTagNameMap>(context: Document, ns: NS.HTML, tag: T, children?: Children): HTMLElementTagNameMap[T];
export function element<T extends keyof HTMLElementTagNameMap>(context: Document, ns: NS.HTML, tag: T, attrs?: Attrs, children?: Children): HTMLElementTagNameMap[T];
export function element<T extends keyof SVGElementTagNameMap>(context: Document, ns: NS.SVG, tag: T, children?: Children): SVGElementTagNameMap[T];
export function element<T extends keyof SVGElementTagNameMap>(context: Document, ns: NS.SVG, tag: T, attrs?: Attrs, children?: Children): SVGElementTagNameMap[T];
export function element(context: Document | Element, ns: NS, tag: string, children?: Children): Element;
export function element(context: Document | Element, ns: NS, tag: string, attrs?: Attrs, children?: Children): Element;
export function element(context: Document | Element, ns: NS, tag: string, attrs?: Attrs | Children, children?: Children): Element {
  const cache = caches.elem(context);
  const key = `${ns}:${tag}`;
  const el = tag.includes('-')
    ? elem(context, ns, tag)
    : cache.has(key)
      ? cache.get(key)!.cloneNode(true) as Element
      : cache.set(key, elem(context, ns, tag)).get(key)!.cloneNode(true) as Element;
  assert(tag.includes('-') || el !== cache.get(key));
  assert(el.attributes.length === 0);
  assert(el.childNodes.length === 0);
  void define(el, attrs as Attrs, children);
  return el;
}

function elem(context: Document | Element, ns: NS, tag: string): Element {
  if ('id' in context) throw new Error(`TypedDOM: Scoped custom elements are not supported.`);
  switch (ns) {
    case NS.HTML:
      return context.createElement(tag);
    case NS.SVG:
      return context.createElementNS("http://www.w3.org/2000/svg", tag);
  }
}

export function define<T extends Element | ShadowRoot>(el: T, children?: Children): T;
export function define<T extends Element>(el: T, attrs?: Attrs, children?: Children): T;
export function define<T extends Element>(el: T, attrs?: Attrs | Children, children?: Children): T {
  if (isChildren(attrs)) return define(el, void 0, attrs);
  if (typeof children === 'string') return define(el, attrs, [children]);
  if (attrs) for (const name of ObjectKeys(attrs)) {
    const value = attrs[name];
    switch (typeof value) {
      case 'string':
        void el.setAttribute(name, value);
        continue;
      case 'function':
        if (name.length < 3) throw new Error(`TypedDOM: Attribute names for event listeners must have an event name but got "${name}".`);
        if (name.slice(0, 2) !== 'on') throw new Error(`TypedDOM: Attribute names for event listeners must start with "on" but got "${name}".`);
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
    const targetNodes = el.childNodes;
    let targetLength = targetNodes.length;
    let count = 0;
    if (targetLength === 0) {
      void el.append(...children);
    }
    else if (isArray(children)) {
      I:
      for (const child of children as (string | Node)[]) {
        if (typeof child === 'object' && child.nodeType === 11) {
          const sourceNodes = child.childNodes;
          const sourceLength = sourceNodes.length;
          void el.insertBefore(child, targetNodes[count] || null);
          count += sourceLength;
          targetLength += sourceLength;
          continue;
        }
        void ++count;
        while (targetLength > count) {
          const node = targetNodes[count - 1];
          if (equal(node, child)) continue I;
          void node.remove();
          void --targetLength;
        }
        const node = targetNodes[count - 1] || null;
        if (node && equal(node, child)) continue;
        void el.insertBefore(typeof child === 'string' ? text(child) : child, node);
        void ++targetLength;
      }
      while (count < targetLength) {
        void targetNodes[count].remove();
        void --targetLength;
      }
    }
    else {
      for (const child of children) {
        if (typeof child === 'object' && child.nodeType === 11) {
          const sourceNodes = child.childNodes;
          const sourceLength = sourceNodes.length;
          void el.insertBefore(child, targetNodes[count] || null);
          count += sourceLength;
          targetLength += sourceLength;
          continue;
        }
        void ++count;
        const node = targetNodes[count - 1] || null;
        if (node && equal(node, child)) continue;
        void el.insertBefore(typeof child === 'string' ? text(child) : child, node);
        void ++targetLength;
      }
      while (count < targetLength) {
        void targetNodes[count].remove();
        void --targetLength;
      }
    }
  }
  return el;
}

function isChildren(o: Attrs | Children | ShadowRootInit | undefined): o is Children {
  return !!o?.[Symbol.iterator];
}

function equal(node: Node | Text, data: Node | Text | string): boolean {
  return typeof data === 'string'
    ? 'wholeText' in node && data === node.data
    : data === node;
}
