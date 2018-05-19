import { El, ElChildren } from './manager';
import { html, svg } from '../util/dom';

interface ElBuilder<T extends string, E extends Element> {
  (factory?: (f: Factory<E>) => E): El<T, E, ElChildren.Void>;                                                   <C extends ElChildren>
  (children: C, factory?: (f: Factory<E>) => E): El<T, E, C>;
  (attrs: Record<string, string | EventListener>, factory?: (f: Factory<E>) => E): El<T, E, ElChildren.Void>;    <C extends ElChildren>
  (attrs: Record<string, string | EventListener>, children: C, factory?: (f: Factory<E>) => E): El<T, E, C>;
}
interface Factory<E extends Element> {
  (children?: Iterable<Node> | string): E;
  (attrs?: Record<string, string>, children?: Iterable<Node> | string): E;
}
interface DefaultFactory<E extends Element> {
  (tag: string, children?: Iterable<Node> | string): E;
  (tag: string, attrs?: Record<string, string>, children?: Iterable<Node> | string): E;
}

type TypedHTML = {
  readonly [T in keyof HTMLElementTagNameMap]: ElBuilder<T, HTMLElementTagNameMap[T]>;
};
type TypedSVG = {
  readonly [T in keyof SVGElementTagNameMap_]: ElBuilder<T, SVGElementTagNameMap_[T]>;
};

export const TypedHTML: TypedHTML = new Proxy({} as TypedHTML, handle(html));
export const TypedSVG: TypedSVG = new Proxy({} as TypedSVG, handle(svg));

function handle<T extends object>(defaultFactory: DefaultFactory<Element>): ProxyHandler<T> {
  return {
    get: (obj, prop) =>
      obj[prop] || typeof prop !== 'string'
        ? obj[prop]
        : obj[prop] = builder(prop, (...args: any[]) => defaultFactory(prop, ...args)),
  };

  function builder<E extends Element, C extends ElChildren>(tag: string, defaultFactory: Factory<E>): (attrs?: Record<string, string | EventListener>, children?: C, factory?: () => E) => El<string, E, C> {
    return function build(attrs?: Record<string, string | EventListener>, children?: C, factory?: () => E): El<string, E, C> {
      if (typeof attrs === 'function') return build(undefined, undefined, attrs);
      if (typeof children === 'function') return build(attrs, undefined, children);
      if (attrs !== undefined && isChildren(attrs)) return build(undefined, attrs, factory);
      return new El(elem(tag, factory || (() => defaultFactory()), attrs), children as C);
    };

    function isChildren(children: C | Record<string, string | EventListener>): children is C {
      return typeof children !== 'object'
          || Object.values(children as object).slice(-1).every(val => typeof val === 'object');
    }

    function elem(tag: string, factory: (f: Factory<E>) => E, attrs?: Record<string, string | EventListener>): E {
      const el = factory(defaultFactory);
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
    }
  }
}
