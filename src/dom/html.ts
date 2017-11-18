import { El, ElChildren } from './builder';

interface ElBuilder<T extends string, E extends Element> {
  (factory?: () => E): El<T, E, ElChildren.Void>;                                   <C extends ElChildren>
  (children: C, factory?: () => E): El<T, E, C>;
  (attrs: Record<string, string>, factory?: () => E): El<T, E, ElChildren.Void>;    <C extends ElChildren>
  (attrs: Record<string, string>, children: C, factory?: () => E): El<T, E, C>;
}

type TypedHTML = {
  readonly [K in keyof ElementTagNameMap]: ElBuilder<K, ElementTagNameMap[K]>;
};
export const TypedHTML: TypedHTML = new Proxy({} as TypedHTML, {
  get: (obj, tag) =>
    obj[tag]
      ? obj[tag]
      : obj[tag] = builder(`${tag}`),
});

function builder<C extends ElChildren>(tag: string): (attrs?: Record<string, string>, children?: C, factory?: () => Element) => El<string, Element, C> {
  return function build(attrs?: Record<string, string>, children?: C, factory?: () => Element): El<string, Element, C> {
    if (typeof attrs === 'function') return build(undefined, undefined, attrs);
    if (typeof children === 'function') return build(attrs, undefined, children);
    if (attrs !== undefined && isChildren(attrs)) return build(undefined, attrs, factory);
    return new El(define(tag, factory || (() => document.createElement(tag)), attrs), children!);
  };

  function isChildren(children: any): children is C {
    return typeof children !== 'object'
        || Object.values(children).slice(-1).every(val => typeof val === 'object');
  }

  function define<E extends Element>(tag: string, factory: () => E, attrs?: Record<string, string>): E {
    const el = factory();
    if (tag !== el.tagName.toLowerCase()) throw new Error(`TypedDOM: Tag name must be "${tag}" but "${el.tagName.toLowerCase()}".`);
    if (!attrs) return el;
    void Object.keys(attrs)
      .forEach(name =>
        void el.setAttribute(name, attrs[name]));
    return el;
  }
}
