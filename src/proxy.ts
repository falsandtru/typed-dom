import { Mutable } from 'spica/type';
import { WeakMap, Event } from 'spica/global';
import { isArray, ObjectDefineProperties, ObjectKeys } from 'spica/alias';
import { identity } from './util/identity';
import { text, define } from './util/dom';
import { splice } from 'spica/array';

const enum ElChildType {
  Void,
  Text,
  Array,
  Record,
}

export type ElChildren =
  | ElChild.Void
  | ElChild.Text
  | ElChild.Array
  | ElChild.Record;

export namespace ElChild {
  export type Void = undefined;
  export type Text = string;
  export type Array = readonly El[];
  export type Record = { [field: string]: El; };
}

const proxies = new WeakMap<Element, El>();

export function proxy<E extends Element>(el: E): El<string, E, ElChildren>;
export function proxy<C extends ElChildren>(el: Element): El<string, Element, C>;
export function proxy<E extends Element, C extends ElChildren>(el: E): El<string, E, C>;
export function proxy(el: Element): El {
  const proxy = proxies.get(el);
  if (proxy) return proxy;
  throw new Error(`TypedDOM: This element has no proxy.`);
}

const tag = Symbol.for('typed-dom::tag');
const id = identity();
let counter = 0;

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
        this.type = ElChildType.Void;
        break;
      case typeof children_ === 'string':
        this.type = ElChildType.Text
        break;
      case isArray(children_):
        this.type = ElChildType.Array;
        break;
      case children_ && typeof children_ === 'object':
        this.type = ElChildType.Record;
        break;
      default:
        throw new Error(`TypedDOM: Invalid type children.`);
    }
    throwErrorIfNotUsable(this);
    proxies.set(this.element, this);
    switch (this.type) {
      case ElChildType.Void:
        this.isInit = false;
        return;
      case ElChildType.Text:
        define(this.container, []);
        this.children_ = this.container.appendChild(text('')) as any;
        this.children = children_ as C;
        this.isInit = false;
        return;
      case ElChildType.Array:
        define(this.container, []);
        this.children_ = [] as ElChild.Array as C;
        this.children = children_;
        this.isInit = false;
        return;
      case ElChildType.Record:
        define(this.container, []);
        this.children_ = this.observe({ ...children_ as ElChild.Record }) as C;
        this.children = children_;
        this.isInit = false;
        return;
      default:
        throw new Error(`TypedDOM: Unreachable code.`);
    }
  }
  public readonly [tag]: T;
  private readonly type: ElChildType;
  private id_ = '';
  private get id(): string {
    if (this.id_) return this.id_;
    this.id_ = this.element.id;
    if (/^[\w-]+$/.test(this.id_)) return this.id_;
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
    const style = child.element as HTMLStyleElement | Element;
    switch (false) {
      case 'type' in style:
      case 'media' in style:
      case style.tagName === 'STYLE':
        return;
    }
    const target = /(^|[,}])(\s*)\$scope(?![\w-])(?=[^;{}]*{)/g;
    const html = style.innerHTML;
    if (html.search(target) === -1) return;
    const query = this.query;
    assert(/^[:#.][\w-]+$/.test(query));
    style.innerHTML = html.replace(target, `$1$2${query}`);
    if (!style.firstElementChild) return;
    for (let es = style.children, i = 0, len = es.length; i < len; ++i) {
      es[0].remove();
    }
  }
  private isPartialUpdate = false;
  private observe(children: ElChild.Record): C {
    const descs: PropertyDescriptorMap = {};
    for (const name of ObjectKeys(children)) {
      if (name in {}) continue;
      let child: El = children[name];
      throwErrorIfNotUsable(child);
      this.container.appendChild(child.element);
      descs[name] = {
        configurable: true,
        enumerable: true,
        get: (): El => {
          return child;
        },
        set: (newChild: El) => {
          const oldChild = child;
          if (newChild === oldChild) return;
          if (this.isPartialUpdate) {
            child = newChild;
            if (newChild.element.parentNode === oldChild.element.parentNode) {
              const ref = newChild.element.nextSibling !== oldChild.element
                ? newChild.element.nextSibling
                : oldChild.element.nextSibling;
              this.container.replaceChild(newChild.element, oldChild.element);
              this.container.insertBefore(oldChild.element, ref);
            }
            else {
              this.container.insertBefore(newChild.element, oldChild.element);
              this.container.removeChild(oldChild.element);
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
    return ObjectDefineProperties(children, descs) as C;
  }
  private isInit = true;
  public get children(): C {
    switch (this.type) {
      case ElChildType.Text:
        if ((this.children_ as unknown as Text).parentNode !== this.container) {
          this.children_ = void 0 as unknown as C;
          for (let ns = this.container.childNodes, i = 0, len = ns.length; i < len; ++i) {
            const node = ns[i];
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
    let isMutated = false;
    switch (this.type) {
      case ElChildType.Void:
        return;
      case ElChildType.Text: {
        if (!this.isInit && children === this.children) return;
        const targetChildren = this.children_ as unknown as Text;
        const oldText = targetChildren.data;
        const newText = children as ElChild.Text;
        targetChildren.data = newText;
        if (newText === oldText) return;
        this.element.dispatchEvent(new Event('mutate', { bubbles: false, cancelable: true }));
        return;
      }
      case ElChildType.Array: {
        const sourceChildren = children as ElChild.Array;
        const targetChildren = [] as Mutable<ElChild.Array>;
        this.children_ = targetChildren as ElChildren as C;
        const nodeChildren = this.container.children;
        for (let i = 0; i < sourceChildren.length; ++i) {
          const newChild = sourceChildren[i];
          const el = nodeChildren[i];
          if (newChild.element.parentNode !== this.container) {
            throwErrorIfNotUsable(newChild);
          }
          if (newChild.element !== el) {
            if (newChild.element.parentNode !== this.container) {
              this.scope(newChild);
              addedChildren.push(newChild);
            }
            this.container.insertBefore(newChild.element, el);
            isMutated = true;
          }
          targetChildren.push(newChild);
        }
        for (let i = nodeChildren.length; sourceChildren.length < i--;) {
          const el = nodeChildren[sourceChildren.length];
          if (!proxies.has(el)) continue;
          removedChildren.push(proxy(this.container.removeChild(el)));
          isMutated = true;
        }
        assert(this.container.children.length === sourceChildren.length);
        assert(targetChildren.every((child, i) => child.element === this.container.children[i]));
        break;
      }
      case ElChildType.Record: {
        const sourceChildren = children as ElChild.Record;
        const targetChildren = this.children_ as ElChild.Record;
        assert.deepStrictEqual(Object.keys(sourceChildren), Object.keys(targetChildren));
        for (const name of ObjectKeys(targetChildren)) {
          const oldChild = targetChildren[name];
          const newChild = sourceChildren[name];
          if (!this.isInit && newChild === oldChild) continue;
          if (newChild.element.parentNode !== this.container) {
            throwErrorIfNotUsable(newChild);
          }
          if (this.isInit || newChild !== oldChild && newChild.element.parentNode !== oldChild.element.parentNode) {
            this.scope(newChild);
            addedChildren.push(newChild);
            if (!this.isInit) {
              let i = 0;
              i = removedChildren.lastIndexOf(newChild);
              i > -1 && splice(removedChildren, i, 1);
              removedChildren.push(oldChild);
              i = addedChildren.lastIndexOf(oldChild);
              i > -1 && splice(addedChildren, i, 1);
            }
          }
          this.isPartialUpdate = true;
          targetChildren[name] = sourceChildren[name];
          this.isPartialUpdate = false;
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

function throwErrorIfNotUsable({ element }: El): void {
  if (!element.parentElement || !proxies.has(element.parentElement)) return;
  throw new Error(`TypedDOM: Typed DOM children must not be used to another typed DOM.`);
}
