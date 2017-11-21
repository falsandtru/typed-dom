import { El, ElChildren } from './builder';

interface ElBuilder<T extends string, E extends Element> {
  (factory?: () => E): El<T, E, ElChildren.Void>;                                   <C extends ElChildren>
  (children: C, factory?: () => E): El<T, E, C>;
  (attrs: Record<string, string>, factory?: () => E): El<T, E, ElChildren.Void>;    <C extends ElChildren>
  (attrs: Record<string, string>, children: C, factory?: () => E): El<T, E, C>;
}

type NS =
  | typeof NS.HTML
  | typeof NS.SVG;
namespace NS {
  export const HTML = 'html';
  export const SVG = 'svg';
}

type TypedHTML = {
  readonly [K in keyof HTMLElementTagNameMap]: ElBuilder<K, HTMLElementTagNameMap[K]>;
};
type TypedSVG = {
  readonly [K in keyof SVGElementTagNameMap]: ElBuilder<K, SVGElementTagNameMap[K]>;
};

export const TypedHTML: TypedHTML = new Proxy({} as TypedHTML, handle(NS.HTML));
export const TypedSVG: TypedSVG = new Proxy({} as TypedSVG, handle(NS.SVG));

function handle<T extends object>(ns: NS): ProxyHandler<T> {
  return {
    get: (obj, prop) =>
      obj[prop] || typeof prop !== 'string'
        ? obj[prop]
        : obj[prop] = builder(ns, prop),
  };

  function builder<E extends Element, C extends ElChildren>(ns: NS, tag: string): (attrs?: Record<string, string>, children?: C, factory?: () => E) => El<string, E, C> {
    return function build(attrs?: Record<string, string>, children?: C, factory?: () => E): El<string, E, C> {
      if (typeof attrs === 'function') return build(undefined, undefined, attrs);
      if (typeof children === 'function') return build(attrs, undefined, children);
      if (attrs !== undefined && isChildren(attrs)) return build(undefined, attrs, factory);
      return new El(elem(tag, factory, attrs), children!);

      function isChildren(children: any): children is C {
        return typeof children !== 'object'
            || Object.values(children).slice(-1).every(val => typeof val === 'object');
      }

      function elem(tag: string, factory?: () => E, attrs?: Record<string, string>): E {
        factory = factory || factory_;
        const el = factory();
        if (tag !== el.tagName.toLowerCase()) throw new Error(`TypedDOM: Tag name must be "${tag}", but got "${el.tagName.toLowerCase()}".`);
        if (!attrs) return el;
        void Object.keys(attrs)
          .forEach(name =>
            void el.setAttribute(name, attrs[name]));
        return el;

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
    };
  }
}
