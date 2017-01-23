import { TypedHTMLElement as ITHTML, TypedHTMLElementChildren } from 'typed-dom';

export interface TypedHTMLElement<
  T extends string,
  E extends HTMLElement,
  C extends TypedHTMLElementChildren,
  > extends ITHTML<T, E, C> {
}
export class TypedHTMLElement<
  T extends string,
  E extends HTMLElement,
  C extends TypedHTMLElementChildren,
  >
  implements ITHTML<T, E, C> {
  constructor(
    public readonly element: E,
    children: C
  ) {
    if (children === void 0) {
      void Object.freeze(this);
      return;
    }
    const mode = typeof children === 'string'
      ? 'text'
      : Array.isArray(children)
        ? 'collection'
        : 'struct';
    switch (mode) {
      case 'text':
        children = <any>document.createTextNode(<string>children)
        void element.appendChild(<Text><any>children);
        break;
      default:
        void Object.keys(children)
          .forEach(k =>
            void element.appendChild(children[k].element));
        switch (mode) {
          case 'collection':
            void Object.freeze(children);
            break;
          case 'struct':
            void observe(element, <{ [name: string]: TypedHTMLElement<string, HTMLElement, any>; }>children);
            break;
        }
    }
    Object.defineProperties(this, {
      children: {
        get(): C {
          switch (mode) {
            case 'text':
              return <C>(<Text><any>children).data;
            default:
              return children;
          }
        },
        set(cs) {
          switch (mode) {
            case 'text':
              (<Text><any>children).data = <string>cs;
              cs = children;
              break;

            case 'collection':
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

            case 'struct':
              void Object.keys(children)
                .filter(k =>
                  cs[k].element !== children[k].element)
                .forEach(k =>
                  void element.replaceChild(cs[k].element, children[k].element));
              cs = <C>observe(element, <{ [name: string]: TypedHTMLElement<string, HTMLElement, any>; }>cs);
              break;

          }
          children = cs;
        }
      }
    });
    void Object.freeze(this);
  }
  public children: C;
}

function observe<E extends HTMLElement, C extends { [name: string]: TypedHTMLElement<string, HTMLElement, any>; }>(element: E, children: C): C {
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
