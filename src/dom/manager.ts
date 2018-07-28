import { uid } from './identity';

type ElChildrenType =
  | typeof ElChildrenType.Void
  | typeof ElChildrenType.Text
  | typeof ElChildrenType.Collection
  | typeof ElChildrenType.Record;
namespace ElChildrenType {
  export const Void = 'void';
  export const Text = 'text';
  export const Collection = 'collection';
  export const Record = 'record';
}

export type ElChildren =
  | ElChildren.Void
  | ElChildren.Text
  | ElChildren.Collection
  | ElChildren.Record;
export namespace ElChildren {
  export type Void = undefined;
  export type Text = string;
  export type Collection = El<string, Element, any>[];
  export type Record = { [field: string]: El<string, Element, any>; };
}
type LooseChildren<C extends ElChildren> = C extends ElChildren.Text ? ElChildren.Text : C;

const memory = new WeakSet<Element>();

export class El<
  T extends string,
  E extends Element,
  C extends ElChildren
  > {
  private readonly tag!: T;
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
        this.children_ = element_.appendChild(document.createTextNode('')) as any;
        this.children = children_ as LooseChildren<C>;
        return;
      case ElChildrenType.Collection:
        void clear();
        this.children_ = [] as ElChildren.Collection as C;
        this.children = children_ as LooseChildren<C>;
        return;
      case ElChildrenType.Record:
        void clear();
        this.children_ = observe(element_, { ...children_ as ElChildren.Record }) as C;
        this.children = children_ as LooseChildren<C>;
        return;
    }

    function clear(): void {
      element_.innerHTML = '';
      assert(element_.childNodes.length === 0);
    }

    function observe<C extends ElChildren.Record>(element: Element, children: C): C {
      return Object.defineProperties(
        children,
        Object.entries(children)
          .reduce<PropertyDescriptorMap>((descs, [name, child]) => {
            void throwErrorIfNotUsable(child);
            void element.appendChild(child.element);
            descs[name] = {
              configurable: true,
              enumerable: true,
              get: (): El<string, Element, any> => {
                return child;
              },
              set: (newChild: El<string, Element, any>) => {
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
  private id_!: string;
  private get id(): string {
    return this.id_ = this.id_ || this.element_.id.trim() || uid();
  }
  private get query(): string {
    assert(this.id.match(/^[a-z]/));
    return this.id === this.element_.id.trim()
      ? `#${this.id}`
      : `.${this.id}`;
  }
  private readonly type: ElChildrenType =
    this.children_ === undefined
      ? ElChildrenType.Void
      : typeof this.children_ === 'string'
        ? ElChildrenType.Text
        : Array.isArray(this.children_)
          ? ElChildrenType.Collection
          : ElChildrenType.Record;
  private scope(children: El<string, Element, ElChildren>[]): void {
    const syntax = /^(\s*)\$scope(?!\w)/gm;
    return void children
      .forEach(child =>
        child.element instanceof HTMLStyleElement &&
        void parse(child.element, this.query));

    function parse(style: HTMLStyleElement, query: string): void {
      if (style.innerHTML.search(syntax) === -1) return;
      style.innerHTML = style.innerHTML.replace(syntax, (_, indent) => `${indent}${query}`);
      const id = query.slice(1);
      switch (query[0]) {
        case '.':
          if (!(style.getAttribute('class') || '').split(' ').includes(id)) break;
          void style.setAttribute('class', `${style.getAttribute('class')} ${id}`.trim());
          break;
      }
      if (style.children.length === 0) return;
      void [...style.querySelectorAll('*')]
        .forEach(el =>
          void el.remove());
    }
  }
  public get element(): E {
    return this.element_;
  }
  public get children(): LooseChildren<C> {
    assert([ElChildrenType.Void, ElChildrenType.Collection].includes(this.type) ? Object.isFrozen(this.children_) : !Object.isFrozen(this.children_));
    switch (this.type) {
      case ElChildrenType.Text:
        return (this.children_ as any as Text).data as LooseChildren<C>;
      default:
        return this.children_ as LooseChildren<C>;
    }
  }
  public set children(children: LooseChildren<C>) {
    switch (this.type) {
      case ElChildrenType.Void:
        return;
      case ElChildrenType.Text:
        children = document.createTextNode(children as ElChildren.Text) as any;
        void this.element_.replaceChild(children as any, this.children_ as any);
        this.children_ = children as C;
        return;
      case ElChildrenType.Collection:
        this.children_ = [] as ElChildren.Collection as C;
        void (children as ElChildren.Collection)
          .forEach((child, i) => {
            child.element_.parentElement as Element === this.element_ || void throwErrorIfNotUsable(child);
            this.children_![i] = child;
            if (this.children_![i] === this.element_.childNodes[i]) return;
            void this.element_.insertBefore(child.element, this.element_.childNodes[i]);
          });
        while (this.element_.childNodes.length > (children as ElChildren.Collection).length) {
          void this.element_.removeChild(this.element_.lastChild!);
        }
        assert(this.element_.childNodes.length === (children as ElChildren.Collection).length);
        assert((this.children_ as ElChildren.Collection).every(({ element }, i) => element === this.element_.childNodes[i]));
        void Object.freeze(this.children_);
        void this.scope(Object.values(this.children_ as ElChildren.Collection));
        return;
      case ElChildrenType.Record:
        assert.deepStrictEqual(Object.keys(children as object), Object.keys(this.children_ as object));
        void Object.keys(this.children_ as ElChildren.Record)
          .forEach(k =>
            this.children_![k] = children![k]);
        assert(Object.entries(this.children_ as ElChildren.Record).every(([k, v]) => children![k] === v));
        void this.scope(Object.values(this.children_ as ElChildren.Record));
        return;
    }
  }
}

function throwErrorIfNotUsable({ element }: El<string, Element, any>): void {
  if (element.parentElement === null || !memory.has(element.parentElement)) return;
  throw new Error(`TypedDOM: Cannot add an element used in another typed dom.`);
}
