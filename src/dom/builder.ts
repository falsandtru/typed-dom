import { Elem, El, ElChildren } from './proxy';
import { Factory as BaseFactory, TagNameMap, Attrs, shadow, html, svg, define } from '../util/dom';
import { ExtractProp } from 'spica/type';

export type API<M extends TagNameMap, F extends BaseFactory<M>> =
  BuilderFunction<Extract<keyof ExtractProp<M, Element>, string>, Element, F> &
  { readonly [P in Extract<keyof ExtractProp<M, Element>, string>]: BuilderMethod<P, Extract<M[P], Element>, F>; };
export function API
  <M extends TagNameMap, F extends BaseFactory<M>>
  (baseFactory: F, formatter: <E extends Element>(el: E) => E | ShadowRoot = el => el)
  : API<M, F> {
  return new Proxy<API<M, F>>((() => undefined) as any, handle(baseFactory, formatter));
}

export const Shadow: API<ShadowHostElementTagNameMap, typeof html> = API(html, shadow);
export const HTML: API<HTMLElementTagNameMap, typeof html> = API(html);
export const SVG: API<SVGElementTagNameMap_, typeof svg> = API(svg);

interface BuilderFunction<T extends string, E extends Element, F extends BaseFactory<TagNameMap>> {
                        (tag: T,                            factory?: Factory<F, T, ElChildren.Void, E>): El<T, E, ElChildren.Void>;
  <C extends ElChildren>(tag: T,               children: C, factory?: Factory<F, T, C, E>              ): El<T, E, C>;
                        (tag: T, attrs: Attrs,              factory?: Factory<F, T, ElChildren.Void, E>): El<T, E, ElChildren.Void>;
  <C extends ElChildren>(tag: T, attrs: Attrs, children: C, factory?: Factory<F, T, C, E>              ): El<T, E, C>;
}

interface BuilderMethod<T extends string, E extends Element, F extends BaseFactory<TagNameMap>> {
                        (                           factory?: Factory<F, T, ElChildren.Void, E>): El<T, E, ElChildren.Void>;
  <C extends ElChildren>(              children: C, factory?: Factory<F, T, C, E>              ): El<T, E, C>;
                        (attrs: Attrs,              factory?: Factory<F, T, ElChildren.Void, E>): El<T, E, ElChildren.Void>;
  <C extends ElChildren>(attrs: Attrs, children: C, factory?: Factory<F, T, C, E>              ): El<T, E, C>;
}

type Factory<F extends BaseFactory<TagNameMap>, T extends string, C extends ElChildren, E extends Element> = (baseFactory: F, tag: T, attrs: Attrs, children: C) => E;

function handle
  <M extends TagNameMap, F extends BaseFactory<M>>
  (baseFactory: F, formatter: <E extends Element>(el: E) => E | ShadowRoot)
  : ProxyHandler<API<M, F>> {
  return {
    apply(obj, _, [prop, ...args]) {
      return this.get!(obj, prop, undefined)(...args);
    },
    get: (obj, prop) =>
      obj[prop] || prop in obj || typeof prop !== 'string'
        ? obj[prop]
        : obj[prop] = builder(prop as Extract<keyof M, string>, baseFactory),
  };

  function builder(tag: Extract<keyof M, string>, baseFactory: F): (attrs?: Attrs, children?: ElChildren, factory?: () => Element) => El<string, Element, ElChildren> {
    return function build(attrs?: Attrs, children?: ElChildren, factory?: Factory<F, Extract<keyof M, string>, ElChildren, Element>): El<string, Element, ElChildren> {
      if (typeof attrs === 'function') return build(undefined, undefined, attrs);
      if (typeof children === 'function') return build(attrs, undefined, children);
      if (attrs !== undefined && isChildren(attrs)) return build(undefined, attrs, factory);
      const node = formatter(elem(factory || defaultFactory, attrs || {}, children));
      return node instanceof Element
        ? new Elem(node, children as string)
        : new Elem(node.host, children as string, node);
    };

    function isChildren(children: ElChildren | Attrs): children is ElChildren {
      return typeof children !== 'object'
          || Object.values(children).slice(-1).every(val => typeof val === 'object');
    }

    function elem(factory: Factory<F, Extract<keyof M, string>, ElChildren, Element>, attrs: Attrs, children: ElChildren): Element {
      const el = factory(baseFactory, tag, attrs, children);
      if (tag !== el.tagName.toLowerCase()) throw new Error(`TypedDOM: Tag name must be "${tag}", but got "${el.tagName.toLowerCase()}".`);
      if (factory !== defaultFactory) {
        for (const [k, v] of Object.entries(attrs)) {
          if (typeof v !== 'function') continue;
          void el.removeEventListener(k, v);
        }
        void define(el, attrs);
      }
      return el;
    }
    
    function defaultFactory(factory: typeof baseFactory, tag: Extract<keyof M, string>, attrs: Attrs): Element {
      return factory(tag, attrs) as any as Element;
    }
  }
}
