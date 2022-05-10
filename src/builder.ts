import { Symbol } from 'spica/global';
import { hasOwnProperty } from 'spica/alias';
import { El, ElementProxy } from './proxy';
import { Factory, TagNameMap, Attrs, shadow, html, svg, define } from './util/dom';

export type API
  <M extends TagNameMap, F extends Factory<M> = Factory<M>> =
  BuilderFunction<M, F> &
  { readonly [P in K<M>]: BuilderMethod<M, F, P>; };
export function API
  <M extends TagNameMap, F extends Factory<M> = Factory<M>>
  (baseFactory: F, container?: <E extends Element>(el: E) => ShadowRoot)
  : API<M, F> {
  return new Proxy<API<M, F>>((() => 0) as any, handle(baseFactory, container));
}

export const Shadow = API<ShadowHostHTMLElementTagNameMap>(html, shadow);
export const HTML = API<HTMLElementTagNameMap>(html);
export const SVG = API<SVGElementTagNameMap>(svg);

type K<M> = keyof M & string;
type E<V> = Extract<V, Element>;
type El_Children_Unit = readonly [];

interface BuilderFunction<M extends TagNameMap, F extends Factory<M>> {
  <T extends K<M>, C extends El.Children.Void  >(tag: T,                                                 factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, El.Children.Void>;
  <T extends K<M>, C extends El.Children.Void  >(tag: T,                                    children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, El.Children.Void>;
  <T extends K<M>, C extends El.Children.Text  >(tag: T,                                    children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, El.Children.Text>;
  <T extends K<M>, C extends El_Children_Unit  >(tag: T,                                    children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, El.Children.Array>;
  <T extends K<M>, C extends El.Children.Array >(tag: T,                                    children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, Readonly<C>>;
  <T extends K<M>, C extends El.Children.Struct>(tag: T,                                    children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, C>;
  <T extends K<M>, C extends El.Children.Void  >(tag: T, attrs: Attrs<E<M[T]>> | undefined,              factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, El.Children.Void>;
  <T extends K<M>, C extends El.Children.Void  >(tag: T, attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, El.Children.Void>;
  <T extends K<M>, C extends El.Children.Text  >(tag: T, attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, El.Children.Text>;
  <T extends K<M>, C extends El_Children_Unit  >(tag: T, attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, El.Children.Array>;
  <T extends K<M>, C extends El.Children.Array >(tag: T, attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, Readonly<C>>;
  <T extends K<M>, C extends El.Children.Struct>(tag: T, attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, C>;
}

interface BuilderMethod<M extends TagNameMap, F extends Factory<M>, T extends K<M>> {
                  <C extends El.Children.Void  >(                                                        factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, El.Children.Void>;
                  <C extends El.Children.Void  >(                                           children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, El.Children.Void>;
                  <C extends El.Children.Text  >(                                           children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, El.Children.Text>;
                  <C extends El_Children_Unit  >(                                           children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, El.Children.Array>;
                  <C extends El.Children.Array >(                                           children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, Readonly<C>>;
                  <C extends El.Children.Struct>(                                           children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, C>;
                  <C extends El.Children.Void  >(        attrs: Attrs<E<M[T]>> | undefined,              factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, El.Children.Void>;
                  <C extends El.Children.Void  >(        attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, El.Children.Void>;
                  <C extends El.Children.Text  >(        attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, El.Children.Text>;
                  <C extends El_Children_Unit  >(        attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, El.Children.Array>;
                  <C extends El.Children.Array >(        attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, Readonly<C>>;
                  <C extends El.Children.Struct>(        attrs: Attrs<E<M[T]>> | undefined, children: C, factory?: El.Factory<M, F, T, C>): El<T, E<M[T]>, C>;
}

function handle
  <M extends TagNameMap, F extends Factory<M>>
  (baseFactory: F, container?: <E extends Element>(el: E) => ShadowRoot,
): ProxyHandler<API<M, F>> {
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
    return function build(attrs?: Attrs | El.Children, children?: El.Children, factory?: El.Factory<M, F, keyof M & string, El.Children>): El {
      if (typeof children === 'function') return build(attrs, void 0, children);
      if (typeof attrs === 'function') return build(void 0, void 0, attrs);
      if (isElChildren(attrs)) return build(void 0, attrs, factory);
      // Bug: TypeScript
      //assert(attrs = attrs as Attrs | undefined);
      const el = elem(tag, factory, attrs, children);
      return new ElementProxy(tag, el, children, container?.(el));
    };
  }

  function elem(tag: keyof M & string, factory: El.Factory<M, F, keyof M & string, El.Children> | undefined, attrs: Attrs | undefined, children: El.Children): Element {
    const el = factory
      ? define(factory(baseFactory, tag, attrs ?? {}, children) as unknown as Element, attrs)
      : baseFactory(tag, attrs) as unknown as Element;
    if (tag.toLowerCase() !== el.tagName.toLowerCase()) throw new Error(`TypedDOM: Expected tag name is "${tag.toLowerCase()}" but actually "${el.tagName.toLowerCase()}".`);
    return el;
  }
}

function isElChildren(value: Attrs | El.Children): value is NonNullable<El.Children> {
  if (value?.[Symbol.iterator]) return true;
  if (!value) return false;
  for (const name in value as Attrs | El.Children.Struct) {
    if (!hasOwnProperty(value, name)) continue;
    const val = value[name];
    return !!val && typeof val === 'object';
  }
  return true;
}
