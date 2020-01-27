import { uid } from './identity';
import { text, define } from '../util/dom';
import { Mutable } from 'spica/type';

const { Array, Object: Obj, WeakMap, WeakSet, Event } = global;

type ElChildrenType =
  | typeof ElChildrenType.Void
  | typeof ElChildrenType.Text
  | typeof ElChildrenType.Array
  | typeof ElChildrenType.Record;
namespace ElChildrenType {
  export const Void = 'void';
  export const Text = 'text';
  export const Array = 'array';
  export const Record = 'record';
}

export type ElChildren =
  | ElChildren.Void
  | ElChildren.Text
  | ElChildren.Array
  | ElChildren.Record;
export namespace ElChildren {
  export type Void = undefined;
  export type Text = string;
  export type Array = readonly El[];
  export type Record = { [field: string]: El; };
}

const proxies = new WeakMap<Element, El<string, Element, ElChildren>>();

export function proxy<E extends Element>(el: E): El<string, E, ElChildren>;
export function proxy<C extends ElChildren>(el: Element): El<string, Element, C>;
export function proxy<E extends Element, C extends ElChildren>(el: E): El<string, E, C>;
export function proxy(el: Element): El<string, Element, ElChildren> {
  if (!proxies.has(el)) throw new Error(`TypedDOM: This element has no proxy.`);
  return proxies.get(el)!;
}

const tag = Symbol.for('typed-dom/tag');

export interface El<
  T extends string = string,
  E extends Element = Element,
  C extends ElChildren = ElChildren,
  > {
  readonly [tag]?: T;
  readonly element: E;
  children: C;
}

