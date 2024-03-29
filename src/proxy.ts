import { isArray } from 'spica/alias';
import { symbols, Listeners } from './internal';
import { TagNameMap, Attrs, Factory as BaseFactory } from './util/dom';

declare global {
  interface ElementEventMap {
    'mutate': Event;
    'connect': Event;
    'disconnect': Event;
  }
}

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
    | Children.Node
    | Children.Text
    | Children.Array
    | Children.Struct;
  export namespace Children {
    export type Void = void;
    export type Node = DocumentFragment;
    export type Text = string;
    export type Array = readonly El[];
    export type Struct = { [field: string]: El; };
  }
  export type Getter<C extends El.Children> = C;
  export type Setter<C extends El.Children> =
    C extends Children.Struct ? Partial<C> :
    C;
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
  Node,
  Array,
  Struct,
}

export class ElementProxy<
  T extends string = string,
  E extends Element = Element,
  C extends El.Children = El.Children,
  > implements El<T, E, C> {
  constructor(
    public readonly tag: T,
    public readonly element: E,
    children: C,
    private readonly container: Element | ShadowRoot = element,
  ) {
    this.$children = children as C;
    const type = typeof children;
    switch (true) {
      case type === 'undefined':
        this.type = ElChildType.Void;
        break;
      case type === 'string':
        this.type = ElChildType.Text;
        break;
      case type === 'object' && typeof children['nodeType'] === 'number':
        this.type = ElChildType.Node;
        break;
      case isArray(children):
        this.type = ElChildType.Array;
        break;
      case type === 'object':
        this.type = ElChildType.Struct;
        break;
      default:
        throw new TypeError(`Typed-DOM: Invalid children type`);
    }
    throwErrorIfUnavailable(this);
    this.element[symbols.proxy] = this;
    switch (this.type) {
      case ElChildType.Void:
        break;
      case ElChildType.Text:
      case ElChildType.Node:
        this.children = children as El.Setter<C>;
        break;
      case ElChildType.Array:
        this.$children = children as El.Children.Array as C;
        this.children = children as El.Setter<C>;
        break;
      case ElChildType.Struct:
        this.$children = this.observe(children as El.Children.Struct) as C;
        this.children = children as El.Setter<C>;
        break;
      default:
        throw new TypeError(`Typed-DOM: Invalid children type`);
    }
    this.isInit = false;
  }
  private isInternalUpdate = false;
  private observe(children: El.Children.Struct): El.Children.Struct {
    for (const name of Object.keys(children)) {
      let child = children[name];
      Object.defineProperty(children, name, {
        configurable: true,
        enumerable: true,
        get(): El {
          return child;
        },
        set: (newChild: El) => {
          if (!this.isInternalUpdate) {
            this.children = { [name]: newChild } as El.Setter<C>;
          }
          else {
            child = newChild;
            this.isInternalUpdate = false;
          }
          assert(!this.isInternalUpdate);
        },
      });
    }
    return children;
  }
  private readonly type: ElChildType;
  private isInit = true;
  private $children: C;
  public readonly [symbols.listeners] = new Listeners(this.element);
  public get children(): El.Getter<C> {
    switch (this.type) {
      case ElChildType.Text:
        return this.container.textContent as El.Getter<C>;
      default:
        return this.$children as El.Getter<C>;
    }
  }
  public set children(children: El.Setter<C>) {
    assert(!this.isInternalUpdate);
    const container = this.container;
    const removedChildren: El[] = [];
    const addedChildren: El[] = [];
    const listeners = this[symbols.listeners];
    let isMutated = false;
    switch (this.type) {
      case ElChildType.Void:
        return;
      case ElChildType.Node:
        this.$children = children as C;
        container.replaceChildren(children as El.Children.Node);
        isMutated = true;
        break;
      case ElChildType.Text: {
        if (listeners.mutation) {
          const newText = children;
          const oldText = this.children;
          if (newText === oldText) break;
          container.textContent = newText as El.Children.Text;
          isMutated = true;
        }
        else {
          container.textContent = children as El.Children.Text;
        }
        break;
      }
      case ElChildType.Array: {
        const sourceChildren = children as El.Children.Array;
        const targetChildren = this.$children as El.Children.Array;
        isMutated ||= sourceChildren.length !== targetChildren.length;
        for (let i = 0; i < sourceChildren.length; ++i) {
          const newChild = sourceChildren[i];
          const oldChild = targetChildren[i];
          if (this.isInit) {
            assert(newChild === oldChild);
            throwErrorIfUnavailable(newChild, container);
            const hasListener = Listeners.of(newChild)?.haveConnectionListener();
            if (newChild.element.parentNode !== container) {
              isMutated = true;
              assert(!addedChildren.includes(newChild));
              hasListener && addedChildren.push(newChild);
            }
            else {
              isMutated ||= newChild.element !== container.childNodes[i];
            }
            hasListener && listeners.add(newChild);
            continue;
          }
          else if (newChild === oldChild) {
            assert(newChild.element === oldChild.element);
            continue;
          }
          else if (newChild.element.parentNode !== oldChild?.element.parentNode) {
            throwErrorIfUnavailable(newChild, container);
            assert(!addedChildren.includes(newChild));
            Listeners.of(newChild)?.haveConnectionListener() && addedChildren.push(newChild) && listeners.add(newChild);
          }
          assert(newChild !== oldChild);
          assert(newChild.element !== oldChild?.element);
          isMutated = true;
        }
        if (isMutated || sourceChildren.length === 0 && container.firstChild) {
          container.replaceChildren(...sourceChildren.map(c => c.element));
        }
        this.$children = sourceChildren as C;
        for (let i = 0; i < targetChildren.length; ++i) {
          const oldChild = targetChildren[i];
          if (oldChild.element.parentNode === container) continue;
          assert(!removedChildren.includes(oldChild));
          Listeners.of(oldChild)?.haveConnectionListener() && removedChildren.push(oldChild) && listeners.del(oldChild);
          assert(isMutated);
        }
        assert(container.children.length === sourceChildren.length);
        assert(sourceChildren.every((child, i) => child.element === container.children[i]));
        break;
      }
      case ElChildType.Struct: {
        const sourceChildren = children as El.Children.Struct;
        const targetChildren = this.$children as El.Children.Struct;
        for (const name of Object.keys(sourceChildren)) {
          const newChild = sourceChildren[name];
          const oldChild = targetChildren[name];
          if (!newChild) continue;
          if (this.isInit) {
            assert(newChild === oldChild);
            throwErrorIfUnavailable(newChild, container);
            const hasListener = Listeners.of(newChild)?.haveConnectionListener();
            if (newChild.element.parentNode !== container) {
              container.appendChild(newChild.element);
              isMutated = true;
              assert(!addedChildren.includes(newChild));
              hasListener && addedChildren.push(newChild);
            }
            hasListener && listeners.add(newChild);
            continue;
          }
          else if (newChild === oldChild) {
            assert(newChild.element === oldChild.element);
            continue;
          }
          else if (newChild.element.parentNode !== oldChild.element.parentNode) {
            throwErrorIfUnavailable(newChild, container);
            container.replaceChild(newChild.element, oldChild.element);
            assert(!oldChild.element.parentNode);
            assert(!addedChildren.includes(newChild));
            Listeners.of(newChild)?.haveConnectionListener() && addedChildren.push(newChild) && listeners.add(newChild);
            assert(!removedChildren.includes(oldChild));
            Listeners.of(oldChild)?.haveConnectionListener() && removedChildren.push(oldChild) && listeners.del(oldChild);
          }
          assert(newChild !== oldChild);
          assert(newChild.element !== oldChild.element);
          isMutated = true;
          this.isInternalUpdate = true;
          targetChildren[name] = newChild;
          assert(!this.isInternalUpdate);
        }
        break;
      }
    }
    listeners.dispatchDisconnectEvent(removedChildren);
    listeners.dispatchConnectEvent(addedChildren);
    assert(isMutated || removedChildren.length + addedChildren.length === 0);
    isMutated && listeners.dispatchMutateEvent();
  }
}

function throwErrorIfUnavailable(child: El, newParent?: ParentNode): void {
  const oldParent = child.element.parentNode;
  if (!oldParent || oldParent === newParent || !(symbols.proxy in oldParent)) return;
  throw new Error(`Typed-DOM: Proxy children must be removed from the old parent proxy before assigning to the new parent proxy`);
}
