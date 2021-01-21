import { undefined } from 'spica/global';
import { hasOwnProperty } from 'spica/alias';
import { Elem, El, ElChildren } from './proxy';
import { Factory, TagNameMap, Attrs, shadow, html, svg } from './util/dom';

export type API
  <M extends TagNameMap, F extends Factory<M> = Factory<M>> =
  BuilderFunction<Extract<keyof M, string>, Element, F> &
  { readonly [P in Extract<keyof M, string>]: BuilderMethod<P, Extract<M[P], Element>, F>; };
export function API
  <M extends TagNameMap, F extends Factory<M> = Factory<M>>
  (baseFactory: F, formatter: <E extends Element>(el: E) => E | ShadowRoot = el => el)
  : API<M, F> {
  return new Proxy<API<M, F>>((() => undefined) as any, handle(baseFactory, formatter));
}

export const Shadow = API<ShadowHostElementTagNameMap>(html, shadow);
export const HTML = API<HTMLElementTagNameMap>(html);
export const SVG = API<SVGElementTagNameMap>(svg);

type ElFactory<F extends Factory<TagNameMap>, T extends string, C extends ElChildren, E extends Element> = (baseFactory: F, tag: T, attrs: Attrs, children: C) => E;

type Adjust<C extends ElChildren> =
  C extends ElChildren.Text ? ElChildren.Text :
  C extends ElChildren.Array ? Readonly<C> :
  C;

interface BuilderFunction<T extends string, E extends Element, F extends Factory<TagNameMap>> {
                        (tag: T,                            factory?: ElFactory<F, T, ElChildren.Void, E>): El<T, E, ElChildren.Void>;
  <C extends ElChildren>(tag: T,               children: C, factory?: ElFactory<F, T, C, E>              ): El<T, E, Adjust<C>>;
                        (tag: T, attrs: Attrs,              factory?: ElFactory<F, T, ElChildren.Void, E>): El<T, E, ElChildren.Void>;
  <C extends ElChildren>(tag: T, attrs: Attrs, children: C, factory?: ElFactory<F, T, C, E>              ): El<T, E, Adjust<C>>;
}

interface BuilderMethod<T extends string, E extends Element, F extends Factory<TagNameMap>> {
                        (                           factory?: ElFactory<F, T, ElChildren.Void, E>): El<T, E, ElChildren.Void>;
  <C extends ElChildren>(              children: C, factory?: ElFactory<F, T, C, E>              ): El<T, E, Adjust<C>>;
                        (attrs: Attrs,              factory?: ElFactory<F, T, ElChildren.Void, E>): El<T, E, ElChildren.Void>;
  <C extends ElChildren>(attrs: Attrs, children: C, factory?: ElFactory<F, T, C, E>              ): El<T, E, Adjust<C>>;
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
      if (typeof attrs === 'function') return build(undefined, undefined, attrs);
      if (typeof children === 'function') return build(attrs, undefined, children);
      if (attrs !== undefined && isChildren(attrs)) return build(undefined, attrs, factory);
      const node = formatter(elem(factory || defaultFactory, attrs || {}, children));
      return node.nodeType === 1
        ? new Elem(node as Element, children)
        : new Elem((node as ShadowRoot).host, children, node);
    };

    function isChildren(children: ElChildren | Attrs): children is ElChildren {
      if (typeof children !== 'object') return true;
      for (const i in children) {
        if (!hasOwnProperty(children, i)) continue;
        return typeof children[i] === 'object';
      }
      return true;
    }

    function elem(factory: ElFactory<F, Extract<keyof M, string>, ElChildren, Element>, attrs: Attrs, children: ElChildren): Element {
      const el = factory(baseFactory, tag, attrs, children);
      if (tag !== el.tagName.toLowerCase()) throw new Error(`TypedDOM: Expected tag name is "${tag}" but actually "${el.tagName.toLowerCase()}".`);
      return el;
    }

    function defaultFactory(factory: typeof baseFactory, tag: Extract<keyof M, string>, attrs: Attrs): Element {
      return factory(tag, attrs) as unknown as Element;
    }
  }
}
