type ElChildrenType =
  | typeof ElChildrenType.Void
  | typeof ElChildrenType.Text
  | typeof ElChildrenType.Collection
  | typeof ElChildrenType.Struct;
namespace ElChildrenType {
  export const Void = 'void';
  export const Text = 'text';
  export const Collection = 'collection';
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

const memory = new WeakSet<Element>();

export class El<
  T extends string,
  E extends Element,
  C extends ElChildren
  > {
  private tag: T;
  constructor(
    private readonly element_: E,
    private children_: C
  ) {
    this.tag;
    void throwErrorIfNotUsable(this);
    void memory.add(element_);
    switch (this.type) {
      case ElChildrenType.Void:
        return;
      case ElChildrenType.Text:
        void clear();
        this.children_ = document.createTextNode('') as any;
        void this.element_.appendChild(this.children_ as any as Text);
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
        void scope(this.element_.id, this.children_ as ElChildren.Struct);
        return;
    }

    function clear(): void {
      while (element_.childNodes.length > 0) {
        void element_.removeChild(element_.firstChild!);
      }
    }

    function scope(id: string, children: ElChildren.Collection | ElChildren.Struct): void {
      if (!id.match(/^[\w\-]+$/)) return;
      return void Object.values(children)
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

    function observe<C extends ElChildren.Struct>(element: Element, children: C): C {
      return Object.defineProperties(
        children,
        Object.entries(children)
          .reduce<PropertyDescriptorMap>((descs, [name, child]) => {
            void throwErrorIfNotUsable(child);
            void element.appendChild(child.element);
            descs[name] = {
              configurable: true,
              enumerable: true,
              get: (): El<string, HTMLElement, any> => {
                return child;
              },
              set: (newChild: El<string, HTMLElement, any>) => {
                const oldChild = child;
                if (newChild === oldChild) return;
                newChild.element_.parentElement === element || void throwErrorIfNotUsable(newChild);
                child = newChild;
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
        (this.children_ as any as Text).data = children as string;
        return;

      case ElChildrenType.Collection:
        void (this.children_ as ElChildren.Collection)
          .reduce((cs, c) => {
            const i = cs.indexOf(c);
            if (i > -1) return cs;
            void cs.splice(i, 1);
            void c.element.remove();
            return cs;
          }, [...children as ElChildren.Collection]);
        this.children_ = [] as ElChildren.Collection as C;
        void (children as ElChildren.Collection)
          .forEach((child, i) => {
            child.element_.parentElement as Element === this.element_ || void throwErrorIfNotUsable(child);
            this.children_![i] = child;
            void this.element_.appendChild(child.element);
          });
        assert((this.children_ as ElChildren.Collection).every(({ element }, i) => element === this.element_.childNodes[i]));
        void Object.freeze(this.children_);
        return;

      case ElChildrenType.Struct:
        assert.deepStrictEqual(Object.keys(children as object), Object.keys(this.children_ as object));
        void Object.keys(this.children_ as ElChildren.Struct)
          .forEach(k =>
            this.children_![k] = children![k]);
        assert(Object.entries(this.children_ as ElChildren.Struct).every(([k, v]) => children![k] === v));
        return;

    }
  }
}

function throwErrorIfNotUsable({ element }: El<string, Element, any>): void {
  if (element.parentElement === null || !memory.has(element.parentElement)) return;
  throw new Error(`TypedDOM: Cannot add an element used in another typed dom.`);
}
