import { TypedHTMLElement, TypedHTMLElementChildren } from 'typed-dom';

export function build
  <T extends string, E extends HTMLElement, C extends TypedHTMLElementChildren<HTMLElement>>
  (factory: () => E, attrs: {}, children: C)
  : TypedHTMLElement<T, E, C> {
  const element = factory();
  if (children === void 0) return <TypedHTMLElement<T, E, C>>Object.freeze({
    element,
    children: <C>children
  });
  const mode = typeof children === 'string'
    ? 'text'
    : Array.isArray(children)
      ? 'array'
      : 'object';
  switch (mode) {
    case 'text':
      children = <any>document.createTextNode(<string>children)
      void element.appendChild(<Text><any>children);
      break;
    default:
      void Object.keys(attrs)
        .forEach(name =>
          void element.setAttribute(name, attrs[name] || ''));
      void Object.keys(children)
        .forEach(k =>
          void element.appendChild(children[k].element));
      switch (mode) {
        case 'array':
          void Object.freeze(children);
          break;
        case 'object':
          void observe(<{ [name: string]: TypedHTMLElement<string, HTMLElement, any>; }>children);
          break;
      }
  }
  return <TypedHTMLElement<T, E, C>>Object.freeze({
    element,
    get children(): C {
      switch (mode) {
        case 'text':
          return <C>(<Text><any>children).data;
        default:
          return children;
      }
    },
    set children(cs) {
      switch (mode) {
        case 'text':
          (<Text><any>children).data = <string>cs;
          cs = children;
          break;

        case 'array':
          cs = <C>Object.freeze(cs);
          void (<TypedHTMLElement<string, HTMLElement, any>[]>cs)
            .reduce<TypedHTMLElement<string, HTMLElement, any>[]>((os, n) => {
              const i = os.indexOf(n);
              if (i === -1) return os;
              void os.splice(i, 1);
              return os;
            }, (<TypedHTMLElement<string, HTMLElement, any>[]>children).slice())
            .forEach(({element: child}) =>
              void child.remove());
          void (<TypedHTMLElement<string, HTMLElement, any>[]>cs)
            .forEach(({element: child}) =>
              void element.appendChild(child));
          break;

        case 'object':
          void Object.keys(children)
            .filter(k =>
              cs[k].element !== children[k].element)
            .forEach(k =>
              void element.replaceChild(cs[k].element, children[k].element));
          cs = <C>observe(<{ [name: string]: TypedHTMLElement<string, HTMLElement, any>; }>cs);
          break;

      }
      children = cs;
    }
  });

  function observe<C extends { [name: string]: TypedHTMLElement<string, HTMLElement, any>; }>(children: C): C {
    const cache: C = <C>{};
    return Object.keys(children)
      .reduce((children, k) => {
        cache[k] = children[k];
        Object.defineProperty(children, k, {
          get() {
            return cache[k];
          },
          set(newElt: C[keyof C]) {
            const oldElt = cache[k];
            cache[k] = newElt;
            if (newElt.element === oldElt.element) return;
            void element.replaceChild(newElt.element, oldElt.element);
          }
        });
        return children;
      }, children);
  }
}
