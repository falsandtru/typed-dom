import { uid } from './identity';
import { define, text } from '../util/dom';
import { Mutable } from 'spica/type';

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
  export type Collection = readonly ElInterface<string, Element, any>[];
  export type Record = { [field: string]: ElInterface<string, Element, any>; };
}

type Relax<C extends ElChildren> = C extends ElChildren.Text ? ElChildren.Text : C;

const memory = new WeakMap<Element, ElInterface<string, Element, ElChildren>>();

export function proxy<E extends Element>(el: E): ElInterface<string, E, ElChildren>;
export function proxy<C extends ElChildren>(el: Element): ElInterface<string, Element, C>;
export function proxy<E extends Element, C extends ElChildren>(el: E): ElInterface<string, E, C>;
export function proxy(el: Element): ElInterface<string, Element, ElChildren> {
  if (!memory.has(el)) throw new Error(`TypedDOM: This element has no proxy.`);
  return memory.get(el)!;
}

const tag = Symbol();

export interface ElInterface<
  T extends string = string,
  E extends Element = Element,
  C extends ElChildren = ElChildren
  > {
  readonly [tag]?: T;
  readonly element: E;
  children: Relax<C>;
}

export class El<
  T extends string,
  E extends Element,
  C extends ElChildren
  > {
  constructor(
    public readonly element: E,
    private children_: C,
  ) {
    void throwErrorIfNotUsable(this);
    void memory.set(element, this);
    switch (this.type) {
      case ElChildrenType.Void:
        return;
      case ElChildrenType.Text:
        void define(element, []);
        this.children_ = element.appendChild(text('')) as any;
        this.children = children_;
        return;
      case ElChildrenType.Collection:
        void define(element, []);
        this.children_ = [] as ElChildren.Collection as C;
        this.children = children_;
        return;
      case ElChildrenType.Record:
        void define(element, []);
        this.children_ = observe(element, { ...children_ as ElChildren.Record }) as C;
        void Object.values(children_ as ElChildren.Record).forEach(child => void this.initialChildren.add(child.element));
        this.children = children_;
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
              get: (): ElInterface<string, Element, any> => {
                return child;
              },
              set: (newChild: ElInterface<string, Element, any>) => {
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
  public readonly [tag]: T;
  private id_: string = this.element.id.trim();
  private get id(): string {
    if (this.id_) return this.id_;
    this.id_ = uid();
    void this.element.classList.add(this.id_);
    return this.id_;
  }
  private get query(): string {
    assert(this.id.match(/^[a-z]/));
    return this.id === this.element.id.trim()
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
  private scope(child: ElInterface<string, Element, ElChildren>): void {
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
  private readonly initialChildren: WeakSet<Node> = new WeakSet();
  public get children(): C {
    assert([ElChildrenType.Void, ElChildrenType.Collection].includes(this.type) ? Object.isFrozen(this.children_) : !Object.isFrozen(this.children_));
    switch (this.type) {
      case ElChildrenType.Text:
        this.children_ = (this.children_ as any as Text).parentElement === this.element as Element
          ? this.children_
          : [...this.element.childNodes].find(node => node instanceof Text) as any || (this.children_ as any as Text).cloneNode();
        return (this.children_ as any as Text).textContent as C;
      default:
        return this.children_;
    }
  }
  public set children(children: C) {
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
        void this.element.dispatchEvent(new Event('change', { bubbles: false, cancelable: true }));
        return;
      }
      case ElChildrenType.Collection: {
        const sourceChildren = children as ElChildren.Collection;
        const targetChildren = [] as Mutable<ElChildren.Collection>;
        this.children_ = targetChildren as any as C;
        void (sourceChildren)
          .forEach((child, i) => {
            if (child.element.parentElement !== this.element as Element) {
              void throwErrorIfNotUsable(child);
            }
            targetChildren[i] = child;
            if (targetChildren[i].element === this.element.childNodes[i]) return;
            if (child.element.parentElement !== this.element as Element) {
              void this.scope(child);
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
        const targetChildren = this.children_ as ElChildren.Record;
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
            if (oldChild.element !== newChild.element || this.initialChildren.has(oldChild.element)) {
              void this.scope(newChild);
              void addedNodes.add(newChild.element);
              void removedNodes.add(oldChild.element);
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
    removedNodes.size + addedNodes.size > 0 &&
    void this.element.dispatchEvent(new Event('change', { bubbles: false, cancelable: true }));
  }
}

function throwErrorIfNotUsable({ element }: ElInterface<string, Element, any>): void {
  if (!element.parentElement || !memory.has(element.parentElement)) return;
  throw new Error(`TypedDOM: Cannot add an element used in another typed dom.`);
}
