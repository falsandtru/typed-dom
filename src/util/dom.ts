import { isArray, hasOwnProperty } from 'spica/alias';
import { memoize } from 'spica/memoize';

declare global {
  interface ShadowHostHTMLElementTagNameMap {
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
  interface HTMLElementTagNameMap extends ShadowHostHTMLElementTagNameMap {
  }
}

export const enum NS {
  HTML = 'HTML',
  SVG = 'SVG',
  Math = 'MathML',
}

// {HTML,SVG,}ElementEventMapを使用しないがEvent型しか使われてないので問題ない
interface NodeEvent<N extends Node> extends Event {
  readonly target: Node;
  readonly currentTarget: N;
}
type NodeEventListener<N extends Node> = (ev: NodeEvent<N>) => void;

export type TagNameMap = object;
export type Attrs<E extends Element = Element> = Record<string, string | NodeEventListener<E> | null | undefined>;
export type Children = Iterable<string | Node> | string | undefined;

export interface Factory<M extends TagNameMap> {
  <T extends keyof M & string>(tag: T, children?: Children): M[T];
  <T extends keyof M & string>(tag: T, attrs: Attrs<Extract<M[T], Element>> | undefined, children?: Children): M[T];
}

namespace caches {
  export const shadows = new WeakMap<Element, ShadowRoot>();
  export const shadow = memoize((el: Element, opts: ShadowRootInit) => el.attachShadow(opts), shadows);
  export const fragment = document.createDocumentFragment();
}

export function shadow<M extends ShadowHostHTMLElementTagNameMap>(el: keyof M & string | Extract<M[keyof M & string], Element>, factory?: Factory<M>): ShadowRoot;
export function shadow<M extends ShadowHostHTMLElementTagNameMap>(el: keyof M & string | Extract<M[keyof M & string], Element>, children?: Children, factory?: Factory<M>): ShadowRoot;
export function shadow<M extends ShadowHostHTMLElementTagNameMap>(el: keyof M & string | Extract<M[keyof M & string], Element>, opts?: ShadowRootInit, factory?: Factory<M>): ShadowRoot;
export function shadow<M extends ShadowHostHTMLElementTagNameMap>(el: keyof M & string | Extract<M[keyof M & string], Element>, opts?: ShadowRootInit, children?: Children, factory?: Factory<M>): ShadowRoot;
export function shadow<M extends ShadowHostHTMLElementTagNameMap>(el: keyof M & string | Extract<M[keyof M & string], Element>, opts?: ShadowRootInit | Factory<M> | Children, children?: Factory<M> | Children, factory: Factory<M> = html as unknown as Factory<M>): ShadowRoot {
  if (typeof el === 'string') return shadow(factory(el) as Extract<M[keyof M & string], Element>, opts as ShadowRootInit, children as Children, factory);
  if (typeof opts === 'function') return shadow(el, undefined, children as Children, opts);
  if (typeof children === 'function') return shadow(el, opts as ShadowRootInit, undefined, children);
  if (isChildren(opts)) return shadow(el, undefined, opts, factory);
  return defineChildren(
    !opts
      ? el.shadowRoot ?? caches.shadows.get(el) ?? el.attachShadow({ mode: 'open' })
      : opts.mode === 'open'
        ? el.shadowRoot ?? el.attachShadow(opts)
        : caches.shadows.get(el) ?? caches.shadow(el, opts),
    children);
}

export function frag(children?: Children): DocumentFragment {
  return defineChildren(caches.fragment.cloneNode(true) as DocumentFragment, children);
}

export const html = element<HTMLElementTagNameMap>(document, NS.HTML);
export const svg = element<SVGElementTagNameMap>(document, NS.SVG);
export const math = element<MathMLElementTagNameMap>(document, NS.Math);

export function text(source: string): Text {
  return document.createTextNode(source);
}

export function element<M extends HTMLElementTagNameMap>(context: Document | ShadowRoot, ns: NS.HTML): Factory<M>;
export function element<M extends SVGElementTagNameMap>(context: Document | ShadowRoot, ns: NS.SVG): Factory<M>;
export function element<M extends MathMLElementTagNameMap>(context: Document | ShadowRoot, ns: NS.Math): Factory<M>;
export function element<M extends TagNameMap>(context: Document | ShadowRoot, ns: NS): Factory<M> {
  return (tag: string, attrs?: Attrs | Children, children?: Children) => {
    return !attrs || isChildren(attrs)
      ? defineChildren(elem(context, ns, tag, {}), attrs ?? children)
      : defineChildren(defineAttrs(elem(context, ns, tag, attrs), attrs), children);
  };
}

function elem(context: Document | ShadowRoot, ns: NS, tag: string, attrs: Attrs): Element {
  if (!('createElement' in context)) throw new Error(`TypedDOM: Scoped custom elements are not supported on this browser`);
  const opts = 'is' in attrs ? { is: attrs['is'] as string } : undefined;
  switch (ns) {
    case NS.HTML:
      return context.createElement(tag, opts);
    case NS.SVG:
      return context.createElementNS('http://www.w3.org/2000/svg', tag, opts);
    case NS.Math:
      return context.createElementNS('http://www.w3.org/1998/Math/MathML', tag, opts);
  }
}

export function define<E extends Element>(el: E, attrs?: Attrs<E>, children?: Children): E;
export function define<E extends Element | DocumentFragment | ShadowRoot>(node: E, children?: Children): E;
export function define<E extends Element | DocumentFragment | ShadowRoot>(node: E, attrs?: Attrs | Children, children?: Children): E {
  // Bug: TypeScript
  // Need the next type assertions to suppress an impossible type error on dependent projects.
  // Probably caused by typed-query-selector.
  //
  //   typed-dom/dom.ts(113,3): Error TS2322: Type 'ParentNode & Node' is not assignable to type 'E'.
  //     'E' could be instantiated with an arbitrary type which could be unrelated to 'ParentNode & Node'.
  //
  return !attrs || isChildren(attrs)
    ? defineChildren(node, attrs ?? children) as E
    : defineChildren(defineAttrs(node as Element, attrs), children) as E;
}
function defineAttrs<E extends Element>(el: E, attrs: Attrs): E {
  for (const name of Object.keys(attrs)) {
    switch (name) {
      case 'is':
        continue;
    }
    const value = attrs[name];
    switch (typeof value) {
      case 'string':
        el.setAttribute(name, value);
        if (name.startsWith('on')) {
          const type = name.slice(2).toLowerCase();
          switch (type) {
            case 'mutate':
            case 'connect':
            case 'disconnect':
              const prop = `on${type}`;
              el[prop] ?? Object.defineProperty(el, prop, {
                configurable: true,
                enumerable: false,
                writable: true,
                value: prop in el && !hasOwnProperty(el, prop)
                  ? (ev: Event) => ev.returnValue
                  : '',
              });
              assert.deepStrictEqual({ ...el }, {});
          }
        }
        continue;
      case 'function':
        if (name.length < 3) throw new Error(`TypedDOM: Attribute names for event listeners must have an event name but got "${name}"`);
        const names = name.split(/\s+/);
        for (const name of names) {
          if (!name.startsWith('on')) throw new Error(`TypedDOM: Attribute names for event listeners must start with "on" but got "${name}"`);
          const type = name.slice(2).toLowerCase();
          el.addEventListener(type, value, {
            passive: [
              'wheel',
              'mousewheel',
              'touchstart',
              'touchmove',
              'touchend',
              'touchcancel',
            ].includes(type),
          });
          switch (type) {
            case 'mutate':
            case 'connect':
            case 'disconnect':
              const prop = `on${type}`;
              el[prop] ?? Object.defineProperty(el, prop, {
                configurable: true,
                enumerable: false,
                writable: true,
                value: prop in el && !hasOwnProperty(el, prop)
                  ? (ev: Event) => ev.returnValue
                  : '',
              });
              assert.deepStrictEqual({ ...el }, {});
          }
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
function defineChildren<N extends ParentNode & Node>(node: N, children: Children | readonly (string | Node)[]): N {
  if (children === undefined) return node;
  if (typeof children === 'string') {
    node.textContent = children;
  }
  else if (isArray(children) && !node.firstChild) {
    for (let i = 0; i < children.length; ++i) {
      const child = children[i];
      typeof child === 'object'
        ? node.appendChild(child)
        : node.append(child);
    }
  }
  else {
    node.replaceChildren(...children);
  }
  return node;
}

export function isChildren(value: Attrs | Children | ShadowRootInit): value is NonNullable<Children> {
  return value?.[Symbol.iterator] !== undefined;
}

export function append<N extends ParentNode & Node>(node: N, children: Children): N {
  if (children === undefined) return node;
  if (typeof children === 'string') {
    node.append(children);
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

export function prepend<N extends ParentNode & Node>(node: N, children: Children): N {
  if (children === undefined) return node;
  if (typeof children === 'string') {
    node.prepend(children);
  }
  else {
    for (const child of children) {
      typeof child === 'object'
        ? node.insertBefore(child, null)
        : node.prepend(child);
    }
  }
  return node;
}

export function defrag<N extends Node | string>(nodes: ArrayLike<N>): N[];
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
