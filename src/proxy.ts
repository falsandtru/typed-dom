import { Event } from 'spica/global';
import { isArray, hasOwnProperty, ObjectDefineProperties, ObjectKeys } from 'spica/alias';
import { TagNameMap, Attrs, Factory as BaseFactory } from './util/dom';
import { identity } from './util/identity';
import { splice } from 'spica/array';

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
  export type Factory<
    M extends TagNameMap,
    C extends El.Children = El.Children,
    > =
    <T extends keyof M & string>(
      baseFactory: BaseFactory<M>,
      tag: T,
      attrs: Attrs<Extract<M[T], Element>>,
      children: C,
    ) => M[T];
}
const enum ElChildType {
  Void,
  Text,
  Array,
  Struct,
}

namespace privates {
  export const listeners = Symbol.for('typed-dom::listeners');
}

let id = identity();
let counter = 0;

export class ElementProxy<
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
    const listeners = this[privates.listeners];
    assert('' != null);
    listeners.mutate = 'onmutate' in element && element['onmutate'] != null;
    listeners.connect = 'onconnect' in element && element['onconnect'] != null;
    listeners.disconnect = 'ondisconnect' in element && element['ondisconnect'] != null;
    this.children_ = children;
    this.container = container;
    switch (true) {
      case children === void 0:
        this.type = ElChildType.Void;
        break;
      case typeof children === 'string':
        this.type = ElChildType.Text
        break;
      case isArray(children):
        this.type = ElChildType.Array;
        break;
      case children && typeof children === 'object':
        this.type = ElChildType.Struct;
        break;
      default:
        throw new Error(`TypedDOM: Invalid children type.`);
    }
    throwErrorIfNotUsable(this);
    this.element[proxy] = this;
    switch (this.type) {
      case ElChildType.Void:
        this.isInit = false;
        return;
      case ElChildType.Text:
        this.children = children as El.Setter<C>;
        this.isInit = false;
        return;
      case ElChildType.Array:
        this.children_ = [] as El.Children.Array as C;
        this.children = children as El.Setter<C>;
        this.isInit = false;
        return;
      case ElChildType.Struct:
        this.children_ = this.observe(children as El.Children.Struct) as C;
        this.children = children as El.Setter<C>;
        this.isInit = false;
        return;
      default:
        throw new Error(`TypedDOM: Invalid children type.`);
    }
  }
  private [privates.listeners] = {
    mutate: false,
    connect: false,
    disconnect: false,
    values: [] as El[],
    add(child: El): void {
      this.values.push(child);
    },
    delete(child: El): void {
      assert(this.values.indexOf(child) > -1);
      splice(this.values, this.values.indexOf(child), 1);
    },
  };
  private id_ = '';
  private get id(): string {
    if (this.id_) return this.id_;
    this.id_ = this.element.id;
    if (/^[a-z][\w-]*$/i.test(this.id_)) return this.id_;
    if (counter === 999) {
      id = identity();
      counter = 0;
    }
    this.id_ = `rnd-${id}-${++counter}`;
    assert(!this.element.classList.contains(this.id_));
    this.element.classList.add(this.id_);
    return this.id_;
  }
  private query_ = '';
  private get query(): string {
    if (this.query_) return this.query_;
    switch (true) {
      case this.element !== this.container:
        return this.query_ = ':host';
      case this.id === this.element.id:
        return this.query_ = `#${this.id}`;
      default:
        return this.query_ = `.${this.id}`;
    }
  }
  private scope(child: El): void {
    if (child.tag.toUpperCase() !== 'STYLE') return;
    const source = child.element.innerHTML;
    if (!source.includes(':scope')) return;
    const scope = /(^|[>~+,}/])(\s*)\:scope(?!\w)(?=\s*[A-Za-z#.:[>~+,{/])/g;
    const style = source.replace(scope, (...$) => `${$[1]}${$[2]}${this.query}`);
    assert(!this.query_ || style !== source);
    if (style === source) return;
    child.element.innerHTML = style;
    assert(/^[:#.][\w-]+$/.test(this.query));
    assert(child.element.children.length === 0);
    child.element.firstElementChild && child.element.replaceChildren();
  }
  private isObserverUpdate = false;
  private observe(children: El.Children.Struct): El.Children.Struct {
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
          if (!this.isObserverUpdate) {
            this.children = { [name]: newChild } as El.Setter<C>;
          }
          else {
            this.isObserverUpdate = false;
          }
          child = newChild;
        },
      };
      return obj;
    }, {}));
  }
  private readonly type: ElChildType;
  private readonly container: Element | ShadowRoot;
  private isInit = true;
  private children_: C;
  public get children(): El.Getter<C> {
    switch (this.type) {
      case ElChildType.Text:
        return this.container.textContent as El.Getter<C>;
      default:
        return this.children_ as El.Getter<C>;
    }
  }
  public set children(children: El.Setter<C>) {
    assert(!this.isObserverUpdate);
    const container = this.container;
    const removedChildren: El[] = [];
    const addedChildren: El[] = [];
    let isMutated = false;
    switch (this.type) {
      case ElChildType.Void:
        return;
      case ElChildType.Text: {
        if (this.isInit || !this[privates.listeners].mutate) {
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
        const targetChildren = this.children_ as El.Children.Array;
        isMutated ||= sourceChildren.length !== targetChildren.length;
        for (let i = 0; i < sourceChildren.length; ++i) {
          const newChild = sourceChildren[i];
          const oldChild = targetChildren[i];
          throwErrorIfNotUsable(newChild, this.container);
          isMutated ||= newChild.element !== oldChild.element;
          if (newChild.element.parentNode !== this.element) {
            this.scope(newChild);
            assert(!addedChildren.includes(newChild));
            hasListener(newChild) && addedChildren.push(newChild) && this[privates.listeners].add(newChild);
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
        this.children_ = sourceChildren as C;
        for (let i = 0; i < targetChildren.length; ++i) {
          const oldChild = targetChildren[i];
          if (oldChild.element.parentNode !== container) {
            assert(!removedChildren.includes(oldChild));
            hasListener(oldChild) && removedChildren.push(oldChild) && this[privates.listeners].delete(oldChild);
            assert(isMutated);
          }
        }
        assert(container.children.length === sourceChildren.length);
        assert(sourceChildren.every((child, i) => child.element === container.children[i]));
        break;
      }
      case ElChildType.Struct: {
        if (this.isInit) {
          container.firstChild && container.replaceChildren();
          const sourceChildren = children as El.Children.Struct;
          for (const name in sourceChildren) {
            if (!hasOwnProperty(sourceChildren, name)) continue;
            const newChild = sourceChildren[name];
            throwErrorIfNotUsable(newChild, this.container);
            this.scope(newChild);
            container.appendChild(newChild.element);
            assert(!addedChildren.includes(newChild));
            hasListener(newChild) && addedChildren.push(newChild) && this[privates.listeners].add(newChild);
            isMutated = true;
          }
          break;
        }
        const sourceChildren = children as El.Children.Struct;
        const targetChildren = this.children_ as El.Children.Struct;
        if (sourceChildren === targetChildren) break;
        for (const name in sourceChildren) {
          if (!hasOwnProperty(sourceChildren, name)) continue;
          const newChild = sourceChildren[name];
          const oldChild = targetChildren[name];
          if (!newChild || !oldChild) continue;
          if (newChild === oldChild) continue;
          throwErrorIfNotUsable(newChild, this.container);
          if (newChild !== oldChild && newChild.element.parentNode !== oldChild.element.parentNode) {
            this.scope(newChild);
            container.replaceChild(newChild.element, oldChild.element);
            assert(!oldChild.element.parentNode);
            assert(!addedChildren.includes(newChild));
            hasListener(newChild) && addedChildren.push(newChild) && this[privates.listeners].add(newChild);
            assert(!removedChildren.includes(oldChild));
            hasListener(oldChild) && removedChildren.push(oldChild) && this[privates.listeners].delete(oldChild);
          }
          else {
            assert(newChild.element.parentNode === oldChild.element.parentNode);
            const ref = newChild.element.nextSibling;
            container.insertBefore(newChild.element, oldChild.element);
            container.insertBefore(oldChild.element, ref);
          }
          isMutated = true;
          this.isObserverUpdate = true;
          targetChildren[name] = newChild;
          assert(!this.isObserverUpdate);
          this.isObserverUpdate = false;
        }
        break;
      }
    }
    this.dispatchDisconnectionEvent(removedChildren);
    this.dispatchConnectionEvent(addedChildren);
    assert(isMutated || removedChildren.length + addedChildren.length === 0);
    if (isMutated && this[privates.listeners].mutate) {
      this.element.dispatchEvent(new Event('mutate', { bubbles: false, cancelable: true }));
    }
  }
  private get isConnected(): boolean {
    return !!this.element.parentNode && this.element.isConnected;
  }
  private dispatchConnectionEvent(
    listeners: El[] | undefined = this[privates.listeners].values,
    isConnected = listeners.length !== 0 && this.isConnected,
  ): void {
    if (listeners.length === 0) return;
    if (listeners !== this[privates.listeners].values && !isConnected) return;
    for (const listener of listeners) {
      listener.element[proxy].dispatchConnectionEvent(void 0, isConnected);
      getListeners(listener)?.connect && listener.element.dispatchEvent(new Event('connect', { bubbles: false, cancelable: true }));
    }
  }
  private dispatchDisconnectionEvent(
    listeners: El[] | undefined = this[privates.listeners].values,
    isConnected = listeners.length !== 0 && this.isConnected,
  ): void {
    if (listeners.length === 0) return;
    if (listeners !== this[privates.listeners].values && !isConnected) return;
    for (const listener of listeners) {
      listener.element[proxy].dispatchDisconnectionEvent(void 0, isConnected);
      getListeners(listener)?.disconnect && listener.element.dispatchEvent(new Event('disconnect', { bubbles: false, cancelable: true }));
    }
  }
}

function hasListener(child: El): boolean {
  const ls = getListeners(child);
  return ls?.connect || ls?.disconnect || ls?.values.length! > 0;
}
function getListeners(child: El): ElementProxy[typeof privates.listeners] | undefined {
  return child[privates.listeners] ?? child.element[proxy]?.[privates.listeners];
}

function throwErrorIfNotUsable(child: El, newParent?: ParentNode): void {
  const oldParent = child.element.parentNode;
  if (!oldParent || oldParent === newParent || !(proxy in oldParent)) return;
  throw new Error(`TypedDOM: Typed DOM children cannot be used to another typed DOM.`);
}
