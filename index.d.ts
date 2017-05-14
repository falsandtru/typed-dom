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

interface TypedHTMLElementBuilder<E extends HTMLElement, T extends string> {
  (): TypedHTMLElement<T, E, never>;
  <C extends string>
  (children: C): TypedHTMLElement<T, E, C>;
  <C extends string>
  (children: C, factory?: () => E): never;
  <C extends TypedHTMLElementChildren>
  (children: C, factory?: () => E): TypedHTMLElement<T, E, C>;
  <C extends string>
  (attrs: { [name: string]: string; }, children: C, factory?: () => E): never;
  <C extends TypedHTMLElementChildren>
  (attrs: { [name: string]: string; }, children: C, factory?: () => E): TypedHTMLElement<T, E, C>;
}

export const TypedHTML: {
  // lib.dom.d.ts
  [K in keyof HTMLElementTagNameMap]: TypedHTMLElementBuilder<HTMLElementTagNameMap[K], K>;
} & {
  abbr: TypedHTMLElementBuilder<HTMLElement, 'abbr'>;
  acronym: TypedHTMLElementBuilder<HTMLElement, 'acronym'>;
  address: TypedHTMLElementBuilder<HTMLElement, 'address'>;
  article: TypedHTMLElementBuilder<HTMLElement, 'article'>;
  aside: TypedHTMLElementBuilder<HTMLElement, 'aside'>;
  b: TypedHTMLElementBuilder<HTMLElement, 'b'>;
  bdo: TypedHTMLElementBuilder<HTMLElement, 'bdo'>;
  big: TypedHTMLElementBuilder<HTMLElement, 'big'>;
  center: TypedHTMLElementBuilder<HTMLElement, 'center'>;
  cite: TypedHTMLElementBuilder<HTMLElement, 'cite'>;
  code: TypedHTMLElementBuilder<HTMLElement, 'code'>;
  dd: TypedHTMLElementBuilder<HTMLElement, 'dd'>;
  dfn: TypedHTMLElementBuilder<HTMLElement, 'dfn'>;
  dt: TypedHTMLElementBuilder<HTMLElement, 'dt'>;
  em: TypedHTMLElementBuilder<HTMLElement, 'em'>;
  figcaption: TypedHTMLElementBuilder<HTMLElement, 'figcaption'>;
  figure: TypedHTMLElementBuilder<HTMLElement, 'figure'>;
  footer: TypedHTMLElementBuilder<HTMLElement, 'footer'>;
  header: TypedHTMLElementBuilder<HTMLElement, 'header'>;
  hgroup: TypedHTMLElementBuilder<HTMLElement, 'hgroup'>;
  i: TypedHTMLElementBuilder<HTMLElement, 'i'>;
  kbd: TypedHTMLElementBuilder<HTMLElement, 'kbd'>;
  keygen: TypedHTMLElementBuilder<HTMLElement, 'keygen'>;
  mark: TypedHTMLElementBuilder<HTMLElement, 'mark'>;
  nav: TypedHTMLElementBuilder<HTMLElement, 'nav'>;
  nobr: TypedHTMLElementBuilder<HTMLElement, 'nobr'>;
  noframes: TypedHTMLElementBuilder<HTMLElement, 'noframes'>;
  noscript: TypedHTMLElementBuilder<HTMLElement, 'noscript'>;
  plaintext: TypedHTMLElementBuilder<HTMLElement, 'plaintext'>;
  rt: TypedHTMLElementBuilder<HTMLElement, 'rt'>;
  ruby: TypedHTMLElementBuilder<HTMLElement, 'ruby'>;
  s: TypedHTMLElementBuilder<HTMLElement, 's'>;
  samp: TypedHTMLElementBuilder<HTMLElement, 'samp'>;
  section: TypedHTMLElementBuilder<HTMLElement, 'section'>;
  small: TypedHTMLElementBuilder<HTMLElement, 'small'>;
  strike: TypedHTMLElementBuilder<HTMLElement, 'strike'>;
  strong: TypedHTMLElementBuilder<HTMLElement, 'strong'>;
  sub: TypedHTMLElementBuilder<HTMLElement, 'sub'>;
  sup: TypedHTMLElementBuilder<HTMLElement, 'sup'>;
  tt: TypedHTMLElementBuilder<HTMLElement, 'tt'>;
  u: TypedHTMLElementBuilder<HTMLElement, 'u'>;
  var: TypedHTMLElementBuilder<HTMLElement, 'var'>;
  wbr: TypedHTMLElementBuilder<HTMLElement, 'wbr'>;
  // custom
  custom<E extends HTMLElement, T extends string, C extends TypedHTMLElementChildren>(children: C, factory: () => E, tag: T): TypedHTMLElement<T, E, C>;
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
