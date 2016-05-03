import {default as Builder, TypedHTML, TypedHTMLContents} from 'typed-dom';

export function build<T extends HTMLElement, U extends TypedHTMLContents<HTMLElement>>(factory: () => T, contents: U = <any>[]): TypedHTML<T, U> {
  const raw = factory();
  void Object.keys(contents)
    .forEach(k => void raw.appendChild(contents[k].raw));
  contents = contents instanceof Array
    ? Object.freeze(contents)
    : observe(contents);
  return Object.freeze({
    raw,
    get contents(): U {
      return contents;
    },
    set contents(cs) {
      if (contents instanceof Array) {
        cs = Object.freeze(cs);
        raw.innerHTML = '';
        void (<any[]><any>cs)
          .forEach(c => void raw.appendChild(c.raw));
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
