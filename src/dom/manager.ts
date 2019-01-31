import { uid } from './identity';
import { define, text } from '../util/dom';

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

const memory = new WeakMap<Element, El<string, Element, ElChildren>>();

export function proxy<E extends Element>(el: E): El<string, E, ElChildren>;
export function proxy<C extends ElChildren>(el: Element): El<string, Element, C>;
export function proxy<E extends Element, C extends ElChildren>(el: E): El<string, E, C>;
export function proxy(el: Element): El<string, Element, ElChildren> {
  return memory.get(el)!;
}

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
    void memory.set(element_, this);
    switch (this.type) {
      case ElChildrenType.Void:
        return;
      case ElChildrenType.Text:
        void define(element_, []);
        this.children_ = element_.appendChild(text('')) as any;
        this.children = children_ as LooseChildren<C>;
        return;
      case ElChildrenType.Collection:
        void define(element_, []);
        this.children_ = [] as ElChildren.Collection as C;
        this.children = children_ as LooseChildren<C>;
        return;
      case ElChildrenType.Record:
        void define(element_, []);
        this.children_ = observe(element_, { ...children_ as ElChildren.Record }) as C;
        void Object.values(children_ as ElChildren.Record).forEach(child => void this.initialChildren.add(child.element_));
        this.children = children_ as LooseChildren<C>;
        return;
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
                if (newChild.element_.parentElement !== element) {
                  void throwErrorIfNotUsable(newChild);
                }
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
  private scope(child: El<string, Element, ElChildren>): void {
    const syntax = /^(\s*)\$scope(?!\w)/gm;
    if (!(child.element instanceof HTMLStyleElement)) return;
    return void parse(child.element, this.query);

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
  private readonly initialChildren: WeakSet<Node> = new WeakSet();
  public get element(): E {
    return this.element_;
  }
  public get children(): LooseChildren<C> {
    assert([ElChildrenType.Void, ElChildrenType.Collection].includes(this.type) ? Object.isFrozen(this.children_) : !Object.isFrozen(this.children_));
    switch (this.type) {
      case ElChildrenType.Text:
        this.children_ = (this.children_ as any as Text).parentNode === this.element_
          ? this.children_
          : [...this.element_.childNodes].find(node => node instanceof Text) as any || (this.children_ as any as Text).cloneNode();
        return (this.children_ as any as Text).textContent as LooseChildren<C>;
      default:
        return this.children_ as LooseChildren<C>;
    }
  }
  public set children(children: LooseChildren<C>) {
    const removedNodes = new Set<Node>();
    const addedNodes = new Set<Node>();
    switch (this.type) {
      case ElChildrenType.Void:
        return;
      case ElChildrenType.Text: {
        if (children === this.children && !this.initialChildren.has(this.children_ as any)) return;
        const targetChildren = this.children_ as any as Text;
        const oldText = targetChildren.textContent!;
        const newText = children as ElChildren.Text;
        targetChildren.textContent = newText;
        if (newText === oldText) return;
        break;
      }
      case ElChildrenType.Collection: {
        const sourceChildren = children as ElChildren.Collection;
        const targetChildren = [] as ElChildren.Collection;
        this.children_ = targetChildren as C;
        void (sourceChildren)
          .forEach((child, i) => {
            if (child.element_.parentElement !== this.element_ as Element) {
              void throwErrorIfNotUsable(child);
            }
            targetChildren[i] = child;
            if (targetChildren[i].element_ === this.element_.childNodes[i]) return;
            if (child.element_.parentNode !== this.element_) {
              void this.scope(child);
              void addedNodes.add(child.element_);
            }
            void this.element_.insertBefore(child.element, this.element_.childNodes[i]);
          });
        while (this.element_.childNodes.length > sourceChildren.length) {
          void removedNodes.add(this.element_.removeChild(this.element_.childNodes[sourceChildren.length]));
        }
        assert(this.element_.childNodes.length === sourceChildren.length);
        assert(targetChildren.every(({ element }, i) => element === this.element_.childNodes[i]));
        void Object.freeze(targetChildren);
        break;
      }
      case ElChildrenType.Record: {
        const sourceChildren = children as ElChildren.Record;
        const targetChildren = this.children_ as ElChildren.Record;
        assert.deepStrictEqual(Object.keys(sourceChildren), Object.keys(targetChildren));
        const mem = new WeakSet<Node>();
        void Object.keys(targetChildren)
          .forEach(k => {
            const oldChild = targetChildren[k];
            const newChild = sourceChildren[k];
            if (!newChild) return;
            if (newChild.element_.parentElement !== this.element_ as Element) {
              void throwErrorIfNotUsable(newChild);
            }
            if (mem.has(newChild.element_)) throw new Error(`TypedDOM: Cannot use an element again used in the same record.`);
            void mem.add(newChild.element_);
            if (oldChild.element_ !== newChild.element_ || this.initialChildren.has(oldChild.element_)) {
              void this.scope(newChild);
              void addedNodes.add(newChild.element_);
              void removedNodes.add(oldChild.element_);
            }
            targetChildren[k] = sourceChildren[k];
          });
        break;
      }
    }
    void removedNodes.forEach(node =>
      !this.initialChildren.has(node) &&
      void node.dispatchEvent(new Event('disconnect', { bubbles: false, cancelable: true })));
    void addedNodes.forEach(node =>
      void node.dispatchEvent(new Event('connect', { bubbles: false, cancelable: true })));
    void this.element_.dispatchEvent(new Event('change', { bubbles: false, cancelable: true }));
  }
}

function throwErrorIfNotUsable({ element }: El<string, Element, any>): void {
  if (element.parentElement === null || !memory.has(element.parentElement)) return;
  throw new Error(`TypedDOM: Cannot add an element used in another typed dom.`);
}
