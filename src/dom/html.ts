import { El, ElChildren } from './builder';

interface ElBuilder<T extends string, E extends Element> {
  (factory?: () => E): El<T, E, undefined>;                                           <C extends ElChildren>
  (children: C, factory?: () => E): El<T, E, C>;
  (attrs: { [name: string]: string; }, factory?: () => E): El<T, E, undefined>;       <C extends ElChildren>
  (attrs: { [name: string]: string; }, children: C, factory?: () => E): El<T, E, C>;
}

export const TypedHTML: {
  [K in keyof HTMLElementTagNameMap]: ElBuilder<K, HTMLElementTagNameMap[K]>;
} & {
  [K in keyof ElementTagNameMap]: ElBuilder<K, ElementTagNameMap[K]>;
} & {
  create: {                                                                                                                                   <T extends keyof HTMLElementTagNameMap>
    (tag: T, factory?: () => HTMLElementTagNameMap[T]): El<T, HTMLElementTagNameMap[T], undefined>;                                           <T extends keyof HTMLElementTagNameMap, C extends ElChildren = ElChildren>
    (tag: T, children: C, factory?: () => HTMLElementTagNameMap[T]): El<T, HTMLElementTagNameMap[T], C>;                                      <T extends keyof HTMLElementTagNameMap>
    (tag: T, attrs: { [name: string]: string; }, factory?: () => HTMLElementTagNameMap[T]): El<T, HTMLElementTagNameMap[T], undefined>;       <T extends keyof HTMLElementTagNameMap, C extends ElChildren = ElChildren>
    (tag: T, attrs: { [name: string]: string; }, children: C, factory?: () => HTMLElementTagNameMap[T]): El<T, HTMLElementTagNameMap[T], C>;
                                                                                                                                              <T extends string, E extends HTMLElement = HTMLElement>
    (tag: T, factory?: () => E): El<T, E, undefined>;                                                                                         <T extends string, E extends HTMLElement = HTMLElement, C extends ElChildren = ElChildren>
    (tag: T, children: C, factory?: () => E): El<T, E, C>;                                                                                    <T extends string, E extends HTMLElement = HTMLElement>
    (tag: T, attrs: { [name: string]: string; }, factory?: () => E): El<T, E, undefined>;                                                     <T extends string, E extends HTMLElement = HTMLElement, C extends ElChildren = ElChildren>
    (tag: T, attrs: { [name: string]: string; }, children: C, factory?: () => E): El<T, E, C>;
  };
} = [
  // HTMLElement
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
  // Element
  "abbr",
  "acronym",
  "address",
  "article",
  "aside",
  "b",
  "bdo",
  "big",
  "center",
  "circle",
  "cite",
  "clippath",
  "code",
  "dd",
  "defs",
  "desc",
  "dfn",
  "dt",
  "ellipse",
  "em",
  "feblend",
  "fecolormatrix",
  "fecomponenttransfer",
  "fecomposite",
  "feconvolvematrix",
  "fediffuselighting",
  "fedisplacementmap",
  "fedistantlight",
  "feflood",
  "fefunca",
  "fefuncb",
  "fefuncg",
  "fefuncr",
  "fegaussianblur",
  "feimage",
  "femerge",
  "femergenode",
  "femorphology",
  "feoffset",
  "fepointlight",
  "fespecularlighting",
  "fespotlight",
  "fetile",
  "feturbulence",
  "figcaption",
  "figure",
  "filter",
  "footer",
  "foreignobject",
  "g",
  "header",
  "hgroup",
  "i",
  "image",
  "kbd",
  "keygen",
  "line",
  "lineargradient",
  "mark",
  "marker",
  "mask",
  "metadata",
  "nav",
  "nobr",
  "noframes",
  "noscript",
  "path",
  "pattern",
  "plaintext",
  "polygon",
  "polyline",
  "radialgradient",
  "rect",
  "rt",
  "ruby",
  "s",
  "samp",
  "section",
  "small",
  "stop",
  "strike",
  "strong",
  "sub",
  "sup",
  "svg",
  "switch",
  "symbol",
  "text",
  "textpath",
  "tspan",
  "tt",
  "u",
  "use",
  "var",
  "view",
  "wbr",
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
              throw new TypeError(`TypedDOM: Invalid arguments: [${attrs}, ${children}, ${factory}]`);
          }
        },
    obj
  ), {} as any);

function define<E extends HTMLElement>(tag: string, factory: () => E, attrs?: { [name: string]: string; }): E {
  const el = factory();
  if (tag !== el.tagName.toLowerCase()) throw new Error(`TypedDOM: Tag name must be "${tag}" but "${el.tagName.toLowerCase()}".`);
  if (!attrs) return el;
  void Object.keys(attrs)
    .forEach(name =>
      void el.setAttribute(name, attrs[name]));
  return el;
}
