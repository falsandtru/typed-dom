import { TypedHTML, TypedHTMLContents } from 'typed-dom';

export function build
  <S extends string, T extends HTMLElement, U extends TypedHTMLContents<HTMLElement>>
  (factory: () => T, attrs: {}, contents: U)
  : TypedHTML<S, T, U> {
  const raw = factory();
  if (contents === void 0) return <TypedHTML<S, T, U>>Object.freeze({
    raw,
    contents: <U>contents
  });
  const mode = typeof contents === 'string'
    ? 'text'
    : Array.isArray(contents)
      ? 'array'
      : 'object';
  switch (mode) {
    case 'text':
      contents = <any>document.createTextNode(<string>contents)
      void raw.appendChild(<Text><any>contents);
      break;
    default:
      void Object.keys(attrs)
        .forEach(name => raw.setAttribute(name, attrs[name] || ''));
      void Object.keys(contents)
        .forEach(k => void raw.appendChild(contents[k].raw));
      switch (mode) {
        case 'array':
          void Object.freeze(contents);
          break;
        case 'object':
          void observe(contents);
          break;
      }
  }
  return <TypedHTML<S, T, U>>Object.freeze({
    raw,
    get contents(): U {
      switch (mode) {
        case 'text':
          return <U>(<Text><any>contents).data;
        default:
          return contents;
      }
    },
    set contents(cs) {
      switch (mode) {
        case 'text':
          (<Text><any>contents).data = <string>cs;
          cs = contents;
          break;

        case 'array':
          cs = <U>Object.freeze(cs);
          void (<TypedHTML<string, T, any>[]><any>cs)
            .reduce<TypedHTML<string, T, any>[]>((os, n) => {
              const i = os.indexOf(n);
              if (i === -1) return os;
              void os.splice(i, 1);
              return os;
            }, (<TypedHTML<string, T, any>[]><any>contents).slice())
            .map(a => (<TypedHTML<string, T, any>>a).raw)
            .forEach(a =>
              void a.remove());
          void (<TypedHTML<string, T, any>[]><any>cs)
            .map(a => (<TypedHTML<string, T, any>>a).raw)
            .forEach(c => void raw.appendChild(c));
          break;

        case 'object':
          void Object.keys(cs)
            .forEach(k => void raw.replaceChild(cs[k].raw, contents[k].raw));
          cs = observe(cs);
          break;

      }
      contents = cs;
    }
  });

  function observe(contents: U): U {
    const cache = {};
    return Object.keys(contents)
      .reduce((contents, k) => {
        cache[k] = contents[k];
        Object.defineProperty(contents, k, {
          get() {
            return cache[k];
          },
          set(newElt) {
            const oldElt = cache[k];
            cache[k] = newElt;
            raw.replaceChild(newElt.raw, oldElt.raw);
          }
        });
        return contents;
      }, contents);
  }
}
