import { WeakMap, Event } from 'spica/global';
import { isArray, ObjectDefineProperties, ObjectKeys } from 'spica/alias';
import { identity } from './util/identity';

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
  export const isObserverUpdate = Symbol();
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
    throwErrorIfNotUsable(this, null);
    proxies.set(this.element, this);
    switch (this[privates.type]) {
      case ElChildType.Void:
        this[privates.isInit] = false;
        return;
      case ElChildType.Text:
        this.children = children as C;
        this[privates.isInit] = false;
        return;
      case ElChildType.Array:
        this[privates.container].replaceChildren();
        this[privates.children] = [] as El.Children.Array as C;
        this.children = children;
        this[privates.isInit] = false;
        return;
      case ElChildType.Struct:
        this[privates.container].replaceChildren();
        this[privates.children] = this[privates.observe](children as El.Children.Struct) as C;
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
  private [privates.isObserverUpdate] = false;
  private [privates.observe](children: El.Children.Struct): C {
    const descs: PropertyDescriptorMap = {};
    for (const name of ObjectKeys(children)) {
      if (name in {}) throw new Error(`TypedDOM: Child names must be different from the object property names.`);
      let child = children[name];
      throwErrorIfNotUsable(child, null);
      descs[name] = {
        configurable: true,
        enumerable: true,
        get: (): El => {
          return child;
        },
        set: (newChild: El) => {
          if (!this[privates.isObserverUpdate]) {
            this.children = { [name]: newChild } as C;
          }
          else {
            this[privates.isObserverUpdate] = false;
          }
          child = newChild;
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
        return this[privates.container].textContent as C;
      default:
        return this[privates.children] as C;
    }
  }
  public set children(children: C) {
    assert(!this[privates.isObserverUpdate]);
    const removedChildren: El[] = [];
    const addedChildren: El[] = [];
    let isMutated = false;
    switch (this[privates.type]) {
      case ElChildType.Void:
        return;
      case ElChildType.Text: {
        const newText = children;
        const oldText = this.children;
        if (!this[privates.isInit] && newText === oldText) return;
        isMutated = true;
        this[privates.container].textContent = newText as El.Children.Text;
        break;
      }
      case ElChildType.Array: {
        const sourceChildren = children as El.Children.Array;
        const targetChildren = this[privates.children] as El.Children.Array;
        isMutated ||= sourceChildren.length !== targetChildren.length;
        for (let i = 0; i < sourceChildren.length; ++i) {
          const newChild = sourceChildren[i];
          const oldChild = targetChildren[i];
          isMutated ||= newChild.element !== oldChild.element;
          throwErrorIfNotUsable(newChild, this[privates.container]);
          if (newChild.element.parentNode !== this[privates.container]) {
            this[privates.scope](newChild);
            assert(!addedChildren.includes(newChild));
            addedChildren.push(newChild);
          }
        }
        this[privates.container].replaceChildren(...sourceChildren.map(c => c.element));
        this[privates.children] = children;
        for (let i = 0; i < targetChildren.length; ++i) {
          const oldChild = targetChildren[i];
          if (oldChild.element.parentNode !== this[privates.container]) {
            assert(!removedChildren.includes(oldChild));
            removedChildren.push(oldChild);
            assert(isMutated);
          }
        }
        assert(this[privates.container].children.length === sourceChildren.length);
        assert(sourceChildren.every((child, i) => child.element === this[privates.container].children[i]));
        break;
      }
      case ElChildType.Struct: {
        const sourceChildren = children as El.Children.Struct;
        const targetChildren = this[privates.children] as El.Children.Struct;
        for (const name of ObjectKeys(sourceChildren)) {
          if (name in {}) continue;
          const newChild = sourceChildren[name];
          const oldChild = targetChildren[name];
          if (!newChild || !oldChild) continue;
          if (!this[privates.isInit] && newChild === oldChild) continue;
          isMutated = true;
          throwErrorIfNotUsable(newChild, this[privates.container]);
          if (this[privates.isInit] || newChild !== oldChild && newChild.element.parentNode !== oldChild.element.parentNode) {
            this[privates.scope](newChild);
            assert(!addedChildren.includes(newChild));
            addedChildren.push(newChild);
            if (this[privates.isInit]) {
              this[privates.container].appendChild(newChild.element);
            }
            else {
              this[privates.container].insertBefore(newChild.element, oldChild.element);
              this[privates.container].removeChild(oldChild.element);
              assert(!removedChildren.includes(oldChild));
              removedChildren.push(oldChild);
            }
          }
          else {
            assert(newChild.element.parentNode === oldChild.element.parentNode);
            const ref = newChild.element.nextSibling !== oldChild.element
              ? newChild.element.nextSibling
              : oldChild.element.nextSibling;
            this[privates.container].replaceChild(newChild.element, oldChild.element);
            this[privates.container].insertBefore(oldChild.element, ref);
          }
          this[privates.isObserverUpdate] = true;
          targetChildren[name] = newChild;
          assert(!this[privates.isObserverUpdate]);
          this[privates.isObserverUpdate] = false;
        }
        break;
      }
    }
    if (removedChildren.length) {
      for (const { element } of removedChildren) {
        element.dispatchEvent(new Event('disconnect', { bubbles: false, cancelable: true }));
      }
    }
    if (addedChildren.length) {
      for (const { element } of addedChildren) {
        element.dispatchEvent(new Event('connect', { bubbles: false, cancelable: true }));
      }
    }
    assert(isMutated || removedChildren.length + addedChildren.length === 0);
    if (isMutated) {
      this.element.dispatchEvent(new Event('mutate', { bubbles: false, cancelable: true }));
    }
  }
}

const proxies = new WeakMap<Element, El>();

export function proxy<C extends El.Children>(el: Element): El<string, Element, C> | undefined;
export function proxy<E extends Element, C extends El.Children = El.Children>(el: E): El<string, E, C> | undefined;
export function proxy<T extends string, E extends Element, C extends El.Children = El.Children>(el: E): El<T, E, C> | undefined;
export function proxy(el: Element): El | undefined {
  return proxies.get(el);
}

function throwErrorIfNotUsable(child: El, container: Element | ShadowRoot | null): void {
  const parent = child.element.parentElement;
  if (!parent || container === parent || !proxies.has(parent)) return;
  throw new Error(`TypedDOM: Typed DOM children must not be used to another typed DOM.`);
}
