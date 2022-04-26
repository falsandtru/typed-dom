import type { ParseSelector } from 'typed-query-selector/parser';

export function querySelector<T extends keyof HTMLElementTagNameMap>(node: ParentNode, selector: T): HTMLElementTagNameMap[T] | null;
export function querySelector<T extends keyof SVGElementTagNameMap>(node: ParentNode, selector: T): SVGElementTagNameMap[T] | null;
export function querySelector<T extends string>(node: ParentNode, selector: T): ParseSelector<T>;
export function querySelector<T extends Element = Element>(node: ParentNode, selector: string): T | null;
export function querySelector(node: ParentNode | Element, selector: string): Element | null {
  return 'matches' in node && node.matches(selector)
    ? node
    : node.querySelector(selector);
}

export function querySelectorAll<T extends keyof HTMLElementTagNameMap>(node: ParentNode, selector: T): HTMLElementTagNameMap[T][];
export function querySelectorAll<T extends keyof SVGElementTagNameMap>(node: ParentNode, selector: T): SVGElementTagNameMap[T][];
export function querySelectorAll<T extends string>(node: ParentNode, selector: T): ParseSelector<T>[];
export function querySelectorAll<T extends Element = Element>(node: ParentNode, selector: string): T[];
export function querySelectorAll(node: ParentNode | Element, selector: string): Element[] {
  const acc: Element[] = [];
  if ('matches' in node && node.matches(selector)) {
    acc.push(node);
  }
  const nodes = node.querySelectorAll(selector);
  for (let i = 0, len = nodes.length; i < len; ++i) {
    acc.push(nodes[i]);
  }
  return acc;
}
