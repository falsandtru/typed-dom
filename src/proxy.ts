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

// All the properties accessed from its parent must avoid conflicts with
// the same properties of custom proxies.
namespace publics {
  export const events = Symbol.for('typed-dom::events');
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
    this.$children = children;
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
        this.$children = [] as El.Children.Array as C;
        this.children = children as El.Setter<C>;
        this.isInit = false;
        return;
      case ElChildType.Struct:
        this.$children = this.observe(children as El.Children.Struct) as C;
        this.children = children as El.Setter<C>;
        this.isInit = false;
        return;
      default:
        throw new Error(`TypedDOM: Invalid children type.`);
    }
  }
  private $id = '';
  private get id(): string {
    if (this.$id) return this.$id;
    this.$id = this.element.id;
    if (/^[a-z][\w-]*$/i.test(this.$id)) return this.$id;
    if (counter === 999) {
      id = identity();
      counter = 0;
    }
    this.$id = `rnd-${id}-${++counter}`;
    assert(!this.element.classList.contains(this.$id));
    this.element.classList.add(this.$id);
    return this.$id;
  }
  private $query = '';
  private get query(): string {
    if (this.$query) return this.$query;
    switch (true) {
      case this.element !== this.container:
        return this.$query = ':host';
      case this.id === this.element.id:
        return this.$query = `#${this.id}`;
      default:
        return this.$query = `.${this.id}`;
    }
  }
  private scope(child: El): void {
    if (child.tag.toUpperCase() !== 'STYLE') return;
    const source = child.element.innerHTML;
    if (!source.includes(':scope')) return;
    const scope = /(^|[>~+,}/])(\s*)\:scope(?!\w)(?=\s*[A-Za-z#.:[>~+,{/])/g;
    const style = source.replace(scope, (...$) => `${$[1]}${$[2]}${this.query}`);
    assert(!this.$query || style !== source);
    if (style === source) return;
    assert(/^[:#.][\w-]+$/.test(this.query));
    child.element.textContent = style;
    assert(child.element.children.length === 0);
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
  private $children: C;
  public readonly [publics.events] = new Events(this.element);
  public get children(): El.Getter<C> {
    switch (this.type) {
      case ElChildType.Text:
        return this.container.textContent as El.Getter<C>;
      default:
        return this.$children as El.Getter<C>;
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
        if (this.isInit || !this[publics.events].mutate) {
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
        const targetChildren = this.$children as El.Children.Array;
        isMutated ||= sourceChildren.length !== targetChildren.length;
        for (let i = 0; i < sourceChildren.length; ++i) {
          const newChild = sourceChildren[i];
          const oldChild = targetChildren[i];
          throwErrorIfNotUsable(newChild, this.container);
          isMutated ||= newChild.element !== oldChild.element;
          if (newChild.element.parentNode !== this.element) {
            this.scope(newChild);
            assert(!addedChildren.includes(newChild));
            hasConnectionListener(newChild) && addedChildren.push(newChild) && this[publics.events].add(newChild);
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
        this.$children = sourceChildren as C;
        for (let i = 0; i < targetChildren.length; ++i) {
          const oldChild = targetChildren[i];
          if (oldChild.element.parentNode !== container) {
            assert(!removedChildren.includes(oldChild));
            hasConnectionListener(oldChild) && removedChildren.push(oldChild);
            this[publics.events].del(oldChild);
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
            hasConnectionListener(newChild) && addedChildren.push(newChild) && this[publics.events].add(newChild);
            isMutated = true;
          }
          break;
        }
        const sourceChildren = children as El.Children.Struct;
        const targetChildren = this.$children as El.Children.Struct;
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
            hasConnectionListener(newChild) && addedChildren.push(newChild) && this[publics.events].add(newChild);
            assert(!removedChildren.includes(oldChild));
            hasConnectionListener(oldChild) && removedChildren.push(oldChild);
            this[publics.events].del(oldChild);
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
    this.dispatchDisconnectEvent(removedChildren);
    this.dispatchConnectEvent(addedChildren);
    assert(isMutated || removedChildren.length + addedChildren.length === 0);
    if (isMutated && this[publics.events].mutate) {
      this.element.dispatchEvent(new Event('mutate', { bubbles: false, cancelable: true }));
    }
  }
  private get isConnected(): boolean {
    return !!this.element.parentNode && this.element.isConnected;
  }
  private dispatchConnectEvent(
    listeners: El[] | undefined = this[publics.events].listeners,
  ): void {
    if (listeners.length === 0) return;
    if (listeners !== this[publics.events].listeners && !this.isConnected) return;
    for (const listener of listeners) {
      (listener.element[proxy] as this).dispatchConnectEvent();
      getEvents(listener).connect && listener.element.dispatchEvent(new Event('connect', { bubbles: false, cancelable: true }));
    }
  }
  private dispatchDisconnectEvent(
    listeners: El[] | undefined = this[publics.events].listeners,
  ): void {
    if (listeners.length === 0) return;
    if (listeners !== this[publics.events].listeners && !this.isConnected) return;
    for (const listener of listeners) {
      (listener.element[proxy] as this).dispatchDisconnectEvent();
      getEvents(listener).disconnect && listener.element.dispatchEvent(new Event('disconnect', { bubbles: false, cancelable: true }));
    }
  }
}

class Events {
  constructor(
    private readonly element: Element,
  ) {
  }
  public get mutate(): boolean {
    return 'onmutate' in this.element
        && this.element['onmutate'] != null;
  }
  public get connect(): boolean {
    return 'onconnect' in this.element
        && this.element['onconnect'] != null;
  }
  public get disconnect(): boolean {
    return 'ondisconnect' in this.element
        && this.element['ondisconnect'] != null;
  }
  public readonly listeners: El[] = [];
  public add(child: El): void {
    const i = this.listeners.indexOf(child);
    ~i || this.listeners.push(child);
  }
  public del(child: El): void {
    const i = this.listeners.indexOf(child);
    ~i && splice(this.listeners, i, 1);
  }
}

function hasConnectionListener(child: El): boolean {
  const events = getEvents(child);
  return events.listeners.length > 0 || events.connect || events.disconnect;
}
function getEvents(child: El): Events {
  return child[publics.events] ?? (child.element[proxy] as ElementProxy)[publics.events];
}

function throwErrorIfNotUsable(child: El, newParent?: ParentNode): void {
  const oldParent = child.element.parentNode;
  if (!oldParent || oldParent === newParent || !(proxy in oldParent)) return;
  throw new Error(`TypedDOM: Typed DOM children cannot be used to another typed DOM.`);
}
