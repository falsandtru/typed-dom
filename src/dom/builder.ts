import { El, ElChildren } from './manager';
import { Factory, html, svg, define } from '../util/dom';
import { ExtractProp } from 'spica/type';

interface ElBuilder<T extends string, E extends Element> {
  (factory?: (f: HelperFactory<E>) => E): El<T, E, ElChildren.Void>;                                                   <C extends ElChildren>
  (children: C, factory?: (f: HelperFactory<E>) => E): El<T, E, C>;
  (attrs: Record<string, string | EventListener>, factory?: (f: HelperFactory<E>) => E): El<T, E, ElChildren.Void>;    <C extends ElChildren>
  (attrs: Record<string, string | EventListener>, children: C, factory?: (f: HelperFactory<E>) => E): El<T, E, C>;
}
interface HelperFactory<E extends Element> {
  (children?: Iterable<Node> | string): E;
  (attrs?: Record<string, string | EventListener>, children?: Iterable<Node> | string): E;
}

export type API<T extends object> = {
  readonly [P in Extract<keyof ExtractProp<T, Element>, string>]: T[P] extends Element ? ElBuilder<P, T[P]> : never;
};
export function API<T extends object>(factory: Factory<Element>): API<T> {
  return new Proxy({} as API<T>, handle(factory));
}

export const TypedHTML: API<HTMLElementTagNameMap> = API(html);
export const TypedSVG: API<SVGElementTagNameMap_> = API(svg);

function handle<T extends object>(factory: Factory<Element>): ProxyHandler<T> {
  return {
    get: (obj, prop) =>
      obj[prop] || typeof prop !== 'string'
        ? obj[prop]
        : obj[prop] = builder(prop, (...args: any[]) => factory(prop, ...args)),
  };

  function builder<E extends Element, C extends ElChildren>(tag: string, helperFactory: HelperFactory<E>): (attrs?: Record<string, string | EventListener>, children?: C, factory?: () => E) => El<string, E, C> {
    return function build(attrs?: Record<string, string | EventListener>, children?: C, factory?: () => E): El<string, E, C> {
      if (typeof attrs === 'function') return build(undefined, undefined, attrs);
      if (typeof children === 'function') return build(attrs, undefined, children);
      if (attrs !== undefined && isChildren(attrs)) return build(undefined, attrs, factory);
      return new El(elem(tag, factory || (() => helperFactory()), attrs), children!);
    };

    function isChildren(children: C | Record<string, string | EventListener>): children is C {
      return typeof children !== 'object'
          || Object.values(children as object).slice(-1).every(val => typeof val === 'object');
    }

    function elem(tag: string, factory: (f: HelperFactory<E>) => E, attrs?: Record<string, string | EventListener>): E {
      const el = factory(helperFactory);
      if (tag !== el.tagName.toLowerCase()) throw new Error(`TypedDOM: Tag name must be "${tag}", but got "${el.tagName.toLowerCase()}".`);
      attrs && void define(el, attrs);
      return el;
    }
  }
}
