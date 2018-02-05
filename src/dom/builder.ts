import { El, ElChildren } from './manager';
import { html } from '../util/dom';

interface ElBuilder<T extends string, E extends Element> {
  (factory?: () => E): El<T, E, ElChildren.Void>;                                                   <C extends ElChildren>
  (children: C, factory?: () => E): El<T, E, C>;
  (attrs: Record<string, string | EventListener>, factory?: () => E): El<T, E, ElChildren.Void>;    <C extends ElChildren>
  (attrs: Record<string, string | EventListener>, children: C, factory?: () => E): El<T, E, C>;
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
  readonly [K in keyof SVGElementTagNameMap_]: ElBuilder<K, SVGElementTagNameMap_[K]>;
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

  function builder<E extends Element, C extends ElChildren>(ns: NS, tag: string): (attrs?: Record<string, string | EventListener>, children?: C, factory?: () => E) => El<string, E, C> {
    return function build(attrs?: Record<string, string | EventListener>, children?: C, factory?: () => E): El<string, E, C> {
      if (typeof attrs === 'function') return build(undefined, undefined, attrs);
      if (typeof children === 'function') return build(attrs, undefined, children);
      if (attrs !== undefined && isChildren(attrs)) return build(undefined, attrs, factory);
      return new El(elem(tag, factory, attrs), children as C);

      function isChildren(children: C | Record<string, string | EventListener>): children is C {
        return typeof children !== 'object'
            || Object.values(children as object).slice(-1).every(val => typeof val === 'object');
      }

      function elem(tag: string, factory?: () => E, attrs?: Record<string, string | EventListener>): E {
        const el = factory
          ? factory()
          : ns === NS.HTML
            ? html(tag as keyof HTMLElementTagNameMap, {}, []) as Element as E
            : factory_();
        if (tag !== el.tagName.toLowerCase()) throw new Error(`TypedDOM: Tag name must be "${tag}", but got "${el.tagName.toLowerCase()}".`);
        if (!attrs) return el;
        for (const [name, value] of Object.entries(attrs)) {
          typeof value === 'string'
            ? void el.setAttribute(name, value)
            : void el.addEventListener(name.slice(2), value, {
              passive: [
                'wheel',
                'mousewheel',
                'touchstart',
                'touchmove',
              ].includes(name.slice(2)),
            });
        }
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
