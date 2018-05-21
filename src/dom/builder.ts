import { El, ElChildren } from './manager';
import { Factory as HelperFactory, html, svg, define } from '../util/dom';
import { ExtractProp } from 'spica/type';

interface ElBuilder<T extends string, E extends Element, F extends HelperFactory<Element>> {
  (factory?: Factory<F, T, E>): El<T, E, ElChildren.Void>;                                                   <C extends ElChildren>
  (children: C, factory?: Factory<F, T, E>): El<T, E, C>;
  (attrs: Record<string, string | EventListener>, factory?: Factory<F, T, E>): El<T, E, ElChildren.Void>;    <C extends ElChildren>
  (attrs: Record<string, string | EventListener>, children: C, factory?: Factory<F, T, E>): El<T, E, C>;
}
type Factory<F extends HelperFactory<Element>, T extends string, E extends Element> = (factory: F, tag: T) => E;

export type API<T extends object, F extends HelperFactory<Element>> = {
  readonly [P in Extract<keyof ExtractProp<T, Element>, string>]: T[P] extends Element ? ElBuilder<P, T[P], F> : never;
};
export function API<T extends object, F extends HelperFactory<Element>>(helperFactory: F): API<T, F> {
  return new Proxy({} as API<T, F>, handle(helperFactory));
}

export const TypedHTML: API<HTMLElementTagNameMap, typeof html> = API(html);
export const TypedSVG: API<SVGElementTagNameMap_, typeof svg> = API(svg);

function handle<T extends object, F extends HelperFactory<Element>>(helperFactory: F): ProxyHandler<T> {
  return {
    get: (obj, prop) =>
      obj[prop] || typeof prop !== 'string'
        ? obj[prop]
        : obj[prop] = builder(prop, helperFactory),
  };

  function builder<E extends Element, C extends ElChildren>(tag: string, helperFactory: F): (attrs?: Record<string, string | EventListener>, children?: C, factory?: () => E) => El<string, E, C> {
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
      const el = factory(helperFactory, tag);
      if (tag !== el.tagName.toLowerCase()) throw new Error(`TypedDOM: Tag name must be "${tag}", but got "${el.tagName.toLowerCase()}".`);
      attrs && void define(el, attrs);
      return el;
    }
  }
}
