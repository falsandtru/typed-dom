import type { ParseSelector } from 'typed-query-selector/parser';

export function querySelectorWith<T extends keyof HTMLElementTagNameMap>(node: ParentNode, selector: T): HTMLElementTagNameMap[T] | null;
export function querySelectorWith<T extends keyof SVGElementTagNameMap>(node: ParentNode, selector: T): SVGElementTagNameMap[T] | null;
export function querySelectorWith<T extends string>(node: ParentNode, selector: T): ParseSelector<T>;
export function querySelectorWith<T extends Element>(node: ParentNode, selector: string): T | null;
export function querySelectorWith(node: ParentNode | Element, selector: string): Element | null {
  return 'matches' in node && node.matches(selector)
    ? node
    : node.querySelector(selector);
}

export function querySelectorAllWith<T extends keyof HTMLElementTagNameMap>(node: ParentNode, selector: T): HTMLElementTagNameMap[T][];
export function querySelectorAllWith<T extends keyof SVGElementTagNameMap>(node: ParentNode, selector: T): SVGElementTagNameMap[T][];
export function querySelectorAllWith<T extends string>(node: ParentNode, selector: T): ParseSelector<T>[];
export function querySelectorAllWith<T extends Element>(node: ParentNode, selector: string): T[];
export function querySelectorAllWith(node: ParentNode | Element, selector: string): Element[] {
  const acc: Element[] = [];
  if ('matches' in node && node.matches(selector)) {
    acc.push(node);
  }
  for (let es = node.querySelectorAll(selector), len = es.length, i = 0; i < len; ++i) {
    acc.push(es[i]);
  }
  return acc;
}

// for文との二重反復をコールバックで解消しても変化なし
export function querySelectorAll<T extends keyof HTMLElementTagNameMap>(node: ParentNode, selector: T): HTMLElementTagNameMap[T][];
export function querySelectorAll<T extends keyof SVGElementTagNameMap>(node: ParentNode, selector: T): SVGElementTagNameMap[T][];
export function querySelectorAll<T extends string>(node: ParentNode, selector: T): ParseSelector<T>[];
export function querySelectorAll<T extends Element>(node: ParentNode, selector: string): T[];
export function querySelectorAll(node: ParentNode | Element, selector: string): Element[] {
  const acc: Element[] = [];
  for (let es = node.querySelectorAll(selector), len = es.length, i = 0; i < len; ++i) {
    acc.push(es[i]);
  }
  return acc;
}
