import { undefined } from 'spica/global';
import { ObjectKeys, ObjectValues } from 'spica/alias';
import { Elem, El, ElChildren } from './proxy';
import { Factory as BaseFactory, TagNameMap, Attrs, shadow, html, svg, define } from '../util/dom';
import { ExtractProp } from 'spica/type';

export type API<M extends TagNameMap, F extends BaseFactory<M> = BaseFactory<M>> =
  BuilderFunction<Extract<keyof ExtractProp<M, Element>, string>, Element, F> &
  { readonly [P in Extract<keyof ExtractProp<M, Element>, string>]: BuilderMethod<P, Extract<M[P], Element>, F>; };
export function API
  <M extends TagNameMap, F extends BaseFactory<M>>
  (baseFactory: F, formatter: <E extends Element>(el: E) => E | ShadowRoot = el => el)
  : API<M, F> {
  return new Proxy<API<M, F>>((() => undefined) as any, handle(baseFactory, formatter));
}

export const Shadow: API<ShadowHostElementTagNameMap> = API(html, shadow);
export const HTML: API<HTMLElementTagNameMap> = API(html);
export const SVG: API<SVGElementTagNameMap> = API(svg);

type Relax<C extends ElChildren> = C extends ElChildren.Text ? ElChildren.Text : C;

interface BuilderFunction<T extends string, E extends Element, F extends BaseFactory<TagNameMap>> {
                        (tag: T,                            factory?: Factory<F, T, ElChildren.Void, E>): El<T, E, ElChildren.Void>;
  <C extends ElChildren>(tag: T,               children: C, factory?: Factory<F, T, C, E>              ): El<T, E, Relax<C>>;
                        (tag: T, attrs: Attrs,              factory?: Factory<F, T, ElChildren.Void, E>): El<T, E, ElChildren.Void>;
  <C extends ElChildren>(tag: T, attrs: Attrs, children: C, factory?: Factory<F, T, C, E>              ): El<T, E, Relax<C>>;
}

interface BuilderMethod<T extends string, E extends Element, F extends BaseFactory<TagNameMap>> {
                        (                           factory?: Factory<F, T, ElChildren.Void, E>): El<T, E, ElChildren.Void>;
  <C extends ElChildren>(              children: C, factory?: Factory<F, T, C, E>              ): El<T, E, Relax<C>>;
                        (attrs: Attrs,              factory?: Factory<F, T, ElChildren.Void, E>): El<T, E, ElChildren.Void>;
  <C extends ElChildren>(attrs: Attrs, children: C, factory?: Factory<F, T, C, E>              ): El<T, E, Relax<C>>;
}

type Factory<F extends BaseFactory<TagNameMap>, T extends string, C extends ElChildren, E extends Element> = (baseFactory: F, tag: T, attrs: Attrs, children: C) => E;

function handle
  <M extends TagNameMap, F extends BaseFactory<M>>
  (baseFactory: F, formatter: <E extends Element>(el: E) => E | ShadowRoot)
  : ProxyHandler<API<M, F>> {
  return {
    apply(target, _, [prop, ...args]) {
      return this.get!(target, prop, target)(...args);
    },
    get: (target, prop) =>
      target[prop] || prop in target || typeof prop !== 'string'
        ? target[prop]
        : target[prop] = builder(prop as Extract<keyof M, string>, baseFactory),
  };

  function builder(tag: Extract<keyof M, string>, baseFactory: F): (attrs?: Attrs, children?: ElChildren, factory?: () => Element) => El {
    return function build(attrs?: Attrs, children?: ElChildren, factory?: Factory<F, Extract<keyof M, string>, ElChildren, Element>): El {
      if (typeof attrs === 'function') return build(undefined, undefined, attrs);
      if (typeof children === 'function') return build(attrs, undefined, children);
      if (attrs !== undefined && isChildren(attrs)) return build(undefined, attrs, factory);
      const node = formatter(elem(factory || defaultFactory, attrs, children));
      return node.nodeType === 1
        ? new Elem(node as Element, children)
        : new Elem((node as ShadowRoot).host, children, node);
    };

    function isChildren(children: ElChildren | Attrs): children is ElChildren {
      return typeof children !== 'object'
          || ObjectValues(children).slice(-1).every(val => typeof val === 'object');
    }

    function elem(factory: Factory<F, Extract<keyof M, string>, ElChildren, Element>, attrs: Attrs | undefined, children: ElChildren): Element {
      const el = factory(baseFactory, tag, attrs || {}, children);
      if (tag !== el.tagName.toLowerCase()) throw new Error(`TypedDOM: Expected tag name is "${tag}" but actually "${el.tagName.toLowerCase()}".`);
      if (factory !== defaultFactory) {
        if (attrs) for (const name of ObjectKeys(attrs)) {
          const value = attrs[name];
          if (typeof value !== 'function') continue;
          el.removeEventListener(name, value);
        }
        define(el, attrs);
      }
      return el;
    }

    function defaultFactory(factory: typeof baseFactory, tag: Extract<keyof M, string>, attrs: Attrs): Element {
      return factory(tag, attrs) as unknown as Element;
    }
  }
}
