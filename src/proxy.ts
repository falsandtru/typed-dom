import { Mutable } from 'spica/type';
import { WeakMap, Event } from 'spica/global';
import { isArray, ObjectDefineProperties, ObjectKeys } from 'spica/alias';
import { identity } from './util/identity';
import { text, define } from './util/dom';
import { splice } from 'spica/array';

const tag = Symbol.for('typed-dom::tag');

export interface El<
  T extends string = string,
  E extends Element = Element,
  C extends El.Children = El.Children,
  > {
  readonly [tag]?: T;
  readonly element: E;
  children: C;
}
export namespace El {
  export type Children =
    | Children.Void
    | Children.Text
    | Children.Array
    | Children.Struct;
  export namespace Children {
    export type Void = undefined;
    export type Text = string;
    export type Array = readonly El[];
    export type Struct = { [field: string]: El; };
  }
}
const enum ElChildType {
  Void,
  Text,
  Array,
  Struct,
}

namespace privates {
  export const id = Symbol();
  export const id_ = Symbol();
  export const query = Symbol();
  export const query_ = Symbol();
  export const scope = Symbol();
  export const observe = Symbol();
  export const type = Symbol();
  export const container = Symbol();
  export const children = Symbol();
  export const isInit = Symbol();
  export const isPartialUpdate = Symbol();
}

let id = identity();
let counter = 0;

