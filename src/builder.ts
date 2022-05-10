import { Symbol, Proxy } from 'spica/global';
import { hasOwnProperty } from 'spica/alias';
import { El, ElementProxy } from './proxy';
import { Factory, TagNameMap, Attrs, shadow, html, svg, define } from './util/dom';

export type API
  <M extends TagNameMap> =
  BuilderFunction<M> & { readonly [P in K<M>]: BuilderMethod<M, P>; };
export function API
  <M extends TagNameMap>
  (baseFactory: Factory<M>, container?: <E extends Element>(el: E) => ShadowRoot)
  : API<M> {
  return new Proxy<API<M>>((() => 0) as any, handle(baseFactory, container));
}

export const Shadow = API<ShadowHostHTMLElementTagNameMap>(html, shadow);
export const HTML = API<HTMLElementTagNameMap>(html);
export const SVG = API<SVGElementTagNameMap>(svg);

type K<M> = keyof M & string;
type E<V> = Extract<V, Element>;
type El_Children_Unit = readonly [];
export type ElFactory<
  M extends TagNameMap,
  T extends keyof M & string = keyof M & string,
  C extends El.Children = El.Children,
  > =
  // Bug: TypeScript: Type U must not affect Type C
  //<U extends T>(baseFactory: Factory<M>, tag: U, attrs: Attrs, children: C) => M[U];
  (baseFactory: Factory<M>, tag: T, attrs: Attrs<E<M[T]>>, children: C) => M[T];

interface BuilderFunction<M extends TagNameMap> {
  <T extends K<M>, C extends El.Children.Void  >(tag: T, attrs: Attrs<E<M[T]>> | undefined,              factory?: ElFactory<M, T, C>): El<T, E<M[T]>, El.Children.Void>;
  <T extends K<M>, C extends El.Children.Void  >(tag: T, attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, El.Children.Void>;
  <T extends K<M>, C extends El.Children.Text  >(tag: T, attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, El.Children.Text>;
  <T extends K<M>, C extends El_Children_Unit  >(tag: T, attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, El.Children.Array>;
  <T extends K<M>, C extends El.Children.Array >(tag: T, attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, Readonly<C>>;
  <T extends K<M>, C extends El.Children.Struct>(tag: T, attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, C>;
  <T extends K<M>, C extends El.Children.Void  >(tag: T,                                    children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, El.Children.Void>;
  <T extends K<M>, C extends El.Children.Text  >(tag: T,                                    children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, El.Children.Text>;
  <T extends K<M>, C extends El_Children_Unit  >(tag: T,                                    children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, El.Children.Array>;
  <T extends K<M>, C extends El.Children.Array >(tag: T,                                    children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, Readonly<C>>;
  <T extends K<M>, C extends El.Children.Struct>(tag: T,                                    children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, C>;
  <T extends K<M>, C extends El.Children.Void  >(tag: T,                                                 factory?: ElFactory<M, T, C>): El<T, E<M[T]>, El.Children.Void>;
}

interface BuilderMethod<M extends TagNameMap, T extends K<M>> {
                  <C extends El.Children.Void  >(        attrs: Attrs<E<M[T]>> | undefined,              factory?: ElFactory<M, T, C>): El<T, E<M[T]>, El.Children.Void>;
                  <C extends El.Children.Void  >(        attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, El.Children.Void>;
                  <C extends El.Children.Text  >(        attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, El.Children.Text>;
                  <C extends El_Children_Unit  >(        attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, El.Children.Array>;
                  <C extends El.Children.Array >(        attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, Readonly<C>>;
                  <C extends El.Children.Struct>(        attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, C>;
                  <C extends El.Children.Void  >(                                           children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, El.Children.Void>;
                  <C extends El.Children.Text  >(                                           children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, El.Children.Text>;
                  <C extends El_Children_Unit  >(                                           children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, El.Children.Array>;
                  <C extends El.Children.Array >(                                           children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, Readonly<C>>;
                  <C extends El.Children.Struct>(                                           children: C, factory?: ElFactory<M, T, C>): El<T, E<M[T]>, C>;
                  <C extends El.Children.Void  >(                                                        factory?: ElFactory<M, T, C>): El<T, E<M[T]>, El.Children.Void>;
}

function handle
  <M extends TagNameMap>
  (baseFactory: Factory<M>, container?: <E extends Element>(el: E) => ShadowRoot,
): ProxyHandler<API<M>> {
  return {
    apply(target, _, [tag, ...args]) {
      return this.get!(target, tag, target)(...args);
    },
    get: (target, prop) =>
      target[prop] || prop in target || typeof prop !== 'string'
        ? target[prop]
        : target[prop] = builder(prop as keyof M & string),
  };

  function builder(tag: keyof M & string) {
    return function build(attrs?: Attrs | El.Children, children?: El.Children, factory?: ElFactory<M, keyof M & string, El.Children>): El {
      if (typeof children === 'function') return build(attrs, void 0, children);
      if (typeof attrs === 'function') return build(void 0, void 0, attrs);
      if (isElChildren(attrs)) return build(void 0, attrs, factory);
      // Bug: TypeScript
      //assert(attrs = attrs as Attrs | undefined);
      const el = elem(tag, factory, attrs, children);
      return new ElementProxy(tag, el, children, container?.(el));
    };
  }

  function elem(tag: keyof M & string, factory: ElFactory<M, keyof M & string, El.Children> | undefined, attrs: Attrs | undefined, children: El.Children): Element {
    const el = factory
      ? define(factory(baseFactory, tag, attrs ?? {}, children) as unknown as Element, attrs)
      : baseFactory(tag, attrs) as unknown as Element;
    if (tag.toLowerCase() !== el.tagName.toLowerCase()) throw new Error(`TypedDOM: Expected tag name is "${tag.toLowerCase()}" but actually "${el.tagName.toLowerCase()}".`);
    return el;
  }
}

function isElChildren(value: Attrs | El.Children): value is NonNullable<El.Children> {
  if (value === void 0) return false;
  if (value[Symbol.iterator]) return true;
  for (const name in value as Attrs | El.Children.Struct) {
    if (!hasOwnProperty(value, name)) continue;
    const val = value[name];
    return !!val && typeof val === 'object';
  }
  return false;
}
