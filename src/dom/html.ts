import { El, ElChildren } from './builder';

type NS =
  | typeof NS.HTML
  | typeof NS.SVG;
namespace NS {
  export const HTML = 'html';
  export const SVG = 'svg';
}

interface ElBuilder<T extends string, E extends Element> {
  (factory?: () => E): El<T, E, ElChildren.Void>;                                   <C extends ElChildren>
  (children: C, factory?: () => E): El<T, E, C>;
  (attrs: Record<string, string>, factory?: () => E): El<T, E, ElChildren.Void>;    <C extends ElChildren>
  (attrs: Record<string, string>, children: C, factory?: () => E): El<T, E, C>;
}

type TypedHTML = {
  //readonly [K in keyof HTMLElementTagNameMap]: ElBuilder<K, HTMLElementTagNameMap[K]>;
  readonly [K in keyof ElementTagNameMap]: ElBuilder<K, ElementTagNameMap[K]>;
};
export const TypedHTML: TypedHTML = new Proxy({} as TypedHTML, {
  get: (obj, tag) =>
    obj[tag]
      ? obj[tag]
      : obj[tag] = builder(NS.HTML, `${tag}`),
});

/*
type TypedSVG = {
  readonly [K in keyof SVGElementTagNameMap]: ElBuilder<K, SVGElementTagNameMap[K]>;
};
export const TypedSVG: TypedSVG = new Proxy({} as TypedSVG, {
  get: (obj, tag) =>
    obj[tag]
      ? obj[tag]
      : obj[tag] = builder(NS.SVG, `${tag}`),
});
*/

function builder<E extends Element, C extends ElChildren>(ns: NS, tag: string): (attrs?: Record<string, string>, children?: C, factory?: () => E) => El<string, E, C> {
  return function build(attrs?: Record<string, string>, children?: C, factory?: () => E): El<string, E, C> {
    if (typeof attrs === 'function') return build(undefined, undefined, attrs);
    if (typeof children === 'function') return build(attrs, undefined, children);
    if (attrs !== undefined && isChildren(attrs)) return build(undefined, attrs, factory);
    return new El(define(tag, factory || factory_, attrs), children!);
  };

  function isChildren(children: any): children is C {
    return typeof children !== 'object'
        || Object.values(children).slice(-1).every(val => typeof val === 'object');
  }

  function define(tag: string, factory: () => E = factory_, attrs?: Record<string, string>): E {
    const el = factory();
    if (tag !== el.tagName.toLowerCase()) throw new Error(`TypedDOM: Tag name must be "${tag}" but got "${el.tagName.toLowerCase()}".`);
    if (!attrs) return el;
    void Object.keys(attrs)
      .forEach(name =>
        void el.setAttribute(name, attrs[name]));
    return el;
  }

  function factory_(): E {
    switch (ns) {
      case NS.HTML:
        return document.createElement(tag) as Element as E;
      case NS.SVG:
        return document.createElementNS("http://www.w3.org/2000/svg", tag) as Element as E;
      default:
        throw new Error(`TypedDOM: Namespace must be "${NS.HTML}" or "${NS.SVG}", but got "${ns}".`);
    }
  }
}
