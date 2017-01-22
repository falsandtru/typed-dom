import { TypedHTML, TypedHTMLContents } from 'typed-dom';

export function build
  <S extends string, T extends HTMLElement, U extends TypedHTMLContents<HTMLElement>>
  (factory: () => T, attrs: {}, contents: U = <U>[])
  : TypedHTML<S, T, U> {
  const raw = factory();
  void Object.keys(attrs)
    .forEach(name => raw.setAttribute(name, attrs[name] || ''));
  void Object.keys(contents)
    .forEach(k => void raw.appendChild(contents[k].raw || document.createTextNode(contents[k])));
  contents = Array.isArray(contents)
    // https://github.com/Microsoft/TypeScript/issues/8563
    ? <U>Object.freeze(contents)
    : observe(contents);
  return <TypedHTML<S, T, U>>Object.freeze({
    raw,
    get contents(): U {
      return contents;
    },
    set contents(cs) {
      if (Array.isArray(contents)) {
        cs = Object.freeze(cs);
        void (<Array<TypedHTML<string, T, any> | string>>cs)
          .reduce<Array<TypedHTML<string, T, any> | string>>((os, n) => {
            const i = os.indexOf(n);
            if (i === -1) return os;
            void os.splice(i, 1);
            return os;
          }, contents.slice())
          .map(a => (<TypedHTML<string, T, any>>a).raw || document.createTextNode(<string>a))
          .forEach(a =>
            void a.remove());
        void (<Array<TypedHTML<string, T, any> | string>>cs)
          .map(a => (<TypedHTML<string, T, any>>a).raw || document.createTextNode(<string>a))
          .forEach(c => void raw.appendChild(c));
      }
      else {
        void Object.keys(cs)
          .forEach(k => void raw.replaceChild(cs[k].raw, contents[k].raw));
        cs = observe(cs);
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
