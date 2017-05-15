/**
*
* typed-dom.d.ts
*
* @author falsandtru https://github.com/falsandtru/typed-dom
*/

export default TypedHTML;

export interface TypedHTMLElement<
  T extends string,
  E extends HTMLElement,
  C extends TypedHTMLElementChildren
>
  extends AbstractTypedHTMLElement<T> {
  readonly element: E;
  children: C;
}
type TypedHTMLElementChildren
  = TypedHTMLElementChildren.Text
  | TypedHTMLElementChildren.Collection
  | TypedHTMLElementChildren.Struct;
declare namespace TypedHTMLElementChildren {
  export type Text = string;
  export type Collection = TypedHTMLElement<string, HTMLElement, any>[];
  export type Struct = { [name: string]: TypedHTMLElement<string, HTMLElement, any>; };
}
declare abstract class AbstractTypedHTMLElement<T extends string> {
  private identifier: T;
}

interface TypedHTMLElementBuilder<T extends string, E extends HTMLElement> {
  (): TypedHTMLElement<T, E, never>;
  <C extends TypedHTMLElementChildren>
  (children: C, factory?: () => E): TypedHTMLElement<T, E, C>;
  <C extends TypedHTMLElementChildren>
  (attrs: { [name: string]: string; }, children: C, factory?: () => E): TypedHTMLElement<T, E, C>;
}

export const TypedHTML: {
  // lib.dom.d.ts
  [K in keyof HTMLElementTagNameMap]: TypedHTMLElementBuilder<K, HTMLElementTagNameMap[K]>;
} & {
  abbr: TypedHTMLElementBuilder<'abbr', HTMLElement>;
  acronym: TypedHTMLElementBuilder<'acronym', HTMLElement>;
  address: TypedHTMLElementBuilder<'address', HTMLElement>;
  article: TypedHTMLElementBuilder<'article', HTMLElement>;
  aside: TypedHTMLElementBuilder<'aside', HTMLElement>;
  b: TypedHTMLElementBuilder<'b', HTMLElement>;
  bdo: TypedHTMLElementBuilder<'bdo', HTMLElement>;
  big: TypedHTMLElementBuilder<'big', HTMLElement>;
  center: TypedHTMLElementBuilder<'center', HTMLElement>;
  cite: TypedHTMLElementBuilder<'cite', HTMLElement>;
  code: TypedHTMLElementBuilder<'code', HTMLElement>;
  dd: TypedHTMLElementBuilder<'dd', HTMLElement>;
  dfn: TypedHTMLElementBuilder<'dfn', HTMLElement>;
  dt: TypedHTMLElementBuilder<'dt', HTMLElement>;
  em: TypedHTMLElementBuilder<'em', HTMLElement>;
  figcaption: TypedHTMLElementBuilder<'figcaption', HTMLElement>;
  figure: TypedHTMLElementBuilder<'figure', HTMLElement>;
  footer: TypedHTMLElementBuilder<'footer', HTMLElement>;
  header: TypedHTMLElementBuilder<'header', HTMLElement>;
  hgroup: TypedHTMLElementBuilder<'hgroup', HTMLElement>;
  i: TypedHTMLElementBuilder<'i', HTMLElement>;
  kbd: TypedHTMLElementBuilder<'kbd', HTMLElement>;
  keygen: TypedHTMLElementBuilder<'keygen', HTMLElement>;
  mark: TypedHTMLElementBuilder<'mark', HTMLElement>;
  nav: TypedHTMLElementBuilder<'nav', HTMLElement>;
  nobr: TypedHTMLElementBuilder<'nobr', HTMLElement>;
  noframes: TypedHTMLElementBuilder<'noframes', HTMLElement>;
  noscript: TypedHTMLElementBuilder<'noscript', HTMLElement>;
  plaintext: TypedHTMLElementBuilder<'plaintext', HTMLElement>;
  rt: TypedHTMLElementBuilder<'rt', HTMLElement>;
  ruby: TypedHTMLElementBuilder<'ruby', HTMLElement>;
  s: TypedHTMLElementBuilder<'s', HTMLElement>;
  samp: TypedHTMLElementBuilder<'samp', HTMLElement>;
  section: TypedHTMLElementBuilder<'section', HTMLElement>;
  small: TypedHTMLElementBuilder<'small', HTMLElement>;
  strike: TypedHTMLElementBuilder<'strike', HTMLElement>;
  strong: TypedHTMLElementBuilder<'strong', HTMLElement>;
  sub: TypedHTMLElementBuilder<'sub', HTMLElement>;
  sup: TypedHTMLElementBuilder<'sup', HTMLElement>;
  tt: TypedHTMLElementBuilder<'tt', HTMLElement>;
  u: TypedHTMLElementBuilder<'u', HTMLElement>;
  var: TypedHTMLElementBuilder<'var', HTMLElement>;
  wbr: TypedHTMLElementBuilder<'wbr', HTMLElement>;
  // custom
  custom<T extends string, E extends HTMLElement = HTMLElement, C extends TypedHTMLElementChildren = TypedHTMLElementChildren>(children: C, factory: () => E, tag: T): TypedHTMLElement<T, E, C>;
  custom<T extends string, E extends HTMLElement = HTMLElement, C extends TypedHTMLElementChildren = TypedHTMLElementChildren>(attrs: { [name: string]: string; }, children: C, factory: () => E, tag: T): TypedHTMLElement<T, E, C>;
};

export function bind<T extends keyof WindowEventMap>(target: Window, type: T, listener: (ev: WindowEventMap[T]) => any, option?: boolean | EventListenerOption): () => undefined;
export function bind<T extends keyof DocumentEventMap>(target: Document, type: T, listener: (ev: DocumentEventMap[T]) => any, option?: boolean | EventListenerOption): () => undefined;
export function bind<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => any, option?: boolean | EventListenerOption): () => undefined;
export function once<T extends keyof WindowEventMap>(target: Window, type: T, listener: (ev: WindowEventMap[T]) => any, option?: boolean | EventListenerOption): () => undefined;
export function once<T extends keyof DocumentEventMap>(target: Document, type: T, listener: (ev: DocumentEventMap[T]) => any, option?: boolean | EventListenerOption): () => undefined;
export function once<T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (ev: HTMLElementEventMap[T]) => any, option?: boolean | EventListenerOption): () => undefined;
export function delegate<T extends keyof HTMLElementEventMap>(target: HTMLElement, selector: string, type: T, listener: (ev: HTMLElementEventMap[T]) => any, option?: EventListenerOption): () => undefined;
interface EventListenerOption {
  capture?: boolean;
  passive?: boolean;
}
