import {default as Builder, TypedHTMLElement, TypedHTMLElementChildren} from 'typed-dom';

export function build<T extends HTMLElement, U extends TypedHTMLElementChildren<HTMLElement>>(factory: () => T, children: U = <any>[]): TypedHTMLElement<T, U> {
  const raw = factory();
  void Object.keys(children)
    .forEach(k => void raw.appendChild(children[k].raw));
  children = children instanceof Array
    ? Object.freeze(children)
    : observe(children);
  return Object.freeze({
    raw,
    get contents(): U {
      return children;
    },
    set contents(cs) {
      if (children instanceof Array) {
        cs = Object.freeze(cs);
        raw.innerHTML = '';
        void (<any[]><any>cs)
          .forEach(c => void raw.appendChild(c.raw));
      }
      else {
        void Object.keys(cs)
          .forEach(k => void raw.replaceChild(cs[k].raw, children[k].raw));
        cs = observe(cs);
      }
      children = cs;
    }
  });

  function observe(children: U): U {
    return Object.keys(children)
      .reduce((obj, k) => {
        Object.defineProperty(obj, k, {
          get() {
            return children[k];
          },
          set(newElt) {
            const oldElt = children[k];
            children[k] = newElt;
            raw.replaceChild(newElt.raw, oldElt.raw);
          }
        });
        return obj;
      }, <U>{});
  }
}
