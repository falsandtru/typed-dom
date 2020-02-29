import { Set, WeakMap, WeakSet, Event, Object } from 'spica/global';
import { isArray, ObjectDefineProperties, ObjectFreeze, ObjectKeys } from 'spica/alias';
import { uid } from './identity';
import { text, define } from '../util/dom';
import { Mutable } from 'spica/type';

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
      case isArray(children_):
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
        this.isInitialization = false;
        return;
      case ElChildrenType.Text:
        void define(this.container, []);
        this.children_ = this.container.appendChild(text('')) as any;
        this.children = children_ as C;
        this.isInitialization = false;
        return;
      case ElChildrenType.Array:
        void define(this.container, []);
        this.children_ = [] as ElChildren.Array as C;
        this.children = children_;
        this.isInitialization = false;
        return;
      case ElChildrenType.Record:
        void define(this.container, []);
        this.children_ = this.observe({ ...children_ as ElChildren.Record }) as C;
        this.children = children_;
        this.isInitialization = false;
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
  private isPartialUpdate = false;
  private observe(children: ElChildren.Record): C {
    const descs: PropertyDescriptorMap = {};
    for (const name of ObjectKeys(children)) {
      let child: El<string, Element, ElChildren> = children[name];
      void throwErrorIfNotUsable(child);
      void this.container.appendChild(child.element);
      descs[name] = {
        configurable: true,
        enumerable: true,
        get: (): El<string, Element, ElChildren> => {
          return child;
        },
        set: (newChild: El<string, Element, ElChildren>) => {
          const oldChild = child;
          if (newChild === oldChild) return;
          if (this.isPartialUpdate) {
            child = newChild;
            if (newChild.element.parentNode === oldChild.element.parentNode) {
              const ref = newChild.element.nextSibling !== oldChild.element
                ? newChild.element.nextSibling
                : oldChild.element.nextSibling;
              void this.container.replaceChild(newChild.element, oldChild.element);
              void this.container.insertBefore(oldChild.element, ref);
            }
            else {
              void this.container.insertBefore(newChild.element, oldChild.element);
              void this.container.removeChild(oldChild.element);
            }
          }
          else {
            this.children = {
              ...this.children_ as typeof children,
              [name]: newChild,
            } as C;
          }
        },
      };
    }
    return ObjectDefineProperties(children, descs);
  }
  private scope(child: El<string, Element, ElChildren>): void {
    if (child.element.tagName !== 'STYLE') return;
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
  private isInitialization = true;
  public get children(): C {
    assert([ElChildrenType.Void, ElChildrenType.Array].includes(this.type) ? Object.isFrozen(this.children_) : !Object.isFrozen(this.children_));
    switch (this.type) {
      case ElChildrenType.Text:
        if ((this.children_ as unknown as Text).parentNode !== this.container) {
          this.children_ = void 0 as unknown as C;
          for (const node of this.container.childNodes) {
            if ('wholeText' in node === false) continue;
            this.children_ = node as any;
            break;
          }
        }
        return (this.children_ as unknown as Text).data as C;
      default:
        return this.children_ as C;
    }
  }
  public set children(children: C) {
    const removedChildren: El[] = [];
    const addedChildren: El[] = [];
    let isChanged = false;
    switch (this.type) {
      case ElChildrenType.Void:
        return;
      case ElChildrenType.Text: {
        if (!this.isInitialization && children === this.children) return;
        const targetChildren = this.children_ as unknown as Text;
        const oldText = targetChildren.data;
        const newText = children as ElChildren.Text;
        targetChildren.data = newText;
        if (newText === oldText) return;
        void this.element.dispatchEvent(new Event('change', { bubbles: false, cancelable: true }));
        return;
      }
      case ElChildrenType.Array: {
        const sourceChildren = children as ElChildren.Array;
        const targetChildren = [] as Mutable<ElChildren.Array>;
        this.children_ = targetChildren as ElChildren as C;
        const nodeChildren = this.container.children;
        const log = new WeakSet<El>();
        for (let i = 0; i < sourceChildren.length; ++i) {
          const newChild = sourceChildren[i];
          const el = nodeChildren[i];
          if (log.has(newChild)) throw new Error(`TypedDOM: Typed DOM children can't repeatedly be used to the same object.`);
          void log.add(newChild);
          if (newChild.element.parentNode !== this.container) {
            void throwErrorIfNotUsable(newChild);
          }
          if (newChild.element !== el) {
            if (newChild.element.parentNode !== this.container) {
              void this.scope(newChild);
              void addedChildren.push(newChild);
            }
            void this.container.insertBefore(newChild.element, el);
            isChanged = true;
          }
          void targetChildren.push(newChild);
        }
        void ObjectFreeze(targetChildren);
        for (let i = nodeChildren.length; sourceChildren.length < i--;) {
          const el = nodeChildren[sourceChildren.length];
          if (!proxies.has(el)) continue;
          void removedChildren.push(proxy(this.container.removeChild(el)));
          isChanged = true;
        }
        assert(this.container.children.length === sourceChildren.length);
        assert(targetChildren.every((child, i) => child.element === this.container.children[i]));
        break;
      }
      case ElChildrenType.Record: {
        const sourceChildren = children as ElChildren.Record;
        const targetChildren = this.children_ as ElChildren.Record;
        assert.deepStrictEqual(Object.keys(sourceChildren), Object.keys(targetChildren));
        const log = new WeakSet<El>();
        for (const name of ObjectKeys(targetChildren)) {
          const oldChild = targetChildren[name];
          const newChild = sourceChildren[name];
          if (log.has(newChild)) throw new Error(`TypedDOM: Typed DOM children can't repeatedly be used to the same object.`);
          void log.add(newChild);
          if (!this.isInitialization && newChild === oldChild) continue;
          if (newChild.element.parentNode !== this.container) {
            void throwErrorIfNotUsable(newChild);
          }
          if (this.isInitialization || newChild !== oldChild && newChild.element.parentNode !== oldChild.element.parentNode) {
            void this.scope(newChild);
            void addedChildren.push(newChild);
            if (!this.isInitialization) {
              let i = 0;
              i = removedChildren.lastIndexOf(newChild);
              i > -1 && removedChildren.splice(i, 1);
              void removedChildren.push(oldChild);
              i = addedChildren.lastIndexOf(oldChild);
              i > -1 && addedChildren.splice(i, 1);
            }
          }
          this.isPartialUpdate = true;
          targetChildren[name] = sourceChildren[name];
          this.isPartialUpdate = false;
          isChanged = true;
        }
        break;
      }
    }
    for (const child of removedChildren) {
      void child.element.dispatchEvent(new Event('disconnect', { bubbles: false, cancelable: true }));
    }
    for (const child of addedChildren) {
      void child.element.dispatchEvent(new Event('connect', { bubbles: false, cancelable: true }));
    }
    assert(isChanged || removedChildren.length + addedChildren.length === 0);
    if (isChanged) {
      void this.element.dispatchEvent(new Event('change', { bubbles: false, cancelable: true }));
    }
  }
}

function throwErrorIfNotUsable({ element }: El<string, Element, ElChildren>): void {
  if (!element.parentElement || !proxies.has(element.parentElement)) return;
  throw new Error(`TypedDOM: Typed DOM children can't be used to another typed DOM.`);
}
