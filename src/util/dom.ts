const cache = new Map<string, Element>();

export function html<T extends keyof HTMLElementTagNameMap>(tag: T, children?: Node[] | string): HTMLElementTagNameMap[T];
export function html<T extends keyof HTMLElementTagNameMap>(tag: T, attrs?: Record<string, string>, children?: Node[] | string): HTMLElementTagNameMap[T];
export function html<T extends keyof HTMLElementTagNameMap>(tag: T, attrs: Record<string, string> | Node[] | string = {}, children: Node[] | string = []): HTMLElementTagNameMap[T] {
  return element('html', tag, attrs, children);
}

export function svg<T extends keyof SVGElementTagNameMap_>(tag: T, children?: Node[] | string): SVGElementTagNameMap_[T];
export function svg<T extends keyof SVGElementTagNameMap_>(tag: T, attrs?: Record<string, string>, children?: Node[] | string): SVGElementTagNameMap_[T];
export function svg<T extends keyof SVGElementTagNameMap_>(tag: T, attrs: Record<string, string> | Node[] | string = {}, children: Node[] | string = []): SVGElementTagNameMap_[T] {
  return element('svg', tag, attrs, children);
}

function element<T extends keyof HTMLElementTagNameMap>(ns: 'html', tag: T, attrs?: Record<string, string> | Node[] | string, children?: Node[] | string): HTMLElementTagNameMap[T];
function element<T extends keyof SVGElementTagNameMap_>(ns: 'svg', tag: T, attrs?: Record<string, string> | Node[] | string, children?: Node[] | string): SVGElementTagNameMap_[T];
function element(ns: string, tag: string, attrs: Record<string, string> | Node[] | string = {}, children: Node[] | string = []): Element {
  if (typeof children === 'string') return element(ns as 'html', tag as 'html', attrs as {}, [document.createTextNode(children)]);
  if (typeof attrs === 'string' || Array.isArray(attrs)) return element(ns as 'html', tag as 'html', {}, attrs);
  const key = `${ns}:${tag}`;
  const el = cache.has(key)
    ? cache.get(key)!.cloneNode(true) as Element
    : cache.set(key, elem(ns, tag)).get(key)!.cloneNode(true) as Element;
  assert(el !== cache.get(key));
  assert(el.attributes.length === 0);
  assert(el.childNodes.length === 0);
  void Object.entries(attrs)
    .forEach(([name, value]) =>
      void el.setAttribute(name, value));
  void children
    .forEach(child =>
      void el.appendChild(child));
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
