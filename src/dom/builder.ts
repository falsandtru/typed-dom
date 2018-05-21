import { El, ElChildren } from './manager';
import { Factory as BaseFactory, html, svg, define } from '../util/dom';
import { ExtractProp } from 'spica/type';

interface ElBuilder<T extends string, E extends Element, F extends BaseFactory<object>> {
  (factory?: Factory<F, T, E>): El<T, E, ElChildren.Void>;                                                   <C extends ElChildren>
  (children: C, factory?: Factory<F, T, E>): El<T, E, C>;
  (attrs: Record<string, string | EventListener>, factory?: Factory<F, T, E>): El<T, E, ElChildren.Void>;    <C extends ElChildren>
  (attrs: Record<string, string | EventListener>, children: C, factory?: Factory<F, T, E>): El<T, E, C>;
}
type Factory<F extends BaseFactory<object>, T extends string, E extends Element> = (baseFactory: F, tag: T) => E;

export type API<M extends object, F extends BaseFactory<M>> = {
  readonly [P in Extract<keyof ExtractProp<M, Element>, string>]: M[P] extends Element ? ElBuilder<P, M[P], F> : never;
};
export function API<M extends object, F extends BaseFactory<M>>(baseFactory: F): API<M, F> {
  return new Proxy({} as API<M, F>, handle(baseFactory));
}

export const TypedHTML: API<HTMLElementTagNameMap, typeof html> = API(html);
export const TypedSVG: API<SVGElementTagNameMap_, typeof svg> = API(svg);

function handle<T extends object, F extends BaseFactory<object>>(baseFactory: F): ProxyHandler<T> {
  return {
    get: (obj, prop) =>
      obj[prop] || typeof prop !== 'string'
        ? obj[prop]
        : obj[prop] = builder(prop, baseFactory),
  };

  function builder<E extends Element, C extends ElChildren>(tag: string, baseFactory: F): (attrs?: Record<string, string | EventListener>, children?: C, factory?: () => E) => El<string, E, C> {
    return function build(attrs?: Record<string, string | EventListener>, children?: C, factory?: Factory<F, string, E>): El<string, E, C> {
      if (typeof attrs === 'function') return build(undefined, undefined, attrs);
      if (typeof children === 'function') return build(attrs, undefined, children);
      if (attrs !== undefined && isChildren(attrs)) return build(undefined, attrs, factory);
      return new El(elem(factory || ((f, tag) => f(tag) as E), attrs), children!);
    };

    function isChildren(children: C | Record<string, string | EventListener>): children is C {
      return typeof children !== 'object'
          || Object.values(children as object).slice(-1).every(val => typeof val === 'object');
    }

    function elem(factory: Factory<F, string, E>, attrs?: Record<string, string | EventListener>): E {
      const el = factory(baseFactory, tag);
      if (tag !== el.tagName.toLowerCase()) throw new Error(`TypedDOM: Tag name must be "${tag}", but got "${el.tagName.toLowerCase()}".`);
      attrs && void define(el, attrs);
      return el;
    }
  }
}
