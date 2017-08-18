export type TypedHTMLElementChildren =
  | TypedHTMLElementChildren.Void
  | TypedHTMLElementChildren.Text
  | TypedHTMLElementChildren.Collection
  | TypedHTMLElementChildren.Struct;
export namespace TypedHTMLElementChildren {
  export type Void = void;
  export type Text = string;
  export type Collection = ReadonlyArray<TypedHTMLElement<string, HTMLElement, any>>;
  export type Struct = { [name: string]: TypedHTMLElement<string, HTMLElement, any>; };
}

export class TypedHTMLElement<
  T extends string,
  E extends HTMLElement,
  C extends TypedHTMLElementChildren
  > {
  private tag: T;
  constructor(
    private readonly element_: E,
    private children_: C
  ) {
    this.tag;
    switch (this.mode) {
      case 'void':
        return;
      case 'text':
        void clear();
        this.children_ = document.createTextNode('') as any;
        void this.element_.appendChild(this.children_ as any);
        this.children = children_;
        return;
      case 'collection':
        void clear();
        if (element_.id) {
          void (children_ as TypedHTMLElementChildren.Collection)
            .forEach(({ element }) =>
              element instanceof HTMLStyleElement &&
              void scope(element));
        }
        this.children_ = Object.freeze([]) as TypedHTMLElementChildren.Collection as C;
        this.children = children_;
        return;
      case 'struct':
        void clear();
        if (element_.id) {
          void Object.keys(children_ as TypedHTMLElementChildren.Struct)
            .map(k => (children_ as TypedHTMLElementChildren.Struct)[k])
            .forEach(({ element }) =>
              element instanceof HTMLStyleElement &&
              void scope(element));
        }
        this.children_ = this.observe({ ...<TypedHTMLElementChildren.Struct>children_ }) as C;
        void this.structkeys
          .forEach(k =>
            void this.element_.appendChild(children_[k].element));
        return;
    }

    function clear(): void {
      while (element_.childNodes.length > 0) {
        void element_.removeChild(element_.firstChild!);
      }
    }
    function scope(style: HTMLStyleElement): void {
      if (!element_.id.match(/^[\w\-]+$/)) return;
      style.innerHTML = style.innerHTML.replace(/^\s*\$scope(?!\w)/gm, `#${element_.id}`);
      void Array.from(style.querySelectorAll('*'))
        .forEach(el =>
          void el.remove());
    }
  }
  private readonly mode: 'void' | 'text' | 'collection' | 'struct' =
    this.children_ === void 0
      ? 'void'
      : typeof this.children_ === 'string'
        ? 'text'
        : Array.isArray(this.children_)
          ? 'collection'
          : 'struct';
  private readonly structkeys: string[] =
    this.mode === 'struct'
      ? Object.keys(this.children_ as TypedHTMLElementChildren.Struct)
      : [];
  public get element(): E {
    return this.element_;
  }
  public get children(): C {
    switch (this.mode) {
      case 'text':
        return (this.children_ as any as Text).data as C;
      default:
        return this.children_;
    }
  }
  public set children(children: C) {
    switch (this.mode) {
      case 'void':
        return;

      case 'text':
        if (children === (this.children_ as any as Text).data) return;
        (<Text><any>this.children_).data = <string>children;
        return;

      case 'collection':
        if (children === this.children_) return;
        if (!Object.isFrozen(this.children_)) throw new Error('TypedHTMLElement collections cannot be updated recursively.');
        void (children as TypedHTMLElementChildren.Collection)
          .reduce((cs, c) => {
            const i = cs.indexOf(c);
            if (i === -1) return cs;
            void cs.splice(i, 1);
            return cs;
          }, (this.children_ as TypedHTMLElementChildren.Collection).slice())
          .forEach(child =>
            void child.element.remove());
        this.children_ = [] as TypedHTMLElementChildren.Collection as C;
        void (children as TypedHTMLElementChildren.Collection)
          .forEach((child, i) => (
            this.children_[i] = child,
            void this.element_.appendChild(child.element)));
        void Object.freeze(this.children_);
        return;

      case 'struct':
        if (children === this.children_) return;
        void this.structkeys
          .forEach(k =>
            this.children_[k] = children[k]);
        return;

    }
  }
  private observe<C extends TypedHTMLElementChildren.Struct>(children: C): C {
    return Object.defineProperties(
      children,
      this.structkeys
        .reduce<PropertyDescriptorMap>((descs, key) => {
          let current = children[key];
          descs[key] = {
            configurable: true,
            enumerable: true,
            get: (): TypedHTMLElement<string, HTMLElement, any> => {
              return current;
            },
            set: (newChild: TypedHTMLElement<string, HTMLElement, any>) => {
              const oldChild = current;
              if (newChild === oldChild) return;
              current = newChild;
              void this.element_.replaceChild(newChild.element, oldChild.element);
            }
          };
          return descs;
        }, {}));
  }
}
