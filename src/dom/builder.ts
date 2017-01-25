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
    private readonly factory: () => E,
    children: C
  ) {
    this.mode = children === void 0
      ? 'empty'
      : typeof children === 'string'
        ? 'text'
        : Array.isArray(children)
          ? 'collection'
          : 'struct';
    if (children === void 0) return;
    switch (this.mode) {
      case 'text':
        this.interimChildren = <any>document.createTextNode(<string>children);
        this.concreteChildren = <any>document.createTextNode('');
        this.children = children;
        break;
      case 'collection':
        this.notifiers = {
          all: () => {
            assert(this.buffering);
            if (this.changes.has(this)) return;
            void this.changes.add(this);
            void this.notify();
          },
          children: {}
        };
        void Object.freeze(children);
        this.interimChildren = children;
        this.concreteChildren = <C><TypedHTMLElementChildren.Collection>[];
        this.children = this.interimChildren;
        break;
      case 'struct':
        this.structkeys = Object.keys(children);
        this.notifiers = {
          all: () => {
            assert(this.buffering);
            if (this.changes.has(this)) return;
            void this.changes.add(this);
            void this.notify();
          },
          children: this.structkeys.reduce((o, k) => {
            o[k] = () => {
              assert(this.buffering);
              if (this.changes.has(k)) return;
              void this.changes.add(k);
              void this.notify();
            };
            return o;
          }, {})
        };
        this.interimChildren = children;
        this.concreteChildren = <C><TypedHTMLElementChildren.Struct>Object.create(null);
        this.children = this.interimChildren;
        break;
    }
  }
  public notify = noop;
  private notifiers: {
    all: () => void;
    children: { [name: string]: () => void; };
  };
  public parent?: TypedHTMLElement<string, HTMLElement, any>;
  private __element: E;
  private get element_(): E {
    return this.__element = this.__element || this.factory();
  }
  public get element(): E {
    void this.render();
    return this.element_;
  }
  private interimChildren: C;
  private concreteChildren: C;
  public get children(): C {
    switch (this.mode) {
      case 'text':
        return <C>(<Text><any>this.interimChildren).data;
      default:
        return this.interimChildren;
    }
  }
  public set children(children: C) {
    this.interimChildren = this.mode === 'text'
      ? <C><any>document.createTextNode(<string>children)
      : children;
    if (this.buffering) {
      if (this.interimChildren && this.interimChildren !== this.concreteChildren) {
        void this.changes.add(this);
        void this.notify();
      }
      return;
    }
    // sync
    switch (this.mode) {
      case 'text':
        if (this.interimChildren === this.concreteChildren) break;
        void this.changes.delete(this);
        (<Text><any>this.concreteChildren).parentElement === this.element_
          ? void this.element_.replaceChild(<Text><any>this.interimChildren, <Text><any>this.concreteChildren)
          : void this.element_.appendChild(<Text><any>this.interimChildren);
        this.concreteChildren = this.interimChildren;
        break;

      case 'collection':
        if (this.interimChildren === this.concreteChildren) {
          void this.changes.delete(this);
          void (<TypedHTMLElementChildren.Collection>this.interimChildren)
            .forEach(child =>
              void child.render());
          break;
        }
        void Object.freeze(this.interimChildren);
        void this.changes.delete(this);
        void (<TypedHTMLElementChildren.Collection>this.interimChildren)
          .reduce<TypedHTMLElementChildren.Collection>((ccs, ic) => {
            const i = ccs.indexOf(ic);
            if (i === -1) return ccs;
            void ccs.splice(i, 1);
            return ccs;
          }, (<TypedHTMLElementChildren.Collection>this.concreteChildren).slice())
          .forEach(child => (
            void child.element.remove(),
            (<TypedHTMLElement<string, HTMLElement, any>>child).notify = noop));
        void (<TypedHTMLElementChildren.Collection>this.interimChildren)
          .forEach(child => (
            void this.element_.appendChild(child.element),
            void child.render(),
            (<TypedHTMLElement<string, HTMLElement, any>>child).parent = this,
            (<TypedHTMLElement<string, HTMLElement, any>>child).notify = this.notifiers.all));
        this.concreteChildren = this.interimChildren;
        break;

      case 'struct':
        if (this.interimChildren === this.concreteChildren) {
          const all = this.changes.delete(this);
          void this.structkeys
            .forEach(k =>
              (this.changes.has(k) || all)
              && void this.interimChildren[k].render());
          break;
        }
        void this.changes.delete(this);
        void this.structkeys
          .forEach(k => (
            void this.changes.delete(k),
            void this.interimChildren[k].render(),
            this.concreteChildren[k] && this.concreteChildren[k].element.parentElement === this.element_
              ? (
                void this.element_.replaceChild(this.interimChildren[k].element, this.concreteChildren[k].element),
                (<TypedHTMLElement<string, HTMLElement, any>>this.concreteChildren[k]).parent = this,
                (<TypedHTMLElement<string, HTMLElement, any>>this.concreteChildren[k]).notify = this.notifiers.children[k])
              : (
                this.concreteChildren[k] = this.interimChildren[k],
                void this.element_.appendChild(this.interimChildren[k].element),
                (<TypedHTMLElement<string, HTMLElement, any>>this.concreteChildren[k]).parent = this,
                (<TypedHTMLElement<string, HTMLElement, any>>this.concreteChildren[k]).notify = this.notifiers.children[k])));
        void this.observe(<TypedHTMLElementChildren.Struct>this.interimChildren);
        this.concreteChildren = this.interimChildren;
        break;

    }
  }
  private observe(children: TypedHTMLElementChildren.Struct): void {
    void Object.defineProperties(children, this.structkeys
      .reduce<PropertyDescriptorMap>((descs, key) => {
        let concreteChild = children[key];
        let interimChild = children[key];
        descs[key] = {
          configurable: true,
          enumerable: true,
          get: (): ITypedHTMLElement<string, HTMLElement, any> => {
            if (this.buffering) return interimChild;
            if (interimChild === concreteChild) return concreteChild;
            void this.changes.delete(key);
            void this.element_.replaceChild(interimChild.element, concreteChild.element);
            concreteChild = interimChild;
            return concreteChild;
          },
          set: (newChild: TypedHTMLElement<string, HTMLElement, any>) => {
            newChild.notify = this.notifiers.children[key];
            interimChild = newChild;
            if (interimChild === concreteChild) return;
            if (this.buffering) {
              if (this.changes.has(key)) return;
              void this.changes.add(key);
              void this.notify();
              return;
            }
            void this.element_.replaceChild(interimChild.element, concreteChild.element);
            concreteChild = interimChild;
          }
        };
        return descs;
      }, {}));
  }
  private readonly mode: 'empty' | 'text' | 'collection' | 'struct';
  private readonly structkeys: string[];
  private buffering = false;
  public buffer(): this {
    this.buffering = true;
    return this;
  }
  public unbuffer(): this {
    this.buffering = false;
    return this;
  }
  private changes = new Set<this | string>();
  public render(): void {
    if (this.changes.size === 0) return;
    const buffering = this.buffering;
    void this.unbuffer();
    if (this.changes.has(this)) {
      this.children = this.children;
    }
    else {
      switch (this.mode) {
        case 'struct':
          void this.structkeys
            .forEach(k =>
              this.changes.delete(k) &&
              void this.children[k].render());
          break;
      }
    }
    assert(this.changes.size === 0);
    this.buffering = buffering;
  }
}

function noop() {
}
