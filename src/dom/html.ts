import { El, ElChildren } from './builder';

interface ElBuilder<T extends string, E extends Element> {
  (factory?: () => E): El<T, E, ElChildren.Void>;                                   <C extends ElChildren>
  (children: C, factory?: () => E): El<T, E, C>;
  (attrs: Record<string, string>, factory?: () => E): El<T, E, ElChildren.Void>;    <C extends ElChildren>
  (attrs: Record<string, string>, children: C, factory?: () => E): El<T, E, C>;
}

export const tags = {
  // HTMLElement
  "a": 0,
  "applet": 0,
  "area": 0,
  "audio": 0,
  "base": 0,
  "basefont": 0,
  "blockquote": 0,
  "body": 0,
  "br": 0,
  "button": 0,
  "canvas": 0,
  "caption": 0,
  "col": 0,
  "colgroup": 0,
  "data": 0,
  "datalist": 0,
  "del": 0,
  "dir": 0,
  "div": 0,
  "dl": 0,
  "embed": 0,
  "fieldset": 0,
  "font": 0,
  "form": 0,
  "frame": 0,
  "frameset": 0,
  "h1": 0,
  "h2": 0,
  "h3": 0,
  "h4": 0,
  "h5": 0,
  "h6": 0,
  "head": 0,
  "hr": 0,
  "html": 0,
  "iframe": 0,
  "img": 0,
  "input": 0,
  "ins": 0,
  "isindex": 0,
  "label": 0,
  "legend": 0,
  "li": 0,
  "link": 0,
  "listing": 0,
  "map": 0,
  "marquee": 0,
  "menu": 0,
  "meta": 0,
  "meter": 0,
  "nextid": 0,
  "object": 0,
  "ol": 0,
  "optgroup": 0,
  "option": 0,
  "output": 0,
  "p": 0,
  "param": 0,
  "picture": 0,
  "pre": 0,
  "progress": 0,
  "q": 0,
  "script": 0,
  "select": 0,
  "source": 0,
  "span": 0,
  "style": 0,
  "table": 0,
  "tbody": 0,
  "td": 0,
  "template": 0,
  "textarea": 0,
  "tfoot": 0,
  "th": 0,
  "thead": 0,
  "time": 0,
  "title": 0,
  "tr": 0,
  "track": 0,
  "ul": 0,
  "video": 0,
  "x-ms-webview": 0,
  "xmp": 0,
  // Element
  "abbr": 0,
  "acronym": 0,
  "address": 0,
  "article": 0,
  "aside": 0,
  "b": 0,
  "bdo": 0,
  "big": 0,
  "center": 0,
  "circle": 0,
  "cite": 0,
  "clippath": 0,
  "code": 0,
  "dd": 0,
  "defs": 0,
  "desc": 0,
  "dfn": 0,
  "dt": 0,
  "ellipse": 0,
  "em": 0,
  "feblend": 0,
  "fecolormatrix": 0,
  "fecomponenttransfer": 0,
  "fecomposite": 0,
  "feconvolvematrix": 0,
  "fediffuselighting": 0,
  "fedisplacementmap": 0,
  "fedistantlight": 0,
  "feflood": 0,
  "fefunca": 0,
  "fefuncb": 0,
  "fefuncg": 0,
  "fefuncr": 0,
  "fegaussianblur": 0,
  "feimage": 0,
  "femerge": 0,
  "femergenode": 0,
  "femorphology": 0,
  "feoffset": 0,
  "fepointlight": 0,
  "fespecularlighting": 0,
  "fespotlight": 0,
  "fetile": 0,
  "feturbulence": 0,
  "figcaption": 0,
  "figure": 0,
  "filter": 0,
  "footer": 0,
  "foreignobject": 0,
  "g": 0,
  "header": 0,
  "hgroup": 0,
  "i": 0,
  "image": 0,
  "kbd": 0,
  "keygen": 0,
  "line": 0,
  "lineargradient": 0,
  "mark": 0,
  "marker": 0,
  "mask": 0,
  "metadata": 0,
  "nav": 0,
  "nobr": 0,
  "noframes": 0,
  "noscript": 0,
  "path": 0,
  "pattern": 0,
  "plaintext": 0,
  "polygon": 0,
  "polyline": 0,
  "radialgradient": 0,
  "rect": 0,
  "rt": 0,
  "ruby": 0,
  "s": 0,
  "samp": 0,
  "section": 0,
  "small": 0,
  "stop": 0,
  "strike": 0,
  "strong": 0,
  "sub": 0,
  "sup": 0,
  "svg": 0,
  "switch": 0,
  "symbol": 0,
  "text": 0,
  "textpath": 0,
  "tspan": 0,
  "tt": 0,
  "u": 0,
  "use": 0,
  "var": 0,
  "view": 0,
  "wbr": 0,
};

export const TypedHTML: {
  readonly [K in keyof ElementTagNameMap]: ElBuilder<K, ElementTagNameMap[K]>;
} & {
  create: {                                                                                                                         <T extends keyof ElementTagNameMap>
    (tag: T, factory?: () => ElementTagNameMap[T]): El<T, ElementTagNameMap[T], ElChildren.Void>;                                   <T extends keyof ElementTagNameMap, C extends ElChildren = ElChildren>
    (tag: T, children: C, factory?: () => ElementTagNameMap[T]): El<T, ElementTagNameMap[T], C>;                                    <T extends keyof ElementTagNameMap>
    (tag: T, attrs: Record<string, string>, factory?: () => ElementTagNameMap[T]): El<T, ElementTagNameMap[T], ElChildren.Void>;    <T extends keyof ElementTagNameMap, C extends ElChildren = ElChildren>
    (tag: T, attrs: Record<string, string>, children: C, factory?: () => ElementTagNameMap[T]): El<T, ElementTagNameMap[T], C>;
  };
} =
  Object.keys(tags)
    .reduce((obj, tag) => (
      obj[tag] = builder(tag),
      obj
    ), {
      create: (tag: string, a: any = () => document.createElement(tag), b: any = () => document.createElement(tag), c: any = () => document.createElement(tag)) =>
        (TypedHTML[tag] = TypedHTML[tag] || builder(tag))(a, b, c),
    }) as any;

function builder<C extends ElChildren>(tag: string): (attrs?: Record<string, string>, children?: C, factory?: () => Element) => El<string, Element, C> {
  return function build(attrs?: Record<string, string>, children?: C, factory?: () => Element): El<string, Element, C> {
    if (typeof attrs === 'function') return build(undefined, undefined, attrs);
    if (typeof children === 'function') return build(attrs, undefined, children);
    if (attrs !== undefined && isChildren(attrs)) return build(undefined, attrs, factory);
    return new El(define(tag, factory || (() => document.createElement(tag)), attrs), children!);
  };

  function isChildren(children: any): children is C {
    return typeof children !== 'object'
        || Object.values(children).slice(-1).every(val => typeof val === 'object');
  }

  function define<E extends Element>(tag: string, factory: () => E, attrs?: Record<string, string>): E {
    const el = factory();
    if (tag !== el.tagName.toLowerCase()) throw new Error(`TypedDOM: Tag name must be "${tag}" but "${el.tagName.toLowerCase()}".`);
    if (!attrs) return el;
    void Object.keys(attrs)
      .forEach(name =>
        void el.setAttribute(name, attrs[name]));
    return el;
  }
}
