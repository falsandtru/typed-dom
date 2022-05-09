import { Event } from 'spica/global';
import { isArray, hasOwnProperty, ObjectDefineProperties, ObjectKeys } from 'spica/alias';
import { TagNameMap, Attrs, Factory as BaseFactory } from './util/dom';
import { identity } from './util/identity';

declare global {
  interface ElementEventMap {
    'mutate': Event;
    'connect': Event;
    'disconnect': Event;
  }
}

const proxy = Symbol.for('typed-dom::proxy');

export interface El<
  T extends string = string,
  E extends Element = Element,
  C extends El.Children = El.Children,
  > {
  readonly tag: T;
  readonly element: E;
  //get children(): C;
  get children(): El.Getter<C>;
  set children(children: El.Setter<C>);
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
  export type Getter<C extends El.Children> =
    C extends readonly unknown[] ? C :
    C;
  export type Setter<C extends El.Children> =
    C extends readonly unknown[] ? C :
    Partial<C>;
  // Bug: TypeScript: Type U must not affect Type C
  //export type Factory<M extends TagNameMap, F extends BaseFactory<M> = BaseFactory<M>, T extends keyof M & string = keyof M & string, C extends El.Children = El.Children> = <U extends T>(baseFactory: F, tag: U, attrs: Attrs, children: C) => M[U];
  export type Factory<
    M extends TagNameMap,
    F extends BaseFactory<M> = BaseFactory<M>,
    T extends keyof M & string = keyof M & string,
    C extends El.Children = El.Children,
    > =
    (baseFactory: F, tag: T, attrs: Attrs, children: C) => M[T];
}
const enum ElChildType {
  Void,
  Text,
  Array,
  Struct,
}

