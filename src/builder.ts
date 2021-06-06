import { hasOwnProperty } from 'spica/alias';
import { Elem, El, ElChildren } from './proxy';
import { Factory, TagNameMap, Attrs, shadow, html, svg, define } from './util/dom';

export type API
  <M extends TagNameMap, F extends Factory<M> = Factory<M>> =
  BuilderFunction<Extract<keyof M, string>, Element, F> &
  { readonly [P in Extract<keyof M, string>]: BuilderMethod<P, Extract<M[P], Element>, F>; };
export function API
  <M extends TagNameMap, F extends Factory<M> = Factory<M>>
  (baseFactory: F, formatter: <E extends Element>(el: E) => E | ShadowRoot = el => el)
  : API<M, F> {
  return new Proxy<API<M, F>>((() => void 0) as any, handle(baseFactory, formatter));
}

export const Shadow = API<ShadowHostElementTagNameMap>(html, shadow);
export const HTML = API<HTMLElementTagNameMap>(html);
export const SVG = API<SVGElementTagNameMap>(svg);

type ElFactory<F extends Factory<TagNameMap>, T extends string, C extends ElChildren, E extends Element> = (baseFactory: F, tag: T, attrs: Attrs, children: C) => E;

interface BuilderFunction<T extends string, E extends Element, F extends Factory<TagNameMap>> {
                               (tag: T,                            factory?: ElFactory<F, T, ElChildren.Void, E>): El<T, E, ElChildren.Void>;
  <C extends ElChildren.Text  >(tag: T,               children: C, factory?: ElFactory<F, T, C, E>              ): El<T, E, string>;
  <C extends ElChildren.Array >(tag: T,               children: C, factory?: ElFactory<F, T, C, E>              ): El<T, E, Readonly<C>>;
  <C extends ElChildren.Record>(tag: T,               children: C, factory?: ElFactory<F, T, C, E>              ): El<T, E, C>;
                               (tag: T, attrs: Attrs,              factory?: ElFactory<F, T, ElChildren.Void, E>): El<T, E, ElChildren.Void>;
  <C extends ElChildren.Text  >(tag: T, attrs: Attrs, children: C, factory?: ElFactory<F, T, C, E>              ): El<T, E, string>;
  <C extends ElChildren.Array >(tag: T, attrs: Attrs, children: C, factory?: ElFactory<F, T, C, E>              ): El<T, E, Readonly<C>>;
  <C extends ElChildren.Record>(tag: T, attrs: Attrs, children: C, factory?: ElFactory<F, T, C, E>              ): El<T, E, C>;
}

interface BuilderMethod<T extends string, E extends Element, F extends Factory<TagNameMap>> {
                               (                                   factory?: ElFactory<F, T, ElChildren.Void, E>): El<T, E, ElChildren.Void>;
  <C extends ElChildren.Text  >(                      children: C, factory?: ElFactory<F, T, C, E>              ): El<T, E, string>;
  <C extends ElChildren.Array >(                      children: C, factory?: ElFactory<F, T, C, E>              ): El<T, E, Readonly<C>>;
  <C extends ElChildren.Record>(                      children: C, factory?: ElFactory<F, T, C, E>              ): El<T, E, C>;
                               (        attrs: Attrs,              factory?: ElFactory<F, T, ElChildren.Void, E>): El<T, E, ElChildren.Void>;
  <C extends ElChildren.Text  >(        attrs: Attrs, children: C, factory?: ElFactory<F, T, C, E>              ): El<T, E, string>;
  <C extends ElChildren.Array >(        attrs: Attrs, children: C, factory?: ElFactory<F, T, C, E>              ): El<T, E, Readonly<C>>;
  <C extends ElChildren.Record>(        attrs: Attrs, children: C, factory?: ElFactory<F, T, C, E>              ): El<T, E, C>;
}

function handle
  <M extends TagNameMap, F extends Factory<M>>
  (baseFactory: F, formatter: <E extends Element>(el: E) => E | ShadowRoot,
): ProxyHandler<API<M, F>> {
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
    return function build(attrs?: Attrs, children?: ElChildren, factory?: ElFactory<F, Extract<keyof M, string>, ElChildren, Element>): El {
      if (typeof attrs === 'function') return build(void 0, void 0, attrs);
      if (typeof children === 'function') return build(attrs, void 0, children);
      if (attrs !== void 0 && isElChildren(attrs)) return build(void 0, attrs, factory);
      const node = formatter(elem(factory, attrs, children));
      return node.nodeType === 1
        ? new Elem(node as Element, children)
        : new Elem((node as ShadowRoot).host, children, node);
    };

    function isElChildren(children: ElChildren | Attrs): children is ElChildren {
      if (typeof children !== 'object') return true;
      for (const i in children) {
        if (!hasOwnProperty(children, i)) continue;
        return typeof children[i] === 'object';
      }
      return true;
    }

    function elem(factory: ElFactory<F, Extract<keyof M, string>, ElChildren, Element> | undefined, attrs: Attrs | undefined, children: ElChildren): Element {
      const el = factory
        ? define(factory(baseFactory as F, tag, attrs || {}, children), attrs)
        : baseFactory(tag, attrs) as unknown as Element;
      if (tag !== el.tagName.toLowerCase()) throw new Error(`TypedDOM: Expected tag name is "${tag}" but actually "${el.tagName.toLowerCase()}".`);
      return el;
    }
  }
}
