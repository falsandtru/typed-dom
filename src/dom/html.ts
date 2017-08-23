import { El, ElChildren } from './builder';

interface ElBuilder<T extends string, E extends HTMLElement = HTMLElement> {
  (factory?: () => E): El<T, E, void>;                                                <C extends ElChildren>
  (children: C, factory?: () => E): El<T, E, C>;
  (attrs: { [name: string]: string; }, factory?: () => E): El<T, E, void>;            <C extends ElChildren>
  (attrs: { [name: string]: string; }, children: C, factory?: () => E): El<T, E, C>;
}

export const TypedHTML: {
  // lib.dom.d.ts
  [K in keyof HTMLElementTagNameMap]: ElBuilder<K, HTMLElementTagNameMap[K]>;
} & {
  // other
  abbr: ElBuilder<'abbr'>;
  acronym: ElBuilder<'acronym'>;
  address: ElBuilder<'address'>;
  article: ElBuilder<'article'>;
  aside: ElBuilder<'aside'>;
  b: ElBuilder<'b'>;
  bdo: ElBuilder<'bdo'>;
  big: ElBuilder<'big'>;
  center: ElBuilder<'center'>;
  cite: ElBuilder<'cite'>;
  code: ElBuilder<'code'>;
  dd: ElBuilder<'dd'>;
  dfn: ElBuilder<'dfn'>;
  dt: ElBuilder<'dt'>;
  em: ElBuilder<'em'>;
  figcaption: ElBuilder<'figcaption'>;
  figure: ElBuilder<'figure'>;
  footer: ElBuilder<'footer'>;
  header: ElBuilder<'header'>;
  hgroup: ElBuilder<'hgroup'>;
  i: ElBuilder<'i'>;
  kbd: ElBuilder<'kbd'>;
  keygen: ElBuilder<'keygen'>;
  mark: ElBuilder<'mark'>;
  nav: ElBuilder<'nav'>;
  nobr: ElBuilder<'nobr'>;
  noframes: ElBuilder<'noframes'>;
  noscript: ElBuilder<'noscript'>;
  plaintext: ElBuilder<'plaintext'>;
  rt: ElBuilder<'rt'>;
  ruby: ElBuilder<'ruby'>;
  s: ElBuilder<'s'>;
  samp: ElBuilder<'samp'>;
  section: ElBuilder<'section'>;
  small: ElBuilder<'small'>;
  strike: ElBuilder<'strike'>;
  strong: ElBuilder<'strong'>;
  sub: ElBuilder<'sub'>;
  sup: ElBuilder<'sup'>;
  tt: ElBuilder<'tt'>;
  u: ElBuilder<'u'>;
  var: ElBuilder<'var'>;
  wbr: ElBuilder<'wbr'>;

  // create
  create: {                                                                                                                                   <T extends keyof HTMLElementTagNameMap>
    (tag: T, factory?: () => HTMLElementTagNameMap[T]): El<T, HTMLElementTagNameMap[T], void>;                                                <T extends keyof HTMLElementTagNameMap, C extends ElChildren = ElChildren>
    (tag: T, children: C, factory?: () => HTMLElementTagNameMap[T]): El<T, HTMLElementTagNameMap[T], C>;                                      <T extends keyof HTMLElementTagNameMap>
    (tag: T, attrs: { [name: string]: string; }, factory?: () => HTMLElementTagNameMap[T]): El<T, HTMLElementTagNameMap[T], void>;            <T extends keyof HTMLElementTagNameMap, C extends ElChildren = ElChildren>
    (tag: T, attrs: { [name: string]: string; }, children: C, factory?: () => HTMLElementTagNameMap[T]): El<T, HTMLElementTagNameMap[T], C>;
                                                                                                                                              <T extends string, E extends HTMLElement = HTMLElement>
    (tag: T, factory?: () => E): El<T, E, void>;                                                                                              <T extends string, E extends HTMLElement = HTMLElement, C extends ElChildren = ElChildren>
    (tag: T, children: C, factory?: () => E): El<T, E, C>;                                                                                    <T extends string, E extends HTMLElement = HTMLElement>
    (tag: T, attrs: { [name: string]: string; }, factory?: () => E): El<T, E, void>;                                                          <T extends string, E extends HTMLElement = HTMLElement, C extends ElChildren = ElChildren>
    (tag: T, attrs: { [name: string]: string; }, children: C, factory?: () => E): El<T, E, C>;
  };
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
  // create
  'create',
  'any',
]
  .reduce((obj, prop) => (
    obj[prop] = prop === 'create'
      ? (tag: string, b: any = () => document.createElement(tag), c: any = () => document.createElement(tag), d: any = () => document.createElement(tag)) =>
          TypedHTML['any'](b, c, d, tag)
      : <C extends ElChildren>
        (attrs?: { [name: string]: string; }, children?: C, factory?: () => HTMLElement, tag = prop)
        : El<string, HTMLElement, C> => {
          tag = prop === 'any' ? tag : prop;
          switch (typeof attrs) {
            case 'undefined':
              return new El(define(tag, () => document.createElement(tag)), void 0 as never);
            case 'function':
              return new El(define(tag, attrs as any), void 0 as never);
            case 'string':
              return new El(define(tag, children as any || (() => document.createElement(tag))), attrs as never);
            case 'object':
              factory = typeof children === 'function'
                ? children
                : factory || (() => document.createElement(tag));
              return Object.keys(attrs!).slice(-1).every(key => key === void 0 || typeof attrs![key] === 'object')
                ? new El(define(tag, factory), attrs as any)
                : new El(define(tag, factory, attrs!), children as any === factory ? void 0 : children)
            default:
              throw new TypeError(`Invalid arguments: [${attrs}, ${children}, ${factory}]`);
          }
        },
    obj
  ), {} as any);

function define<E extends HTMLElement>(tag: string, factory: () => E, attrs?: { [name: string]: string }): E {
  const el = factory();
  if (tag !== el.tagName && tag !== el.tagName.toLowerCase()) throw new Error(`Tag name must be "${tag}" but "${el.tagName.toLowerCase()}".`);
  if (!attrs) return el;
  return Object.keys(attrs)
    .reduce((el, name) => (
      void el.setAttribute(name, attrs[name] || ''),
      el)
    , el);
}
