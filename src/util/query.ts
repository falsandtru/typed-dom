import { Attrs, define } from "./dom";

export function apply<T extends keyof HTMLElementTagNameMap>(node: ParentNode, selector: T, attrs?: Attrs): NodeListOf<HTMLElementTagNameMap[T]>
export function apply<T extends keyof SVGElementTagNameMap>(node: ParentNode, selector: T, attrs?: Attrs): NodeListOf<SVGElementTagNameMap[T]>
export function apply<T extends Element = Element>(node: ParentNode, selector: string, attrs?: Attrs): NodeListOf<T>
export function apply<T extends Element = Element>(node: ParentNode, selector: string, attrs?: Attrs): NodeListOf<T> {
  const ns = node.querySelectorAll<T>(selector);
  for (let i = 0, len = ns.length; i < len; ++i) {
    void define(ns[i], attrs);
  }
  return ns;
}
