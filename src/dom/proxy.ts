import { uid } from './identity';
import { define, shadow, text } from '../util/dom';

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
  export interface Collection extends ReadonlyArray<ElInterface> { }
  export type Record = { [field: string]: ElInterface; };
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
    private children_: Relax<C>,
    shadowing: boolean = false,
  ) {
    void throwErrorIfNotUsable(this);
    void memory.set(this.element, this);
    this.container = shadowing ? shadow(this.element) : this.element;
    switch (this.type) {
      case ElChildrenType.Void:
        this.initialChildren = new WeakSet();
        return;
      case ElChildrenType.Text:
        this.initialChildren = new WeakSet();
        void define(this.container, []);
        this.children_ = this.container.appendChild(text('')) as any;
        this.children = children_ as Relax<C>;
        return;
      case ElChildrenType.Collection:
        this.initialChildren = new WeakSet(children_ as ElChildren.Collection);
        void define(this.container, []);
        this.children_ = [] as ElChildren.Collection as Relax<C>;
        this.children = children_;
        return;
      case ElChildrenType.Record:
        this.initialChildren = new WeakSet(Object.values(children_ as ElChildren.Record));
        void define(this.container, []);
        this.children_ = observe(this.container, { ...children_ as ElChildren.Record }) as Relax<C>;
        this.children = children_;
        return;
      default:
        throw new Error(`TypedDOM: Undefined type children.`);
    }

    function observe<C extends ElChildren.Record>(node: Node, children: C): C {
      return Object.defineProperties(
        children,
        Object.entries(children)
          .reduce<PropertyDescriptorMap>((descs, [name, child]) => {
            void throwErrorIfNotUsable(child);
            void node.appendChild(child.element);
            descs[name] = {
              configurable: true,
              enumerable: true,
              get: (): ElInterface<string, Element, ElChildren> => {
                return child;
              },
              set: (newChild: ElInterface<string, Element, ElChildren>) => {
                const oldChild = child;
                if (newChild === oldChild) return;
                if (newChild.element.parentElement !== node) {
                  void throwErrorIfNotUsable(newChild);
                }
                void node.replaceChild(newChild.element, oldChild.element);
                child = newChild;
              }
            };
            return descs;
          }, {}));
    }
  }
  public readonly [tag]: T;
  private readonly container: Element | ShadowRoot;
  private id_: string = this.element.id.trim();
  private get id(): string {
    if (this.id_) return this.id_;
    this.id_ = uid();
    void this.element.classList.add(this.id_);
    return this.id_;
  }
  private get query(): string {
    assert(this.id.match(/^[a-z]/));
    switch (true) {
      case this.element !== this.container:
        return ':host';
      case this.id === this.element.id.trim():
        return `#${this.id}`;
      default:
        return `.${this.id}`;
    }
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
  private readonly initialChildren: WeakSet<ElInterface>;
  public get children(): Relax<C> {
    assert([ElChildrenType.Void, ElChildrenType.Collection].includes(this.type) ? Object.isFrozen(this.children_) : !Object.isFrozen(this.children_));
    switch (this.type) {
      case ElChildrenType.Text:
        this.children_ = (this.children_ as any as Text).parentNode === this.container
          ? this.children_
          : [...this.container.childNodes].find(node => node instanceof Text) as any || (this.children_ as any as Text).cloneNode();
        return (this.children_ as any as Text).textContent as Relax<C>;
      default:
        return this.children_ as Relax<C>;
    }
  }
  public set children(children: Relax<C>) {
    const removedChildren = new Set<ElInterface>();
    const addedChildren = new Set<ElInterface>();
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
        const targetChildren: ElInterface<string, Element, ElChildren>[] = [];
        this.children_ = targetChildren as any as Relax<C>;
        for (let i = 0; i < sourceChildren.length; ++i) {
          const newChild = sourceChildren[i];
          if (newChild.element.parentNode !== this.container as Element) {
            void throwErrorIfNotUsable(newChild);
          }
          if (newChild.element === this.container.children[i]) {
            void targetChildren.push(newChild);
          }
          else {
            if (newChild.element.parentNode !== this.container as Element) {
              void this.scope(newChild);
              void addedChildren.add(newChild);
            }
            void this.container.insertBefore(newChild.element, this.container.children[i]);
            void targetChildren.push(newChild);
          }
        }
        void Object.freeze(targetChildren);
        for (let i = this.container.children.length; i >= sourceChildren.length; --i) {
          if (!memory.has(this.container.children[i])) continue;
          void removedChildren.add(proxy(this.container.removeChild(this.container.children[i])));
        }
        assert(this.container.children.length === sourceChildren.length);
        assert(targetChildren.every((child, i) => child.element === this.container.children[i]));
        break;
      }
      case ElChildrenType.Record: {
        const sourceChildren = children as ElChildren.Record;
        const targetChildren = this.children_ as ElChildren.Record;
        assert.deepStrictEqual(Object.keys(sourceChildren), Object.keys(targetChildren));
        const log = new WeakSet<ElInterface>();
        for (const name in targetChildren) {
          const oldChild = targetChildren[name];
          const newChild = sourceChildren[name];
          if (!newChild) continue;
          if (newChild.element.parentNode !== this.container as Element) {
            void throwErrorIfNotUsable(newChild);
          }
          if (log.has(newChild)) throw new Error(`TypedDOM: Cannot use an element again used in the same record.`);
          void log.add(newChild);
          if (oldChild.element !== newChild.element || this.initialChildren.has(oldChild)) {
            void this.scope(newChild);
            void addedChildren.add(newChild);
            void removedChildren.add(oldChild);
          }
          targetChildren[name] = sourceChildren[name];
        }
        break;
      }
    }
    for (const child of removedChildren) {
      if (this.initialChildren.has(child)) continue;
      void child.element.dispatchEvent(new Event('disconnect', { bubbles: false, cancelable: true }));
    }
    for (const child of addedChildren) {
      void child.element.dispatchEvent(new Event('connect', { bubbles: false, cancelable: true }));
    }
    removedChildren.size + addedChildren.size > 0 &&
    void this.element.dispatchEvent(new Event('change', { bubbles: false, cancelable: true }));
  }
}

function throwErrorIfNotUsable({ element }: ElInterface<string, Element, ElChildren>): void {
  if (!element.parentElement || !memory.has(element.parentElement)) return;
  throw new Error(`TypedDOM: Cannot add an element used in another typed dom.`);
}
