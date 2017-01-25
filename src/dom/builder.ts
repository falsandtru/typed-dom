import { TypedHTMLElement as ITypedHTMLElement } from 'typed-dom';

export type TypedHTMLElementChildren
  = TypedHTMLElementChildren.Text
  | TypedHTMLElementChildren.Collection
  | TypedHTMLElementChildren.Struct;
export namespace TypedHTMLElementChildren {
  export type Text = string;
  export type Collection = TypedHTMLElement<string, HTMLElement, any>[];
  export type Struct = { [name: string]: TypedHTMLElement<string, HTMLElement, any>; };
}
export interface TypedHTMLElement<
  T extends string,
  E extends HTMLElement,
  C extends TypedHTMLElementChildren,
  > extends ITypedHTMLElement<T, E, C> {
}
export class TypedHTMLElement<
  T extends string,
  E extends HTMLElement,
  C extends TypedHTMLElementChildren,
  >
  implements ITypedHTMLElement<T, E, C> {
  constructor(
    private readonly element_: E,
    private children_: C
  ) {
    if (children_ === void 0) return;
    switch (this.mode) {
      case 'text':
        this.children_ = <any>document.createTextNode('');
        void this.element_.appendChild(<Text><any>this.children_);
        this.children = children_;
        break;
      case 'collection':
        void Object.freeze(children_);
        this.children_ = <C><TypedHTMLElementChildren.Collection>[];
        this.children = children_;
        break;
      case 'struct':
        this.children_ = <C><TypedHTMLElementChildren.Struct>Object.create(null);
        this.children = children_;
        break;
    }
  }
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
      case 'text':
        if (children === (<Text><any>this.children_).data) break;
        (<Text><any>this.children_).data = <string>children;
        break;

      case 'collection':
        if (children === this.children_) break;
        void Object.freeze(children);
        void (<TypedHTMLElementChildren.Collection>children)
          .reduce<TypedHTMLElementChildren.Collection>((ccs, ic) => {
            const i = ccs.indexOf(ic);
            if (i === -1) return ccs;
            void ccs.splice(i, 1);
            return ccs;
          }, (<TypedHTMLElementChildren.Collection>this.children_).slice())
          .forEach(child =>
            void child.element.remove());
        void (<TypedHTMLElementChildren.Collection>children)
          .forEach(child =>
            void this.element_.appendChild(child.element));
        this.children_ = children;
        break;

      case 'struct':
        if (children === this.children_) break;
        void this.structkeys
          .forEach(k =>
            this.children_[k] && this.children_[k].element.parentElement === this.element_
              ? void this.element_.replaceChild(children[k].element, this.children_[k].element)
              : void this.element_.appendChild(children[k].element));
        void this.observe(<TypedHTMLElementChildren.Struct>children);
        this.children_ = children;
        break;

    }
  }
  private observe(children: TypedHTMLElementChildren.Struct): void {
    void Object.defineProperties(children, this.structkeys
      .reduce<PropertyDescriptorMap>((descs, key) => {
        let oldChild = children[key];
        descs[key] = {
          configurable: true,
          enumerable: true,
          get: (): ITypedHTMLElement<string, HTMLElement, any> => {
            return oldChild;
          },
          set: (newChild: TypedHTMLElement<string, HTMLElement, any>) => {
            if (newChild === oldChild) return;
            void this.element_.replaceChild(newChild.element, oldChild.element);
            oldChild = newChild;
          }
        };
        return descs;
      }, {}));
  }
  private readonly mode: 'empty' | 'text' | 'collection' | 'struct' = this.children_ === void 0
    ? 'empty'
    : typeof this.children_ === 'string'
      ? 'text'
      : Array.isArray(this.children_)
        ? 'collection'
        : 'struct';
  private readonly structkeys: string[] = this.mode === 'struct'
    ? Object.keys(this.children_)
    : [];
}
