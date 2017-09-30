type ElChildrenType =
  | ElChildrenType.Void
  | ElChildrenType.Text
  | ElChildrenType.Collection
  | ElChildrenType.Struct;
namespace ElChildrenType {
  export type Void = typeof Void;
  export const Void = 'void';
  export type Text = typeof Text;
  export const Text = 'text';
  export type Collection = typeof Collection;
  export const Collection = 'collection';
  export type Struct = typeof Struct;
  export const Struct = 'struct';
}

export type ElChildren =
  | ElChildren.Void
  | ElChildren.Text
  | ElChildren.Collection
  | ElChildren.Struct;
export namespace ElChildren {
  export type Void = undefined;
  export type Text = string;
  export type Collection = ReadonlyArray<El<string, HTMLElement, any>>;
  export type Struct = { [name: string]: El<string, HTMLElement, any>; };
}

export class El<
  T extends string,
  E extends HTMLElement,
  C extends ElChildren
  > {
  private tag: T;
  constructor(
    private readonly element_: E,
    private children_: C
  ) {
    this.tag;
    switch (this.type) {
      case ElChildrenType.Void:
        return;
      case ElChildrenType.Text:
        void clear();
        this.children_ = document.createTextNode('') as any;
        void this.element_.appendChild(this.children_ as any);
        this.children = children_;
        return;
      case ElChildrenType.Collection:
        void clear();
        this.children_ = [] as ElChildren.Collection as C;
        this.children = children_;
        void scope(this.element_.id, this.children_ as ElChildren.Collection);
        return;
      case ElChildrenType.Struct:
        void clear();
        this.children_ = observe(this.element_, { ...children_ as ElChildren.Struct }) as C;
        void this.structkeys
          .forEach(k =>
            void this.element_.appendChild(children_![k].element));
        void scope(this.element_.id, this.structkeys.map(k => (this.children_ as ElChildren.Struct)[k]));
        return;
    }

    function clear(): void {
      while (element_.childNodes.length > 0) {
        void element_.removeChild(element_.firstChild!);
      }
    }

    function scope(id: string, children: ReadonlyArray<El<string, HTMLElement, any>>): void {
      if (!id.match(/^[\w\-]+$/)) return;
      return void children
        .map(({ element }) => element)
        .forEach(element =>
          element instanceof HTMLStyleElement &&
          void parse(element, id));

      function parse(style: HTMLStyleElement, id: string): void {
        style.innerHTML = style.innerHTML.replace(/^\s*\$scope(?!\w)/gm, `#${id}`);
        void [...style.querySelectorAll('*')]
          .forEach(el =>
            void el.remove());
      }
    }

    function observe<C extends ElChildren.Struct>(element: HTMLElement, children: C): C {
      return Object.defineProperties(
        children,
        Object.keys(children)
          .reduce<PropertyDescriptorMap>((descs, key) => {
            let current = children[key];
            descs[key] = {
              configurable: true,
              enumerable: true,
              get: (): El<string, HTMLElement, any> => {
                return current;
              },
              set: (newChild: El<string, HTMLElement, any>) => {
                const oldChild = current;
                if (newChild === oldChild) return;
                current = newChild;
                void element.replaceChild(newChild.element, oldChild.element);
              }
            };
            return descs;
          }, {}));
    }
  }
  private readonly type: ElChildrenType =
    this.children_ === void 0
      ? ElChildrenType.Void
      : typeof this.children_ === 'string'
        ? ElChildrenType.Text
        : Array.isArray(this.children_)
          ? ElChildrenType.Collection
          : ElChildrenType.Struct;
  private readonly structkeys: string[] =
    this.type === 'struct'
      ? Object.keys(this.children_ as ElChildren.Struct)
      : [];
  public get element(): E {
    return this.element_;
  }
  public get children(): C {
    assert([ElChildrenType.Void, ElChildrenType.Collection].includes(this.type) ? Object.isFrozen(this.children_) : !Object.isFrozen(this.children_));
    switch (this.type) {
      case ElChildrenType.Text:
        return (this.children_ as any as Text).data as C;
      default:
        return this.children_;
    }
  }
  public set children(children: C) {
    switch (this.type) {
      case ElChildrenType.Void:
        return;

      case ElChildrenType.Text:
        if (children === (this.children_ as any as Text).data) return;
        (this.children_ as any as Text).data = children as string;
        assert(this.children_ !== children);
        return;

      case ElChildrenType.Collection:
        if (children === this.children_) return;
        void (children as ElChildren.Collection)
          .reduce((cs, c) => {
            const i = cs.indexOf(c);
            if (i === -1) return cs;
            void cs.splice(i, 1);
            return cs;
          }, [...this.children_ as ElChildren.Collection])
          .forEach(child =>
            void child.element.remove());
        this.children_ = [] as ElChildren.Collection as C;
        void (children as ElChildren.Collection)
          .forEach((child, i) => (
            this.children_![i] = child,
            void this.element_.appendChild(child.element)));
        assert(this.children_ !== children);
        void Object.freeze(this.children_);
        return;

      case ElChildrenType.Struct:
        if (children === this.children_) return;
        void this.structkeys
          .forEach(k =>
            this.children_![k] = children![k]);
        assert(this.children_ !== children);
        return;

    }
  }
}
