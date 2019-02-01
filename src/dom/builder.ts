import { El, ElChildren as Children, Relax } from './manager';
import { Factory as BaseFactory, TagNameMap, Attrs, html, svg, define } from '../util/dom';
import { ExtractProp } from 'spica/type';

export type API<M extends TagNameMap, F extends BaseFactory<M>> =
  BuilderFunction<Extract<keyof ExtractProp<M, Element>, string>, Element, F> &
  { readonly [P in Extract<keyof ExtractProp<M, Element>, string>]: BuilderMethod<P, Extract<M[P], Element>, F>; };
export function API<M extends TagNameMap, F extends BaseFactory<M>>(baseFactory: F): API<M, F> {
  return new Proxy<API<M, F>>((() => undefined) as any, handle(baseFactory));
}

export const TypedHTML: API<HTMLElementTagNameMap, typeof html> = API(html);
export const TypedSVG: API<SVGElementTagNameMap_, typeof svg> = API(svg);

interface BuilderFunction<T extends string, E extends Element, F extends BaseFactory<TagNameMap>> {
                      (tag: T,                            factory?: Factory<F, T, Children.Void, E>): El<T, E, Children.Void>;
  <C extends Children>(tag: T,               children: C, factory?: Factory<F, T, C, E>            ): El<T, E, C>;
                      (tag: T, attrs: Attrs,              factory?: Factory<F, T, Children.Void, E>): El<T, E, Children.Void>;
  <C extends Children>(tag: T, attrs: Attrs, children: C, factory?: Factory<F, T, C, E>            ): El<T, E, C>;
}

interface BuilderMethod<T extends string, E extends Element, F extends BaseFactory<TagNameMap>> {
                      (                           factory?: Factory<F, T, Children.Void, E>): El<T, E, Children.Void>;
  <C extends Children>(              children: C, factory?: Factory<F, T, C, E>            ): El<T, E, C>;
                      (attrs: Attrs,              factory?: Factory<F, T, Children.Void, E>): El<T, E, Children.Void>;
  <C extends Children>(attrs: Attrs, children: C, factory?: Factory<F, T, C, E>            ): El<T, E, C>;
}

type Factory<F extends BaseFactory<TagNameMap>, T extends string, C extends Children, E extends Element> = (baseFactory: F, tag: T, attrs: Attrs, children: C) => E;

function handle<M extends TagNameMap, F extends BaseFactory<M>>(baseFactory: F): ProxyHandler<API<M, F>> {
  return {
    apply: (obj, _, args) =>
      obj[args[0]](...args.slice(1)),
    get: (obj, prop) =>
      obj[prop] || prop in obj || typeof prop !== 'string'
        ? obj[prop]
        : obj[prop] = builder(prop as Extract<keyof M, string>, baseFactory),
  };

  function builder(tag: Extract<keyof M, string>, baseFactory: F): (attrs?: Attrs, children?: Children, factory?: () => Element) => El<string, Element, Children> {
    return function build(attrs?: Attrs, children?: Children, factory?: Factory<F, string, Children, Element>): El<string, Element, Children> {
      if (typeof attrs === 'function') return build(undefined, undefined, attrs);
      if (typeof children === 'function') return build(attrs, undefined, children);
      if (attrs !== undefined && isChildren(attrs)) return build(undefined, attrs, factory);
      return new El(elem(factory || ((f, tag) => f(tag) as any as Element), attrs || {}, children), children as Relax<Children> as string);
    };

    function isChildren(children: Children | Attrs): children is Children {
      return typeof children !== 'object'
          || Object.values(children).slice(-1).every(val => typeof val === 'object');
    }

    function elem(factory: Factory<F, Extract<keyof M, string>, Children, Element>, attrs: Attrs, children: Children): Element {
      const el = factory(baseFactory, tag, attrs, children);
      if (tag !== el.tagName.toLowerCase()) throw new Error(`TypedDOM: Tag name must be "${tag}", but got "${el.tagName.toLowerCase()}".`);
      void define(el, attrs);
      return el;
    }
  }
}
