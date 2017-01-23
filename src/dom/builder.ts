import { TypedHTMLElement, TypedHTMLElementChildren } from 'typed-dom';

export function build
  <S extends string, T extends HTMLElement, U extends TypedHTMLElementChildren<HTMLElement>>
  (factory: () => T, attrs: {}, children: U)
  : TypedHTMLElement<S, T, U> {
  const element = factory();
  if (children === void 0) return <TypedHTMLElement<S, T, U>>Object.freeze({
    element,
    children: <U>children
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
  return <TypedHTMLElement<S, T, U>>Object.freeze({
    element,
    get children(): U {
      switch (mode) {
        case 'text':
          return <U>(<Text><any>children).data;
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
          cs = <U>Object.freeze(cs);
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
            .forEach(k =>
              void element.replaceChild(cs[k].element, children[k].element));
          cs = <U>observe(<{ [name: string]: TypedHTMLElement<string, HTMLElement, any>; }>cs);
          break;

      }
      children = cs;
    }
  });

  function observe<T extends { [name: string]: TypedHTMLElement<string, HTMLElement, any>; }>(children: T): T {
    const cache: T = <T>{};
    return Object.keys(children)
      .reduce((children, k) => {
        cache[k] = children[k];
        Object.defineProperty(children, k, {
          get() {
            return cache[k];
          },
          set(newElt) {
            const oldElt = cache[k];
            cache[k] = newElt;
            element.replaceChild(newElt.element, oldElt.element);
          }
        });
        return children;
      }, children);
  }
}
