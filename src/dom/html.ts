import { TypedHTMLElement, TypedHTMLElementChildren } from './builder';

interface TypedHTMLElementBuilder<T extends string, E extends HTMLElement> {
  (factory?: () => E): TypedHTMLElement<T, E, void>;
  <C extends TypedHTMLElementChildren>
  (children: C, factory?: () => E): TypedHTMLElement<T, E, C>;
  (attrs: { [name: string]: string; }, factory?: () => E): TypedHTMLElement<T, E, void>;
  <C extends TypedHTMLElementChildren>
  (attrs: { [name: string]: string; }, children: C, factory?: () => E): TypedHTMLElement<T, E, C>;
}


export const TypedHTML: {
  // lib.dom.d.ts
  [K in keyof HTMLElementTagNameMap]: TypedHTMLElementBuilder<K, HTMLElementTagNameMap[K]>;
} & {
  // other
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
} = [
  // lib.dom.d.ts
  "a",
  "applet",
  "area",
  "audio",
  "base",
  "basefont",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "col",
  "colgroup",
  "data",
  "datalist",
  "del",
  "dir",
  "div",
  "dl",
  "embed",
  "fieldset",
  "font",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "hr",
  "html",
  "iframe",
  "img",
  "input",
  "ins",
  "isindex",
  "label",
  "legend",
  "li",
  "link",
  "listing",
  "map",
  "marquee",
  "menu",
  "meta",
  "meter",
  "nextid",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "script",
  "select",
  "source",
  "span",
  "style",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "ul",
  "video",
  "x-ms-webview",
  "xmp",
  // other
  'abbr',
  'acronym',
  'address',
  'article',
  'aside',
  'b',
  'bdo',
  'big',
  'center',
  'cite',
  'code',
  'dd',
  'dfn',
  'dt',
  'em',
  'figcaption',
  'figure',
  'footer',
  'header',
  'hgroup',
  'i',
  'kbd',
  'keygen',
  'mark',
  'nav',
  'nobr',
  'noframes',
  'noscript',
  'plaintext',
  'rt',
  'ruby',
  's',
  'samp',
  'section',
  'small',
  'strike',
  'strong',
  'sub',
  'sup',
  'tt',
  'u',
  'var',
  'wbr',
  // custom
  'custom'
]
  .reduce((obj, tag) => (
    obj[tag] =
      <C extends TypedHTMLElementChildren>
      (attrs?: { [name: string]: string; }, children?: C, factory?: () => HTMLElement)
      : TypedHTMLElement<string, HTMLElement, C> => {
        switch (typeof attrs) {
          case 'undefined':
            return new TypedHTMLElement(document.createElement(tag), <never>void 0);
          case 'function':
            return new TypedHTMLElement((attrs as any)(), <never>void 0);
          case 'string':
            return new TypedHTMLElement((children as any || (() => document.createElement(tag)))(), <never>attrs);
          case 'object':
            factory = typeof children === 'function'
              ? children
              : factory || (() => document.createElement(tag));
            return Object.keys(attrs!).slice(-1).every(key => key === void 0 || typeof attrs![key] === 'object')
              ? new TypedHTMLElement(factory(), <any>attrs)
              : new TypedHTMLElement(define(factory(), attrs!), <never>children === factory ? void 0 : children)
          default:
            throw new TypeError(`Invalid arguments: [${attrs}, ${children}, ${factory}]`);
        }
      },
    obj
  ), {} as any);

function define<E extends HTMLElement>(el: E, attrs: { [name: string]: string }): E {
  return Object.keys(attrs)
    .reduce((el, name) => (
      void el.setAttribute(name, attrs[name] || ''),
      el)
    , el);
}
