import { Symbol, document } from 'spica/global';
import { hasOwnProperty } from 'spica/alias';
import { memoize } from 'spica/memoize';

declare global {
  interface ShadowHostElementTagNameMap {
    'article': HTMLElement;
    'aside': HTMLElement;
    'blockquote': HTMLQuoteElement;
    'body': HTMLBodyElement;
    'div': HTMLDivElement;
    'footer': HTMLElement;
    'h1': HTMLHeadingElement;
    'h2': HTMLHeadingElement;
    'h3': HTMLHeadingElement;
    'h4': HTMLHeadingElement;
    'h5': HTMLHeadingElement;
    'h6': HTMLHeadingElement;
    'header': HTMLElement;
    'main': HTMLElement;
    'nav': HTMLElement;
    'p': HTMLParagraphElement;
    'section': HTMLElement;
    'span': HTMLSpanElement;
  }
  interface HTMLElementTagNameMap extends ShadowHostElementTagNameMap {
  }
}

export const enum NS {
  HTML = 'HTML',
  SVG = 'SVG',
}

export type TagNameMap = object;
export type Attrs = Record<string, string | EventListener | null | undefined>;
export type Children = Iterable<string | Node> | string;

export interface Factory<M extends TagNameMap> {
  <T extends keyof M & string>(tag: T, children?: Children): M[T];
  <T extends keyof M & string>(tag: T, attrs?: Attrs, children?: Children): M[T];
}

namespace caches {
  export const shadows = new WeakMap<Element, ShadowRoot>();
  export const fragment = document.createDocumentFragment();
}

export function shadow(el: keyof ShadowHostElementTagNameMap | Element, opts?: ShadowRootInit): ShadowRoot;
export function shadow(el: keyof ShadowHostElementTagNameMap | Element, children?: Children, opts?: ShadowRootInit): ShadowRoot;
export function shadow(el: keyof ShadowHostElementTagNameMap | Element, children?: Children | ShadowRootInit, opts?: ShadowRootInit): ShadowRoot {
  if (typeof el === 'string') return shadow(html(el), children as Children, opts);
  if (children && !isChildren(children)) return shadow(el, void 0, children);
  const root = opts === void 0
    ? el.shadowRoot ?? caches.shadows.get(el)
    : opts.mode === 'open'
      ? el.shadowRoot ?? void 0
      : caches.shadows.get(el);
  return defineChildren(
    !opts || opts.mode === 'open'
      ? root ?? el.attachShadow(opts ?? { mode: 'open' })
      : root ?? caches.shadows.set(el, el.attachShadow(opts)).get(el)!,
    !root && children === void 0
      ? el.childNodes
      : children);
}

export function frag(children?: Children): DocumentFragment {
  return defineChildren(caches.fragment.cloneNode(true) as DocumentFragment, children);
}

export const html = element<HTMLElementTagNameMap>(document, NS.HTML);
export const svg = element<SVGElementTagNameMap>(document, NS.SVG);

export function text(source: string): Text {
  return document.createTextNode(source);
}

export function element<M extends HTMLElementTagNameMap>(context: Document | ShadowRoot, ns: NS.HTML): Factory<M>;
export function element<M extends SVGElementTagNameMap>(context: Document | ShadowRoot, ns: NS.SVG): Factory<M>;
export function element<M extends TagNameMap>(context: Document | ShadowRoot, ns: NS): Factory<M> {
  const cache = memoize(elem, (_, ns, tag) => `${ns}:${tag}`);
  return (tag: string, attrs?: Attrs | Children, children?: Children) => {
    const el = tag.includes('-')
      ? elem(context, ns, tag)
      : cache(context, ns, tag).cloneNode(true) as Element;
    assert(el.attributes.length === 0);
    assert(el.childNodes.length === 0);
    return isChildren(attrs)
      ? defineChildren(el, attrs)
      : defineChildren(defineAttrs(el, attrs), children);
  };
}

function elem(context: Document | ShadowRoot, ns: NS, tag: string): Element {
  if (!('createElement' in context)) throw new Error(`TypedDOM: Scoped custom elements are not supported on this browser.`);
  switch (ns) {
    case NS.HTML:
      return context.createElement(tag);
    case NS.SVG:
      return context.createElementNS('http://www.w3.org/2000/svg', tag);
  }
}

export function define<T extends Element>(el: T, attrs?: Attrs, children?: Children): T;
export function define<T extends Element | DocumentFragment | ShadowRoot>(node: T, children?: Children): T;
export function define<T extends Element>(node: T, attrs?: Attrs | Children, children?: Children): T {
  return isChildren(attrs)
    ? defineChildren(node, attrs)
    : defineChildren(defineAttrs(node, attrs), children);
}
function defineAttrs<T extends Element>(el: T, attrs?: Attrs): T {
  if (!attrs) return el;
  for (const name in attrs) {
    if (!hasOwnProperty(attrs, name)) continue;
    const value = attrs[name];
    switch (typeof value) {
      case 'string':
        el.setAttribute(name, value);
        continue;
      case 'function':
        if (name.length < 3) throw new Error(`TypedDOM: Attribute names for event listeners must have an event name but got "${name}".`);
        const names = name.split(/\s+/);
        for (const name of names) {
          if (name.slice(0, 2) !== 'on') throw new Error(`TypedDOM: Attribute names for event listeners must start with "on" but got "${name}".`);
          el.addEventListener(name.slice(2), value, {
            passive: [
              'wheel',
              'mousewheel',
              'touchstart',
              'touchmove',
              'touchend',
              'touchcancel',
            ].includes(name.slice(2)),
          });
        }
        continue;
      case 'object':
        assert(value === null);
        el.removeAttribute(name);
        continue;
      default:
        continue;
    }
  }
  return el;
}
function defineChildren<T extends ParentNode & Node>(node: T, children?: Children): T {
  if (children === void 0) return node;
  if (typeof children === 'string') {
    node.textContent = children;
  }
  else if (node.firstChild) {
    node.replaceChildren(...children);
  }
  else {
    for (const child of children) {
      typeof child === 'object'
        ? node.appendChild(child)
        : node.append(child);
    }
  }
  return node;
}

export function isChildren(param: Attrs | Children | ShadowRootInit | undefined): param is Children {
  return !!param?.[Symbol.iterator];
}

export function defrag<T extends Node | string>(nodes: ArrayLike<T>): T[];
export function defrag(nodes: ArrayLike<Node | string>): (Node | string)[] {
  assert(Array.from(nodes).every(n => typeof n === 'string' || n instanceof Node));
  const acc: (Node | string)[] = [];
  let appendable = false;
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
    if (node === '') continue;
    if (typeof node === 'string') {
      appendable
        ? acc[acc.length - 1] += node
        : acc.push(node);
      appendable = true;
    }
    else {
      acc.push(node);
      appendable = false;
    }
  }
  return acc;
}
