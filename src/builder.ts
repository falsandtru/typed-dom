import { Symbol } from 'spica/global';
import { hasOwnProperty } from 'spica/alias';
import { Elem, El } from './proxy';
import { Factory, TagNameMap, Attrs, shadow, html, svg, define } from './util/dom';

export type API
  <M extends TagNameMap, F extends Factory<M> = Factory<M>> =
  BuilderFunction<M, F> &
  { readonly [P in K<M>]: BuilderMethod<M, F, P, E<M[P]>>; };
export function API
  <M extends TagNameMap, F extends Factory<M> = Factory<M>>
  (baseFactory: F, formatter: <E extends Element>(el: E) => E | ShadowRoot = el => el)
  : API<M, F> {
  return new Proxy<API<M, F>>((() => void 0) as any, handle(baseFactory, formatter));
}

export const Shadow = API<ShadowHostElementTagNameMap>(html, shadow);
export const HTML = API<HTMLElementTagNameMap>(html);
export const SVG = API<SVGElementTagNameMap>(svg);

type Empty = readonly [];
type ElFactory<M extends TagNameMap, F extends Factory<M>, T extends K<M>, C extends El.Children, E extends Element> = (baseFactory: F, tag: T, attrs: Attrs, children: C) => E;
type K<M> = keyof M & string;
type E<V> = Extract<V, Element>;

interface BuilderFunction<M extends TagNameMap, F extends Factory<M>> {
  <T extends K<M>, C extends El.Children.Void  >(tag: T,                              factory?: ElFactory<M, F, T, C, E<M[T]>>): El<T, E<M[T]>, El.Children.Void>;
  <T extends K<M>, C extends Empty             >(tag: T,                children?: C, factory?: ElFactory<M, F, T, C, E<M[T]>>): El<T, E<M[T]>, El.Children.Array>;
  <T extends K<M>, C extends El.Children.Text  >(tag: T,                children?: C, factory?: ElFactory<M, F, T, C, E<M[T]>>): El<T, E<M[T]>, string>;
  <T extends K<M>, C extends El.Children.Array >(tag: T,                children?: C, factory?: ElFactory<M, F, T, C, E<M[T]>>): El<T, E<M[T]>, Readonly<C>>;
  <T extends K<M>, C extends El.Children.Struct>(tag: T,                children?: C, factory?: ElFactory<M, F, T, C, E<M[T]>>): El<T, E<M[T]>, C>;
  <T extends K<M>, C extends El.Children.Void  >(tag: T, attrs?: Attrs,               factory?: ElFactory<M, F, T, C, E<M[T]>>): El<T, E<M[T]>, El.Children.Void>;
  <T extends K<M>, C extends Empty             >(tag: T, attrs?: Attrs, children?: C, factory?: ElFactory<M, F, T, C, E<M[T]>>): El<T, E<M[T]>, El.Children.Array>;
  <T extends K<M>, C extends El.Children.Text  >(tag: T, attrs?: Attrs, children?: C, factory?: ElFactory<M, F, T, C, E<M[T]>>): El<T, E<M[T]>, string>;
  <T extends K<M>, C extends El.Children.Array >(tag: T, attrs?: Attrs, children?: C, factory?: ElFactory<M, F, T, C, E<M[T]>>): El<T, E<M[T]>, Readonly<C>>;
  <T extends K<M>, C extends El.Children.Struct>(tag: T, attrs?: Attrs, children?: C, factory?: ElFactory<M, F, T, C, E<M[T]>>): El<T, E<M[T]>, C>;
}

interface BuilderMethod<M extends TagNameMap, F extends Factory<M>, T extends K<M>, E extends Element> {
                  <C extends El.Children.Void  >(                                     factory?: ElFactory<M, F, T, C, E>      ): El<T, E,       El.Children.Void>;
                  <C extends Empty             >(                       children?: C, factory?: ElFactory<M, F, T, C, E>      ): El<T, E,       El.Children.Array>;
                  <C extends El.Children.Text  >(                       children?: C, factory?: ElFactory<M, F, T, C, E>      ): El<T, E,       string>;
                  <C extends El.Children.Array >(                       children?: C, factory?: ElFactory<M, F, T, C, E>      ): El<T, E,       Readonly<C>>;
                  <C extends El.Children.Struct>(                       children?: C, factory?: ElFactory<M, F, T, C, E>      ): El<T, E,       C>;
                  <C extends El.Children.Void  >(        attrs?: Attrs,               factory?: ElFactory<M, F, T, C, E>      ): El<T, E,       El.Children.Void>;
                  <C extends Empty             >(        attrs?: Attrs, children?: C, factory?: ElFactory<M, F, T, C, E>      ): El<T, E,       El.Children.Array>;
                  <C extends El.Children.Text  >(        attrs?: Attrs, children?: C, factory?: ElFactory<M, F, T, C, E>      ): El<T, E,       string>;
                  <C extends El.Children.Array >(        attrs?: Attrs, children?: C, factory?: ElFactory<M, F, T, C, E>      ): El<T, E,       Readonly<C>>;
                  <C extends El.Children.Struct>(        attrs?: Attrs, children?: C, factory?: ElFactory<M, F, T, C, E>      ): El<T, E,       C>;
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
        : target[prop] = builder(prop as keyof M & string, baseFactory),
  };

  function builder(tag: keyof M & string, baseFactory: F): (attrs?: Attrs, children?: El.Children, factory?: () => Element) => El {
    return function build(attrs?: Attrs | El.Children, children?: El.Children, factory?: ElFactory<M, F, keyof M & string, El.Children, Element>): El {
      if (typeof children === 'function') return build(attrs, void 0, children);
      if (typeof attrs === 'function') return build(void 0, void 0, attrs);
      if (isElChildren(attrs)) return build(void 0, attrs, factory);
      attrs ??= {} as typeof attrs;
      const node = formatter(elem(factory, attrs, children));
      return node.nodeType === 1
        ? new Elem(node as Element, attrs, children)
        : new Elem((node as ShadowRoot).host, attrs, children, node);
    };

    function isElChildren(param: Attrs | El.Children): param is El.Children {
      if (param === void 0) return false;
      if (param[Symbol.iterator]) return true;
      for (const i in param as Attrs) {
        if (!hasOwnProperty(param, i)) continue;
        return typeof param[i] === 'object' && !!param[i];
      }
      return true;
    }

    function elem(factory: ElFactory<M, F, keyof M & string, El.Children, Element> | undefined, attrs: Attrs, children: El.Children): Element {
      const el = factory
        ? define(factory(baseFactory as F, tag, attrs, children), attrs)
        : baseFactory(tag, attrs) as unknown as Element;
      if (tag !== el.tagName.toLowerCase()) throw new Error(`TypedDOM: Expected tag name is "${tag}" but actually "${el.tagName.toLowerCase()}".`);
      return el;
    }
  }
}
