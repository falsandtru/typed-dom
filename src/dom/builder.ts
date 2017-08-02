export type TypedHTMLElementChildren =
  | TypedHTMLElementChildren.Void
  | TypedHTMLElementChildren.Text
  | TypedHTMLElementChildren.Collection
  | TypedHTMLElementChildren.Struct;
export namespace TypedHTMLElementChildren {
  export type Void = void;
  export type Text = string;
  export type Collection = TypedHTMLElement<string, HTMLElement, any>[];
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
        this.children_ = <any>document.createTextNode('');
        void this.element_.appendChild(<Text><any>this.children_);
        this.children = children_;
        return;
      case 'collection':
        void clear();
        if (element_.id) {
          void (<TypedHTMLElementChildren.Collection>children_)
            .forEach(({ element }) =>
              element instanceof HTMLStyleElement &&
              void scope(element));
        }
        this.children_ = <C><TypedHTMLElementChildren.Collection><never[]>Object.freeze([]);
        this.children = children_;
        return;
      case 'struct':
        void clear();
        if (element_.id) {
          void Object.keys(children_)
            .map(k => (<TypedHTMLElementChildren.Struct>children_)[k])
            .forEach(({ element }) =>
              element instanceof HTMLStyleElement &&
              void scope(element));
        }
        this.children_ = <C>this.observe({ ...<TypedHTMLElementChildren.Struct>children_ });
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
      ? Object.keys(this.children_)
      : [];
  public get element(): E {
    return this.element_;
  }
  public get children(): C {
    switch (this.mode) {
      case 'text':
        return <C>(<Text><any>this.children_).data;
      default:
        return this.children_;
    }
  }
  public set children(children: C) {
    switch (this.mode) {
      case 'void':
        return;

      case 'text':
        if (children === (<Text><any>this.children_).data) return;
        (<Text><any>this.children_).data = <string>children;
        return;

      case 'collection':
        if (children === this.children_) return;
        if (!Object.isFrozen(this.children_)) throw new Error('TypedHTMLElement collections cannot be updated recursively.');
        void (<TypedHTMLElementChildren.Collection>children)
          .reduce<TypedHTMLElementChildren.Collection>((ccs, ic) => {
            const i = ccs.indexOf(ic);
            if (i === -1) return ccs;
            void ccs.splice(i, 1);
            return ccs;
          }, (<TypedHTMLElementChildren.Collection>this.children_).slice())
          .forEach(child =>
            void child.element.remove());
        this.children_ = <C><TypedHTMLElementChildren.Collection>[];
        void (<TypedHTMLElementChildren.Collection>children)
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