export class Elem<
  T extends string,
  E extends Element,
  C extends El.Children,
  > {
  constructor(
    public readonly element: E,
    children: C,
    container: Element | ShadowRoot = element,
  ) {
    this[privates.children] = children;
    this[privates.container] = container;
    switch (true) {
      case children === void 0:
        this[privates.type] = ElChildType.Void;
        break;
      case typeof children === 'string':
        this[privates.type] = ElChildType.Text
        break;
      case isArray(children):
        this[privates.type] = ElChildType.Array;
        break;
      case children && typeof children === 'object':
        this[privates.type] = ElChildType.Struct;
        break;
      default:
        throw new Error(`TypedDOM: Invalid children type.`);
    }
    throwErrorIfNotUsable(this);
    proxies.set(this.element, this);
    switch (this[privates.type]) {
      case ElChildType.Void:
        this[privates.isInit] = false;
        return;
      case ElChildType.Text:
        define(this[privates.container], []);
        this[privates.children] = this[privates.container].appendChild(text('')) as any;
        this.children = children as C;
        this[privates.isInit] = false;
        return;
      case ElChildType.Array:
        define(this[privates.container], []);
        this[privates.children] = [] as El.Children.Array as C;
        this.children = children;
        this[privates.isInit] = false;
        return;
      case ElChildType.Struct:
        define(this[privates.container], []);
        this[privates.children] = this[privates.observe]({ ...children as El.Children.Struct }) as C;
        this.children = children;
        this[privates.isInit] = false;
        return;
      default:
        throw new Error(`TypedDOM: Unreachable code.`);
    }
  }
  public readonly [tag]: T;
  private [privates.id_] = '';
  private get [privates.id](): string {
    if (this[privates.id_]) return this[privates.id_];
    this[privates.id_] = this.element.id;
    if (/^[\w-]+$/.test(this[privates.id_])) return this[privates.id_];
    if (counter === 999) {
      id = identity();
      counter = 0;
    }
    this[privates.id_] = `rnd-${id}-${++counter}`;
    assert(!this.element.classList.contains(this[privates.id_]));
    this.element.classList.add(this[privates.id_]);
    return this[privates.id_];
  }
  private [privates.query_] = '';
  private get [privates.query](): string {
    if (this[privates.query_]) return this[privates.query_];
    switch (true) {
      case this.element !== this[privates.container]:
        return this[privates.query_] = ':host';
      case this[privates.id] === this.element.id:
        return this[privates.query_] = `#${this[privates.id]}`;
      default:
        return this[privates.query_] = `.${this[privates.id]}`;
    }
  }
  private [privates.scope](child: El): void {
    if (child.element.tagName !== 'STYLE') return;
    const target = /(^|[,}]|\*\/)(\s*)\$scope(?=[\s~+[{:>,])/g;
    const style = child.element.innerHTML;
    if (!target.test(style)) return;
    assert(/^[:#.][\w-]+$/.test(this[privates.query]));
    child.element.innerHTML = style.replace(target, `$1$2${this[privates.query]}`);
    child.element.firstElementChild && child.element.replaceChildren();
  }
  private [privates.isPartialUpdate] = false;
  private [privates.observe](children: El.Children.Struct): C {
    const descs: PropertyDescriptorMap = {};
    let i = -1;
    for (const name of ObjectKeys(children)) {
      if (name in {}) throw new Error(`TypedDOM: Child names must be different from the object property names.`);
      ++i;
      let child = children[name];
      throwErrorIfNotUsable(child);
      if (child.element !== this[privates.container].children[i]) {
        this[privates.container].appendChild(child.element);
      }
      descs[name] = {
        configurable: true,
        enumerable: true,
        get: (): El => {
          return child;
        },
        set: (newChild: El) => {
          const partial = this[privates.isPartialUpdate];
          this[privates.isPartialUpdate] = false;
          const oldChild = child;
          if (newChild === oldChild) return;
          if (partial) {
            child = newChild;
            if (newChild.element.parentNode === oldChild.element.parentNode) {
              const ref = newChild.element.nextSibling !== oldChild.element
                ? newChild.element.nextSibling
                : oldChild.element.nextSibling;
              this[privates.container].replaceChild(newChild.element, oldChild.element);
              this[privates.container].insertBefore(oldChild.element, ref);
            }
            else {
              this[privates.container].insertBefore(newChild.element, oldChild.element);
              this[privates.container].removeChild(oldChild.element);
            }
          }
          else {
            this.children = {
              ...this[privates.children] as typeof children,
              [name]: newChild,
            } as C;
          }
        },
      };
    }
    return ObjectDefineProperties(children, descs) as C;
  }
  private readonly [privates.type]: ElChildType;
  private readonly [privates.container]: Element | ShadowRoot;
  private [privates.isInit] = true;
  private [privates.children]: C;
  public get children(): C {
    switch (this[privates.type]) {
      case ElChildType.Text:
        if ((this[privates.children] as unknown as Text).parentNode !== this[privates.container]) {
          this[privates.children] = void 0 as unknown as C;
          for (let ns = this[privates.container].childNodes, i = 0, len = ns.length; i < len; ++i) {
            const node = ns[i];
            if ('wholeText' in node === false) continue;
            this[privates.children] = node as any;
            break;
          }
        }
        return (this[privates.children] as unknown as Text).data as C;
      default:
        return this[privates.children] as C;
    }
  }
  public set children(children: C) {
    assert(!this[privates.isPartialUpdate]);
    const removedChildren: El[] = [];
    const addedChildren: El[] = [];
    let isMutated = false;
    switch (this[privates.type]) {
      case ElChildType.Void:
        return;
      case ElChildType.Text: {
        if (!this[privates.isInit] && children === this.children) return;
        const targetChildren = this[privates.children] as unknown as Text;
        const oldText = targetChildren.data;
        const newText = children as El.Children.Text;
        targetChildren.data = newText;
        if (newText === oldText) return;
        this.element.dispatchEvent(new Event('mutate', { bubbles: false, cancelable: true }));
        return;
      }
      case ElChildType.Array: {
        const sourceChildren = children as El.Children.Array;
        const targetChildren = [] as Mutable<El.Children.Array>;
        this[privates.children] = targetChildren as El.Children as C;
        const nodeChildren = this[privates.container].children;
        for (let i = 0; i < sourceChildren.length; ++i) {
          const newChild = sourceChildren[i];
          const el = nodeChildren[i];
          if (newChild.element.parentNode !== this[privates.container]) {
            throwErrorIfNotUsable(newChild);
          }
          if (newChild.element !== el) {
            if (newChild.element.parentNode !== this[privates.container]) {
              this[privates.scope](newChild);
              addedChildren.push(newChild);
            }
            this[privates.container].insertBefore(newChild.element, el);
            isMutated = true;
          }
          targetChildren.push(newChild);
        }
        for (let i = nodeChildren.length; sourceChildren.length < i--;) {
          const oldChild = proxy(nodeChildren[sourceChildren.length]);
          if (!oldChild) continue;
          this[privates.container].removeChild(oldChild.element);
          removedChildren.push(oldChild);
          isMutated = true;
        }
        assert(this[privates.container].children.length === sourceChildren.length);
        assert(targetChildren.every((child, i) => child.element === this[privates.container].children[i]));
        break;
      }
      case ElChildType.Struct: {
        const sourceChildren = children as El.Children.Struct;
        const targetChildren = this[privates.children] as El.Children.Struct;
        assert.deepStrictEqual(Object.keys(sourceChildren), Object.keys(targetChildren));
        for (const name of ObjectKeys(targetChildren)) {
          const oldChild = targetChildren[name];
          const newChild = sourceChildren[name];
          if (!this[privates.isInit] && newChild === oldChild) continue;
          if (newChild.element.parentNode !== this[privates.container]) {
            throwErrorIfNotUsable(newChild);
          }
          if (this[privates.isInit] || newChild !== oldChild && newChild.element.parentNode !== oldChild.element.parentNode) {
            this[privates.scope](newChild);
            addedChildren.push(newChild);
            if (!this[privates.isInit]) {
              let i = 0;
              i = removedChildren.lastIndexOf(newChild);
              i > -1 && splice(removedChildren, i, 1);
              removedChildren.push(oldChild);
              i = addedChildren.lastIndexOf(oldChild);
              i > -1 && splice(addedChildren, i, 1);
            }
          }
          this[privates.isPartialUpdate] = true;
          targetChildren[name] = sourceChildren[name];
          assert(!this[privates.isPartialUpdate]);
          this[privates.isPartialUpdate] = false;
          isMutated = true;
        }
        break;
      }
    }
    if (removedChildren.length) {
      const ev = new Event('disconnect', { bubbles: false, cancelable: true });
      for (const { element } of removedChildren) {
        element.dispatchEvent(ev);
      }
    }
    if (addedChildren.length) {
      const ev = new Event('connect', { bubbles: false, cancelable: true });
      for (const { element } of addedChildren) {
        element.dispatchEvent(ev);
      }
    }
    assert(isMutated || removedChildren.length + addedChildren.length === 0);
    if (isMutated) {
      this.element.dispatchEvent(new Event('mutate', { bubbles: false, cancelable: true }));
    }
  }
}

const proxies = new WeakMap<Element, El>();

export function proxy<E extends Element>(el: E): El<string, E, El.Children>;
export function proxy<C extends El.Children>(el: Element): El<string, Element, C>;
export function proxy<E extends Element, C extends El.Children>(el: E): El<string, E, C>;
export function proxy(el: Element): El {
  const proxy = proxies.get(el);
  if (proxy) return proxy;
  throw new Error(`TypedDOM: This element has no proxy.`);
}

function throwErrorIfNotUsable({ element }: El): void {
  if (!element.parentElement || !proxies.has(element.parentElement)) return;
  throw new Error(`TypedDOM: Typed DOM children must not be used to another typed DOM.`);
}
