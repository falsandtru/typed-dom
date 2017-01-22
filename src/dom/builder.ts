import { TypedHTML, TypedHTMLChildren } from 'typed-dom';

export function build
  <S extends string, T extends HTMLElement, U extends TypedHTMLChildren<HTMLElement>>
  (factory: () => T, attrs: {}, children: U)
  : TypedHTML<S, T, U> {
  const element = factory();
  if (children === void 0) return <TypedHTML<S, T, U>>Object.freeze({
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
        .forEach(name => element.setAttribute(name, attrs[name] || ''));
      void Object.keys(children)
        .forEach(k => void element.appendChild(children[k].element));
      switch (mode) {
        case 'array':
          void Object.freeze(children);
          break;
        case 'object':
          void observe(children);
          break;
      }
  }
  return <TypedHTML<S, T, U>>Object.freeze({
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
          void (<TypedHTML<string, T, any>[]><any>cs)
            .reduce<TypedHTML<string, T, any>[]>((os, n) => {
              const i = os.indexOf(n);
              if (i === -1) return os;
              void os.splice(i, 1);
              return os;
            }, (<TypedHTML<string, T, any>[]><any>children).slice())
            .map(a => (<TypedHTML<string, T, any>>a).element)
            .forEach(a =>
              void a.remove());
          void (<TypedHTML<string, T, any>[]><any>cs)
            .map(a => (<TypedHTML<string, T, any>>a).element)
            .forEach(c => void element.appendChild(c));
          break;

        case 'object':
          void Object.keys(cs)
            .forEach(k => void element.replaceChild(cs[k].element, children[k].element));
          cs = observe(cs);
          break;

      }
      children = cs;
    }
  });

  function observe(children: U): U {
    const cache = {};
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
