import { Attrs, define } from "./dom";

export function apply<T extends keyof HTMLElementTagNameMap>(node: ParentNode, selector: T, attrs?: Attrs): NodeListOf<HTMLElementTagNameMap[T]>
export function apply<T extends keyof SVGElementTagNameMap_>(node: ParentNode, selector: T, attrs?: Attrs): NodeListOf<SVGElementTagNameMap_[T]>
export function apply<T extends Element = Element>(node: ParentNode, selector: string, attrs?: Attrs): NodeListOf<T>
export function apply<T extends Element = Element>(node: ParentNode, selector: string, attrs?: Attrs): NodeListOf<T> {
  const ns = node.querySelectorAll<T>(selector);
  for (const n of ns) {
    void define(n, attrs);
  }
  return ns;
}