export class Elem<
  T extends string,
  E extends Element,
  C extends ElChildren,
  > {
  constructor(
    public readonly element: E,
    private children_: C,
    private readonly container: Element | ShadowRoot = element,
  ) {
    switch (true) {
      case children_ === void 0:
        this.type = ElChildrenType.Void;
        break;
      case typeof children_ === 'string':
        this.type = ElChildrenType.Text
        break;
      case Array.isArray(children_):
        this.type = ElChildrenType.Array;
        break;
      case children_ && typeof children_ === 'object':
        this.type = ElChildrenType.Record;
        break;
      default:
        throw new Error(`TypedDOM: Invalid type children.`);
    }
    void throwErrorIfNotUsable(this);
    void proxies.set(this.element, this);
    switch (this.type) {
      case ElChildrenType.Void:
        this.initialChildren = new WeakSet();
        return;
      case ElChildrenType.Text:
        this.initialChildren = new WeakSet();
        void define(this.container, []);
        this.children_ = this.container.appendChild(text('')) as any;
        this.children = children_ as C;
        return;
      case ElChildrenType.Array:
        this.initialChildren = new WeakSet(children_ as ElChildren.Array);
        void define(this.container, []);
        this.children_ = [] as ElChildren.Array as C;
        this.children = children_;
        return;
      case ElChildrenType.Record:
        this.initialChildren = new WeakSet(Obj.values(children_ as ElChildren.Record));
        void define(this.container, []);
        this.children_ = observe(this.container, { ...children_ as ElChildren.Record }) as C;
        this.children = children_;
        return;
      default:
        throw new Error(`TypedDOM: Unreachable code.`);
    }
  }
  public readonly [tag]: T;
  private readonly type: ElChildrenType;
  private id_: string = this.element.id.trim();
  private get id(): string {
    if (this.id_) return this.id_;
    this.id_ = uid();
    void this.element.classList.add(this.id_);
    return this.id_;
  }
  private get query(): string {
    switch (true) {
      case this.element !== this.container:
        return ':host';
      case this.id === this.element.id.trim():
        return `#${this.id}`;
      default:
        return `.${this.id}`;
    }
  }
  private scope(child: El<string, Element, ElChildren>): void {
    if (child.element.nodeName !== 'STYLE') return;
    const syntax = /(^|[,}])(\s*)\$scope(?![\w-])(?=[^;{}]*{)/g;
    const style = child.element;
    const query = this.query;
    if (style.innerHTML.search(syntax) === -1) return;
    style.innerHTML = style.innerHTML.replace(syntax, (_, frag, space) => `${frag}${space}${query}`);
    switch (query[0]) {
      case '.': {
        const id = query.slice(1);
        if (!style.classList.contains(id)) break;
        void style.classList.add(id);
        break;
      }
    }
    if (style.children.length === 0) return;
    for (const el of style.querySelectorAll('*')) {
      void el.remove();
    }
  }
  private readonly initialChildren: WeakSet<El>;
  public get children(): C {
    assert([ElChildrenType.Void, ElChildrenType.Array].includes(this.type) ? Obj.isFrozen(this.children_) : !Obj.isFrozen(this.children_));
    switch (this.type) {
      case ElChildrenType.Text:
        this.children_ = (this.children_ as unknown as Text).parentNode === this.container
          ? this.children_
          : [...this.container.childNodes].find(node => node.nodeType === 3) as any || (this.children_ as unknown as Text).cloneNode();
        return (this.children_ as unknown as Text).textContent as C;
      default:
        return this.children_ as C;
    }
  }
  public set children(children: C) {
    const removedChildren: El[] = [];
    const addedChildren: El[] = [];
    switch (this.type) {
      case ElChildrenType.Void:
        return;
      case ElChildrenType.Text: {
        if (children === this.children && !this.initialChildren.has(this.children_ as any)) return;
        const targetChildren = this.children_ as unknown as Text;
        const oldText = targetChildren.textContent!;
        const newText = children as ElChildren.Text;
        targetChildren.textContent = newText;
        if (newText === oldText) return;
        void this.element.dispatchEvent(new Event('change', { bubbles: false, cancelable: true }));
        return;
      }
      case ElChildrenType.Array: {
        const sourceChildren = children as ElChildren.Array;
        const targetChildren = [] as Mutable<ElChildren.Array>;
        this.children_ = targetChildren as unknown as C;
        const log = new WeakSet<El>();
        for (let i = 0; i < sourceChildren.length; ++i) {
          const newChild = sourceChildren[i];
          if (log.has(newChild)) throw new Error(`TypedDOM: Typed DOM children can't repeatedly be used to the same object.`);
          void log.add(newChild);
          if (newChild.element.parentNode !== this.container as Element) {
            void throwErrorIfNotUsable(newChild);
          }
          if (newChild.element === this.container.children[i]) {
            void targetChildren.push(newChild);
          }
          else {
            if (newChild.element.parentNode !== this.container as Element) {
              void this.scope(newChild);
              void addedChildren.push(newChild);
            }
            void this.container.insertBefore(newChild.element, this.container.children[i]);
            void targetChildren.push(newChild);
          }
        }
        void Obj.freeze(targetChildren);
        for (let i = this.container.children.length; i >= sourceChildren.length; --i) {
          if (!proxies.has(this.container.children[i])) continue;
          void removedChildren.push(proxy(this.container.removeChild(this.container.children[i])));
        }
        assert(this.container.children.length === sourceChildren.length);
        assert(targetChildren.every((child, i) => child.element === this.container.children[i]));
        break;
      }
      case ElChildrenType.Record: {
        const sourceChildren = children as ElChildren.Record;
        const targetChildren = this.children_ as ElChildren.Record;
        assert.deepStrictEqual(Obj.keys(sourceChildren), Obj.keys(targetChildren));
        const log = new WeakSet<El>();
        for (const name in targetChildren) {
          if (!sourceChildren.hasOwnProperty(name)) continue;
          const oldChild = targetChildren[name];
          const newChild = sourceChildren[name];
          if (log.has(newChild)) throw new Error(`TypedDOM: Typed DOM children can't repeatedly be used to the same object.`);
          void log.add(newChild);
          if (newChild.element.parentNode !== this.container as Element) {
            void throwErrorIfNotUsable(newChild);
          }
          if (oldChild.element !== newChild.element || this.initialChildren.has(oldChild)) {
            void this.scope(newChild);
            void addedChildren.push(newChild);
            void removedChildren.push(oldChild);
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
    if (removedChildren.length + addedChildren.length > 0) {
      void this.element.dispatchEvent(new Event('change', { bubbles: false, cancelable: true }));
    }
  }
}

function observe<C extends ElChildren.Record>(node: Node, children: C): C {
  const descs: PropertyDescriptorMap = {};
  for (const name in children) {
    if (!children.hasOwnProperty(name)) continue;
    let child: El<string, Element, ElChildren> = children[name];
    void throwErrorIfNotUsable(child);
    void node.appendChild(child.element);
    descs[name] = {
      configurable: true,
      enumerable: true,
      get: (): El<string, Element, ElChildren> => {
        return child;
      },
      set: (newChild: El<string, Element, ElChildren>) => {
        const oldChild = child;
        if (newChild === oldChild) return;
        if (newChild.element.parentElement !== node) {
          void throwErrorIfNotUsable(newChild);
        }
        void node.replaceChild(newChild.element, oldChild.element);
        child = newChild;
      },
    };
  }
  return Obj.defineProperties(children, descs);
}

function throwErrorIfNotUsable({ element }: El<string, Element, ElChildren>): void {
  if (!element.parentElement || !proxies.has(element.parentElement)) return;
  throw new Error(`TypedDOM: Typed DOM children can't be used to another typed DOM.`);
}
