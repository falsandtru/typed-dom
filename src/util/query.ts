import { Attrs, define } from "./dom";

export function apply<T extends keyof HTMLElementTagNameMap>(node: ParentNode, selector: T, attrs?: Attrs): Iterable<HTMLElementTagNameMap[T]>
export function apply<T extends keyof SVGElementTagNameMap_>(node: ParentNode, selector: T, attrs?: Attrs): Iterable<SVGElementTagNameMap_[T]>
export function apply<T extends Element = Element>(node: ParentNode, selector: string, attrs?: Attrs): Iterable<T>
export function* apply<T extends Element = Element>(node: ParentNode, selector: string, attrs?: Attrs): Iterable<T> {
  for (const n of node.querySelectorAll<T>(selector)) {
    yield define(n, attrs);
  }
}