namespace privates {
  export const events = Symbol.for('typed-dom::events');
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
  T extends string = string,
  E extends Element = Element,
  C extends El.Children = El.Children,
  > implements El<T, E, C> {
  constructor(
    public readonly tag: T,
    public readonly element: E,
    children: C,
    container: Element | ShadowRoot = element,
  ) {
    const events = this[privates.events];
    assert('' != null);
    events.mutate = 'onmutate' in element && element['onmutate'] != null;
    events.connect = 'onconnect' in element && element['onconnect'] != null;
    events.disconnect = 'ondisconnect' in element && element['ondisconnect'] != null;
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
    this.element[proxy] = this;
    switch (this[privates.type]) {
      case ElChildType.Void:
        this[privates.isInit] = false;
        return;
      case ElChildType.Text:
        this.children = children as El.Setter<C>;
        this[privates.isInit] = false;
        return;
      case ElChildType.Array:
        this[privates.children] = [] as El.Children.Array as C;
        this.children = children as El.Setter<C>;
        this[privates.isInit] = false;
        return;
      case ElChildType.Struct:
        this[privates.children] = this[privates.observe](children as El.Children.Struct) as C;
        this.children = children as El.Setter<C>;
        this[privates.isInit] = false;
        return;
      default:
        throw new Error(`TypedDOM: Invalid children type.`);
    }
  }
  private readonly [privates.events] = {
    mutate: false,
    connect: false,
    disconnect: false,
  };
  private [privates.id_] = '';
  private get [privates.id](): string {
    if (this[privates.id_]) return this[privates.id_];
    this[privates.id_] = this.element.id;
    if (/^[a-z][\w-]*$/i.test(this[privates.id_])) return this[privates.id_];
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
    if (child.tag.toUpperCase() !== 'STYLE') return;
    const source = child.element.innerHTML;
    if (!source.includes(':scope')) return;
    const scope = /(^|[>~+,}/])(\s*)\:scope(?!\w)(?=\s*[A-Za-z#.:[>~+,{/])/g;
    const style = source.replace(scope, (...$) => `${$[1]}${$[2]}${this[privates.query]}`);
    assert(!this[privates.query_] || style !== source);
    if (style === source) return;
    child.element.innerHTML = style;
    assert(/^[:#.][\w-]+$/.test(this[privates.query]));
    assert(child.element.children.length === 0);
    child.element.firstElementChild && child.element.replaceChildren();
  }
  private [privates.isObserverUpdate] = false;
  private [privates.observe](children: El.Children.Struct): El.Children.Struct {
    return ObjectDefineProperties(children, ObjectKeys(children).reduce((obj, name) => {
      if (name in {}) throw new Error(`TypedDOM: Child names conflicted with the object property names.`);
      let child = children[name];
      obj[name] = {
        configurable: true,
        enumerable: true,
        get: (): El => {
          return child;
        },
        set: (newChild: El) => {
          if (!this[privates.isObserverUpdate]) {
            this.children = { [name]: newChild } as El.Setter<C>;
          }
          else {
            this[privates.isObserverUpdate] = false;
          }
          child = newChild;
        },
      };
      return obj;
    }, {}));
  }
  private readonly [privates.type]: ElChildType;
  private readonly [privates.container]: Element | ShadowRoot;
  private [privates.isInit] = true;
  private [privates.children]: C;
  public get children(): El.Getter<C> {
    switch (this[privates.type]) {
      case ElChildType.Text:
        return this[privates.container].textContent as El.Getter<C>;
      default:
        return this[privates.children] as El.Getter<C>;
    }
  }
  public set children(children: El.Setter<C>) {
    assert(!this[privates.isObserverUpdate]);
    const container = this[privates.container];
    const removedChildren: El[] = [];
    const addedChildren: El[] = [];
    let isMutated = false;
    switch (this[privates.type]) {
      case ElChildType.Void:
        return;
      case ElChildType.Text: {
        if (this[privates.isInit] || !this[privates.events].mutate) {
          container.textContent = children as El.Children.Text;
          isMutated = true;
          break;
        }
        const newText = children;
        const oldText = this.children;
        if (newText === oldText) break;
        container.textContent = newText as El.Children.Text;
        isMutated = true;
        break;
      }
      case ElChildType.Array: {
        const sourceChildren = children as El.Children.Array;
        const targetChildren = this[privates.children] as El.Children.Array;
        isMutated ||= sourceChildren.length !== targetChildren.length;
        for (let i = 0; i < sourceChildren.length; ++i) {
          const newChild = sourceChildren[i];
          const oldChild = targetChildren[i];
          throwErrorIfNotUsable(newChild, this[privates.container]);
          isMutated ||= newChild.element !== oldChild.element;
          if (newChild.element.parentNode !== this.element) {
            this[privates.scope](newChild);
            assert(!addedChildren.includes(newChild));
            events(newChild)?.connect && addedChildren.push(newChild);
          }
        }
        if (container.firstChild) {
          container.replaceChildren(...sourceChildren.map(c => c.element));
        }
        else {
          for (let i = 0; i < sourceChildren.length; ++i) {
            container.appendChild(sourceChildren[i].element);
          }
        }
        this[privates.children] = sourceChildren as C;
        for (let i = 0; i < targetChildren.length; ++i) {
          const oldChild = targetChildren[i];
          if (oldChild.element.parentNode !== container) {
            assert(!removedChildren.includes(oldChild));
            events(oldChild)?.disconnect && removedChildren.push(oldChild);
            assert(isMutated);
          }
        }
        assert(container.children.length === sourceChildren.length);
        assert(sourceChildren.every((child, i) => child.element === container.children[i]));
        break;
      }
      case ElChildType.Struct: {
        if (this[privates.isInit]) {
          container.firstChild && container.replaceChildren();
          const sourceChildren = children as El.Children.Struct;
          for (const name in sourceChildren) {
            if (!hasOwnProperty(sourceChildren, name)) continue;
            const newChild = sourceChildren[name];
            throwErrorIfNotUsable(newChild, this[privates.container]);
            this[privates.scope](newChild);
            container.appendChild(newChild.element);
            assert(!addedChildren.includes(newChild));
            events(newChild)?.connect && addedChildren.push(newChild);
            isMutated = true;
          }
          break;
        }
        const sourceChildren = children as El.Children.Struct;
        const targetChildren = this[privates.children] as El.Children.Struct;
        if (sourceChildren === targetChildren) break;
        for (const name in sourceChildren) {
          if (!hasOwnProperty(sourceChildren, name)) continue;
          const newChild = sourceChildren[name];
          const oldChild = targetChildren[name];
          if (!newChild || !oldChild) continue;
          if (newChild === oldChild) continue;
          throwErrorIfNotUsable(newChild, this[privates.container]);
          if (newChild !== oldChild && newChild.element.parentNode !== oldChild.element.parentNode) {
            this[privates.scope](newChild);
            container.replaceChild(newChild.element, oldChild.element);
            assert(!oldChild.element.parentNode);
            assert(!addedChildren.includes(newChild));
            events(newChild)?.connect && addedChildren.push(newChild);
            assert(!removedChildren.includes(oldChild));
            events(oldChild)?.disconnect && removedChildren.push(oldChild);
          }
          else {
            assert(newChild.element.parentNode === oldChild.element.parentNode);
            const ref = newChild.element.nextSibling;
            container.insertBefore(newChild.element, oldChild.element);
            container.insertBefore(oldChild.element, ref);
          }
          isMutated = true;
          this[privates.isObserverUpdate] = true;
          targetChildren[name] = newChild;
          assert(!this[privates.isObserverUpdate]);
          this[privates.isObserverUpdate] = false;
        }
        break;
      }
    }
    for (let i = 0; i < removedChildren.length; ++i) {
      removedChildren[i].element.dispatchEvent(new Event('disconnect', { bubbles: false, cancelable: true }));
    }
    for (let i = 0; i < addedChildren.length; ++i) {
      addedChildren[i].element.dispatchEvent(new Event('connect', { bubbles: false, cancelable: true }));
    }
    assert(isMutated || removedChildren.length + addedChildren.length === 0);
    if (isMutated && this[privates.events].mutate) {
      this.element.dispatchEvent(new Event('mutate', { bubbles: false, cancelable: true }));
    }
  }
}

function events(child: El): Elem[typeof privates.events] | undefined {
  return child[privates.events] ?? child.element[proxy]?.[privates.events];
}

function throwErrorIfNotUsable(child: El, newParent?: ParentNode): void {
  const oldParent = child.element.parentNode;
  if (!oldParent || oldParent === newParent || !(proxy in oldParent)) return;
  throw new Error(`TypedDOM: Typed DOM children cannot be used to another typed DOM.`);
}
