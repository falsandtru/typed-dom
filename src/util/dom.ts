import { undefined, Symbol, document } from 'spica/global';
import { isArray, ObjectKeys } from 'spica/alias';
import { memoize } from 'spica/memoize';
import { curry, uncurry } from 'spica/curry';

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
  export const fragment = document.createDocumentFragment();
  export const element = memoize(
    (context: Document | Element) =>
      memoize(
        uncurry(curry(elem)(context)),
        (ns, tag) => `${ns}:${tag}`),
    new WeakMap());
}

export function frag(children?: Children): DocumentFragment {
  return defineChildren(caches.fragment.cloneNode() as DocumentFragment, children);
}

export function shadow(el: keyof ShadowHostElementTagNameMap | HTMLElement, opts?: ShadowRootInit): ShadowRoot;
export function shadow(el: keyof ShadowHostElementTagNameMap | HTMLElement, children?: Children, opts?: ShadowRootInit): ShadowRoot;
export function shadow(el: keyof ShadowHostElementTagNameMap | HTMLElement, children?: Children | ShadowRootInit, opts?: ShadowRootInit): ShadowRoot {
  if (typeof el === 'string') return shadow(html(el), children as Children, opts);
  if (children && !isChildren(children)) return shadow(el, undefined, children);
  const root = opts === undefined
    ? el.shadowRoot || shadows.get(el)
    : opts.mode === 'open'
      ? el.shadowRoot || undefined
      : shadows.get(el);
  return defineChildren(
    !opts || opts.mode === 'open'
      ? root || el.attachShadow(opts || { mode: 'open' })
      : root || shadows.set(el, el.attachShadow(opts)).get(el)!,
    !root && children == undefined
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
  const el = tag.includes('-')
    ? elem(context, ns, tag)
    : caches.element(context)(ns, tag).cloneNode(true) as Element;
  assert(el.attributes.length === 0);
  assert(el.childNodes.length === 0);
  return isChildren(attrs)
    ? defineChildren(el, attrs)
    : defineChildren(defineAttrs(el, attrs), children);
}

function elem(context: Document | Element, ns: NS, tag: string): Element {
  if ('id' in context) throw new Error(`TypedDOM: Scoped custom elements are not supported yet.`);
  switch (ns) {
    case NS.HTML:
      return context.createElement(tag);
    case NS.SVG:
      return context.createElementNS('http://www.w3.org/2000/svg', tag);
  }
}

export function define<T extends Element | DocumentFragment | ShadowRoot>(el: T, children?: Children): T;
export function define<T extends Element>(el: T, attrs?: Attrs, children?: Children): T;
export function define<T extends Element>(el: T, attrs?: Attrs | Children, children?: Children): T {
  return isChildren(attrs)
    ? defineChildren(el, attrs)
    : defineChildren(defineAttrs(el, attrs), children);
}
function defineAttrs<T extends Element>(el: T, attrs?: Attrs): T {
  if (!attrs) return el;
  for (const name of ObjectKeys(attrs)) {
    const value = attrs[name];
    switch (typeof value) {
      case 'string':
        el.setAttribute(name, value);
        continue;
      case 'function':
        if (name.length < 3) throw new Error(`TypedDOM: Attribute names for event listeners must have an event name but got "${name}".`);
        if (name.slice(0, 2) !== 'on') throw new Error(`TypedDOM: Attribute names for event listeners must start with "on" but got "${name}".`);
        el.addEventListener(name.slice(2), value, {
          passive: [
            'wheel',
            'mousewheel',
            'touchstart',
            'touchmove',
          ].includes(name.slice(2)),
        });
        continue;
      case 'object':
        el.removeAttribute(name);
        continue;
      default:
        continue;
    }
  }
  return el;
}
function defineChildren<T extends DocumentFragment | ShadowRoot | Element>(el: T, children?: Children): T {
  switch (typeof children) {
    case 'undefined':
      return el;
    case 'string':
      return defineChildren(el, [children]);
  }
  const targetNodes = el.firstChild ? el.childNodes : [];
  let targetLength = targetNodes.length;
  if (targetLength === 0) {
    el.append(...children);
    return el;
  }
  if (!isArray(children)) return defineChildren(el, [...children]);
  let count = 0;
  I:
  for (let i = 0; i < children.length; ++i) {
    assert(count <= targetLength);
    if (count === targetLength) {
      el.append(...children.slice(i));
      return el;
    }
    const child: string | Node = children[i];
    if (typeof child === 'object' && child.nodeType === 11) {
      const sourceLength = child.childNodes.length;
      el.insertBefore(child, targetNodes[count] || null);
      count += sourceLength;
      targetLength += sourceLength;
      continue;
    }
    ++count;
    while (targetLength > children.length) {
      const node = targetNodes[count - 1];
      if (equal(node, child)) continue I;
      node.remove();
      --targetLength;
    }
    const node = targetNodes[count - 1];
    if (equal(node, child)) continue;
    if (targetLength < children.length - i + count) {
      el.insertBefore(typeof child === 'string' ? text(child) : child, node);
      ++targetLength;
    }
    else {
      el.replaceChild(typeof child === 'string' ? text(child) : child, node);
    }
  }
  assert(count <= targetLength);
  while (count < targetLength) {
    targetNodes[count].remove();
    --targetLength;
  }
  return el;
}

function isChildren(o: Attrs | Children | ShadowRootInit | undefined): o is Children {
  return !!o?.[Symbol.iterator];
}

function equal(node: Node | Text, data: Node | Text | string): boolean {
  return typeof data === 'string'
    ? 'wholeText' in node && node.data === data
    : node === data;
}
