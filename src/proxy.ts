import { Event } from 'spica/global';
import { isArray, ObjectDefineProperties, ObjectKeys } from 'spica/alias';
import { identity } from './util/identity';

const tag = Symbol.for('typed-dom::tag');

export interface El<
  T extends string = string,
  E extends Element = Element,
  C extends El.Children = El.Children,
  > {
  readonly [tag]?: T;
  readonly parent?: El;
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
    export type Void = void;
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
  export const id = Symbol('id');
  export const id_ = Symbol('id_');
  export const query = Symbol('query');
  export const query_ = Symbol('query_');
  export const scope = Symbol('scope');
  export const observe = Symbol('observe');
  export const type = Symbol('type');
  export const container = Symbol('container');
  export const children = Symbol('children');
  export const isInit = Symbol('isInit');
  export const isObserverUpdate = Symbol('isObserverUpdate');
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
    const container = this[privates.container];
    const isInit = this[privates.isInit];
    const removedChildren: El[] = [];
    const addedChildren: El[] = [];
    let isMutated = false;
    switch (this[privates.type]) {
      case ElChildType.Void:
        return;
      case ElChildType.Text: {
        const newText = children;
        const oldText = this.children;
        if (!isInit && newText === oldText) return;
        isMutated = true;
        container.textContent = newText as El.Children.Text;
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
          throwErrorIfNotUsable(newChild, this.element);
          if (newChild.parent?.element !== this.element) {
            // @ts-expect-error
            newChild.parent = this;
            this[privates.scope](newChild);
            assert(!addedChildren.includes(newChild));
            addedChildren.push(newChild);
          }
        }
        container.replaceChildren(...sourceChildren.map(c => c.element));
        this[privates.children] = children;
        for (let i = 0; i < targetChildren.length; ++i) {
          const oldChild = targetChildren[i];
          if (oldChild.element.parentNode !== container) {
            // @ts-expect-error
            oldChild.parent = void 0;
            assert(!removedChildren.includes(oldChild));
            removedChildren.push(oldChild);
            assert(isMutated);
          }
        }
        assert(container.children.length === sourceChildren.length);
        assert(sourceChildren.every((child, i) => child.element === container.children[i]));
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
          if (!isInit && newChild === oldChild) continue;
          isMutated = true;
          throwErrorIfNotUsable(newChild, this.element);
          if (isInit || newChild !== oldChild && newChild.parent?.element !== oldChild.parent?.element) {
            this[privates.scope](newChild);
            assert(!addedChildren.includes(newChild));
            addedChildren.push(newChild);
            if (isInit) {
              container.appendChild(newChild.element);
            }
            else {
              container.insertBefore(newChild.element, oldChild.element);
              container.removeChild(oldChild.element);
              // @ts-expect-error
              oldChild.parent = void 0;
              assert(!removedChildren.includes(oldChild));
              removedChildren.push(oldChild);
            }
            // @ts-expect-error
            newChild.parent = this;
          }
          else {
            assert(newChild.parent?.element === oldChild.parent?.element);
            const ref = newChild.element.nextSibling;
            container.insertBefore(newChild.element, oldChild.element);
            container.insertBefore(oldChild.element, ref);
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
      for (const child of removedChildren) {
        child.element.dispatchEvent(new Event('disconnect', { bubbles: false, cancelable: true }));
      }
    }
    if (addedChildren.length) {
      for (const child of addedChildren) {
        child.element.dispatchEvent(new Event('connect', { bubbles: false, cancelable: true }));
      }
    }
    assert(isMutated || removedChildren.length + addedChildren.length === 0);
    if (isMutated) {
      this.element.dispatchEvent(new Event('mutate', { bubbles: false, cancelable: true }));
    }
  }
}

function throwErrorIfNotUsable(child: El, newParent?: Element): void {
  const oldParent = child.parent?.element;
  if (!oldParent || newParent === oldParent) return;
  throw new Error(`TypedDOM: Typed DOM children must not be used to another typed DOM.`);
}
