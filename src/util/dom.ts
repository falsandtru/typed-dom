import { undefined, Symbol, document } from 'spica/global';
import { isArray, ObjectKeys } from 'spica/alias';
import { memoize } from 'spica/memoize';
import { curry, uncurry } from 'spica/curry';

export const enum NS {
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

export const html = element<HTMLElementTagNameMap>(document, NS.HTML);
export const svg = element<SVGElementTagNameMap>(document, NS.SVG);

export function text(source: string): Text {
  return document.createTextNode(source);
}

export function element<M extends TagNameMap>(context: Document | Element, ns: NS) {
  return element;

  function element<T extends keyof M>(tag: T, children?: Children): M[T];
  function element<T extends keyof M>(tag: T, attrs?: Attrs, children?: Children): M[T];
  function element(tag: string, attrs?: Attrs | Children, children?: Children): Element {
    const el = tag.includes('-')
      ? elem(context, ns, tag)
      : caches.element(context)(ns, tag).cloneNode(true) as Element;
    assert(el.attributes.length === 0);
    assert(el.childNodes.length === 0);
    return isChildren(attrs)
      ? defineChildren(el, attrs)
      : defineChildren(defineAttrs(el, attrs), children);
  }
}

function elem(context: Document | Element, ns: NS, tag: string): Element {
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
function defineChildren<T extends DocumentFragment | ShadowRoot | Element>(node: T, children?: Children | NodeListOf<ChildNode>): T {
  switch (typeof children) {
    case 'undefined':
      return node;
    case 'string':
      return defineChildren(node, [children]);
  }
  if (!isArray(children)) {
    if (!('length' in children)) return defineChildren(node, [...children]);
    const ns: (string | Node)[] = [];
    for (let i = 0, len = children.length; i < len; ++i) {
      ns.push(children[i]);
    }
    return defineChildren(node, ns);
  }
  const targetNodes = node.firstChild ? node.childNodes : [];
  let targetLength = targetNodes.length;
  if (targetLength === 0) {
    node.append(...children);
    return node;
  }
  let count = 0;
  I:
  for (let i = 0; i < children.length; ++i) {
    assert(count <= targetLength);
    if (count === targetLength) {
      node.append(...children.slice(i));
      return node;
    }
    const newChild: string | Node = children[i];
    if (typeof newChild === 'object' && newChild.nodeType === 11) {
      const sourceLength = newChild.childNodes.length;
      node.insertBefore(newChild, targetNodes[count] || null);
      count += sourceLength;
      targetLength += sourceLength;
      continue;
    }
    ++count;
    while (targetLength > children.length) {
      const oldChild = targetNodes[count - 1];
      if (equal(oldChild, newChild)) continue I;
      oldChild.remove();
      --targetLength;
    }
    const oldChild = targetNodes[count - 1];
    if (equal(oldChild, newChild)) continue;
    if (targetLength < children.length - i + count) {
      node.insertBefore(typeof newChild === 'string' ? text(newChild) : newChild, oldChild);
      ++targetLength;
    }
    else {
      node.replaceChild(typeof newChild === 'string' ? text(newChild) : newChild, oldChild);
    }
  }
  assert(count <= targetLength);
  while (count < targetLength) {
    targetNodes[count].remove();
    --targetLength;
  }
  return node;
}

function isChildren(o: Attrs | Children | ShadowRootInit | undefined): o is Children {
  return !!o?.[Symbol.iterator];
}

function equal(node: Node | Text, data: Node | Text | string): boolean {
  return typeof data === 'string'
    ? 'wholeText' in node && node.data === data
    : node === data;
}
