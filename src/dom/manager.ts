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

const internal = Symbol();

export class El<
  T extends string,
  E extends Element,
  C extends ElChildren
  > {
  constructor(
    element: E,
    children: C
  ) {
    this[internal] = new Internal('' as T, element, children);
    void throwErrorIfNotUsable(this);
    void memory.set(element, this);
    switch (this[internal].type) {
      case ElChildrenType.Void:
        return;
      case ElChildrenType.Text:
        void define(element, []);
        this[internal].children = element.appendChild(text('')) as any;
        this.children = children as LooseChildren<C>;
        return;
      case ElChildrenType.Collection:
        void define(element, []);
        this[internal].children = [] as ElChildren.Collection as C;
        this.children = children as LooseChildren<C>;
        return;
      case ElChildrenType.Record:
        void define(element, []);
        this[internal].children = observe(element, { ...children as ElChildren.Record }) as C;
        void Object.values(children as ElChildren.Record).forEach(child => void this[internal].initialChildren.add(child.element));
        this.children = children as LooseChildren<C>;
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
                if (newChild.element.parentElement !== element) {
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
  private [internal]: Internal<T, E, C>;
  public get element(): E {
    return this[internal].element;
  }
  public get children(): LooseChildren<C> {
    assert([ElChildrenType.Void, ElChildrenType.Collection].includes(this[internal].type) ? Object.isFrozen(this[internal].children) : !Object.isFrozen(this[internal].children));
    switch (this[internal].type) {
      case ElChildrenType.Text:
        this[internal].children = (this[internal].children as any as Text).parentNode === this.element
          ? this[internal].children
          : [...this.element.childNodes].find(node => node instanceof Text) as any || (this[internal].children as any as Text).cloneNode();
        return (this[internal].children as any as Text).textContent as LooseChildren<C>;
      default:
        return this[internal].children as LooseChildren<C>;
    }
  }
  public set children(children: LooseChildren<C>) {
    const removedNodes = new Set<Node>();
    const addedNodes = new Set<Node>();
    switch (this[internal].type) {
      case ElChildrenType.Void:
        return;
      case ElChildrenType.Text: {
        if (children === this.children && !this[internal].initialChildren.has(this[internal].children as any)) return;
        const targetChildren = this[internal].children as any as Text;
        const oldText = targetChildren.textContent!;
        const newText = children as ElChildren.Text;
        targetChildren.textContent = newText;
        if (newText === oldText) return;
        void this.element.dispatchEvent(new Event('change', { bubbles: false, cancelable: true }));
        return;
      }
      case ElChildrenType.Collection: {
        const sourceChildren = children as ElChildren.Collection;
        const targetChildren = [] as ElChildren.Collection;
        this[internal].children = targetChildren as C;
        void (sourceChildren)
          .forEach((child, i) => {
            if (child.element.parentElement !== this.element as Element) {
              void throwErrorIfNotUsable(child);
            }
            targetChildren[i] = child;
            if (targetChildren[i].element === this.element.childNodes[i]) return;
            if (child.element.parentNode !== this.element) {
              void this[internal].scope(child);
              void addedNodes.add(child.element);
            }
            void this.element.insertBefore(child.element, this.element.childNodes[i]);
          });
        while (this.element.childNodes.length > sourceChildren.length) {
          void removedNodes.add(this.element.removeChild(this.element.childNodes[sourceChildren.length]));
        }
        assert(this.element.childNodes.length === sourceChildren.length);
        assert(targetChildren.every((child, i) => child.element === this.element.childNodes[i]));
        void Object.freeze(targetChildren);
        break;
      }
      case ElChildrenType.Record: {
        const sourceChildren = children as ElChildren.Record;
        const targetChildren = this[internal].children as ElChildren.Record;
        assert.deepStrictEqual(Object.keys(sourceChildren), Object.keys(targetChildren));
        const mem = new WeakSet<Node>();
        void Object.keys(targetChildren)
          .forEach(k => {
            const oldChild = targetChildren[k];
            const newChild = sourceChildren[k];
            if (!newChild) return;
            if (newChild.element.parentElement !== this.element as Element) {
              void throwErrorIfNotUsable(newChild);
            }
            if (mem.has(newChild.element)) throw new Error(`TypedDOM: Cannot use an element again used in the same record.`);
            void mem.add(newChild.element);
            if (oldChild.element !== newChild.element || this[internal].initialChildren.has(oldChild.element)) {
              void this[internal].scope(newChild);
              void addedNodes.add(newChild.element);
              void removedNodes.add(oldChild.element);
            }
            targetChildren[k] = sourceChildren[k];
          });
        break;
      }
    }
    void removedNodes.forEach(node =>
      !this[internal].initialChildren.has(node) &&
      void node.dispatchEvent(new Event('disconnect', { bubbles: false, cancelable: true })));
    void addedNodes.forEach(node =>
      void node.dispatchEvent(new Event('connect', { bubbles: false, cancelable: true })));
    removedNodes.size + addedNodes.size > 0 &&
    void this.element.dispatchEvent(new Event('change', { bubbles: false, cancelable: true }));
  }
}

class Internal<T extends string, E extends Element, C extends ElChildren> {
  constructor(
    private readonly tag: T,
    public readonly element: E,
    public children: C
  ) {
    this.tag;
  }
  private id_!: string;
  private get id(): string {
    if (this.id_) return this.id_;
    if (this.id_ = this.element.id.trim()) return this.id_;
    void this.element.classList.add(this.id_ = uid());
    return this.id;
  }
  private get query(): string {
    assert(this.id.match(/^[a-z]/));
    return this.id === this.element.id.trim()
      ? `#${this.id}`
      : `.${this.id}`;
  }
  public readonly type: ElChildrenType =
    this.children === undefined
      ? ElChildrenType.Void
      : typeof this.children === 'string'
        ? ElChildrenType.Text
        : Array.isArray(this.children)
          ? ElChildrenType.Collection
          : ElChildrenType.Record;
  public readonly initialChildren: WeakSet<Node> = new WeakSet();
  public scope(child: El<string, Element, ElChildren>): void {
    if (!(child.element instanceof HTMLStyleElement)) return;
    return void parse(child.element, this.query);

    function parse(style: HTMLStyleElement, query: string): void {
      const syntax = /^(\s*)\$scope(?!\w)/gm;
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
}

function throwErrorIfNotUsable({ element }: El<string, Element, any>): void {
  if (element.parentElement === null || !memory.has(element.parentElement)) return;
  throw new Error(`TypedDOM: Cannot add an element used in another typed dom.`);
}
