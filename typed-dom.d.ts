/**
*
* typed-dom.d.ts
*
* @author falsandtru https://github.com/falsandtru/typed-dom
*/

declare module 'typed-dom' {
  class HTML<T extends string> {
    private TAG: T;
  }
  export interface TypedHTML<S extends string, T extends HTMLElement, U extends TypedHTMLChildren<HTMLElement>> extends HTML<S> {
    element: T;
    children: U;
  }
  export type TypedHTMLChildren<T extends HTMLElement>
    = string
    | TypedHTML<string, T, any>[]
    | { [name: string]: TypedHTML<string, T, any>; };
  interface TypedHTMLBuilder<T extends HTMLElement, S extends string> {
    (): TypedHTML<S, T, never>;
    <U extends string>(children: U): TypedHTML<S, T, U>;
    <U extends string>(children: U, factory?: () => T): never;
    <U extends TypedHTMLChildren<HTMLElement>>(children: U, factory?: () => T): TypedHTML<S, T, U>;
    <U extends string>(attrs: { [name: string]: string; }, children: U, factory?: () => T): never;
    <U extends TypedHTMLChildren<HTMLElement>>(attrs: { [name: string]: string; }, children: U, factory?: () => T): TypedHTML<S, T, U>;
  }

  const TypedHTML: {
    // lib.dom.d.ts
    //[K in keyof HTMLElementTagNameMap]: TypedHTMLBuilder<HTMLElementTagNameMap[K], K>;
    a: TypedHTMLBuilder<HTMLAnchorElement, 'a'>;
    abbr: TypedHTMLBuilder<HTMLElement, 'abbr'>;
    acronym: TypedHTMLBuilder<HTMLElement, 'acronym'>;
    address: TypedHTMLBuilder<HTMLElement, 'address'>;
    applet: TypedHTMLBuilder<HTMLAppletElement, 'applet'>;
    area: TypedHTMLBuilder<HTMLAreaElement, 'area'>;
    article: TypedHTMLBuilder<HTMLElement, 'article'>;
    aside: TypedHTMLBuilder<HTMLElement, 'aside'>;
    audio: TypedHTMLBuilder<HTMLAudioElement, 'audio'>;
    b: TypedHTMLBuilder<HTMLElement, 'b'>;
    base: TypedHTMLBuilder<HTMLBaseElement, 'base'>;
    basefont: TypedHTMLBuilder<HTMLBaseFontElement, 'basefont'>;
    bdo: TypedHTMLBuilder<HTMLElement, 'bdo'>;
    big: TypedHTMLBuilder<HTMLElement, 'big'>;
    blockquote: TypedHTMLBuilder<HTMLQuoteElement, 'blockquote'>;
    body: TypedHTMLBuilder<HTMLBodyElement, 'body'>;
    br: TypedHTMLBuilder<HTMLBRElement, 'br'>;
    button: TypedHTMLBuilder<HTMLButtonElement, 'button'>;
    canvas: TypedHTMLBuilder<HTMLCanvasElement, 'canvas'>;
    caption: TypedHTMLBuilder<HTMLTableCaptionElement, 'caption'>;
    center: TypedHTMLBuilder<HTMLElement, 'center'>;
    cite: TypedHTMLBuilder<HTMLElement, 'cite'>;
    code: TypedHTMLBuilder<HTMLElement, 'code'>;
    col: TypedHTMLBuilder<HTMLTableColElement, 'col'>;
    colgroup: TypedHTMLBuilder<HTMLTableColElement, 'colgroup'>;
    datalist: TypedHTMLBuilder<HTMLDataListElement, 'datalist'>;
    dd: TypedHTMLBuilder<HTMLElement, 'dd'>;
    del: TypedHTMLBuilder<HTMLModElement, 'del'>;
    dfn: TypedHTMLBuilder<HTMLElement, 'dfn'>;
    dir: TypedHTMLBuilder<HTMLDirectoryElement, 'dir'>;
    div: TypedHTMLBuilder<HTMLDivElement, 'div'>;
    dl: TypedHTMLBuilder<HTMLDListElement, 'dl'>;
    dt: TypedHTMLBuilder<HTMLElement, 'dt'>;
    em: TypedHTMLBuilder<HTMLElement, 'em'>;
    embed: TypedHTMLBuilder<HTMLEmbedElement, 'embed'>;
    fieldset: TypedHTMLBuilder<HTMLFieldSetElement, 'fieldset'>;
    figcaption: TypedHTMLBuilder<HTMLElement, 'figcaption'>;
    figure: TypedHTMLBuilder<HTMLElement, 'figure'>;
    font: TypedHTMLBuilder<HTMLFontElement, 'font'>;
    footer: TypedHTMLBuilder<HTMLElement, 'footer'>;
    form: TypedHTMLBuilder<HTMLFormElement, 'form'>;
    frame: TypedHTMLBuilder<HTMLFrameElement, 'frame'>;
    frameset: TypedHTMLBuilder<HTMLFrameSetElement, 'frameset'>;
    h1: TypedHTMLBuilder<HTMLHeadingElement, 'h1'>;
    h2: TypedHTMLBuilder<HTMLHeadingElement, 'h2'>;
    h3: TypedHTMLBuilder<HTMLHeadingElement, 'h3'>;
    h4: TypedHTMLBuilder<HTMLHeadingElement, 'h4'>;
    h5: TypedHTMLBuilder<HTMLHeadingElement, 'h5'>;
    h6: TypedHTMLBuilder<HTMLHeadingElement, 'h6'>;
    head: TypedHTMLBuilder<HTMLHeadElement, 'head'>;
    header: TypedHTMLBuilder<HTMLElement, 'header'>;
    hgroup: TypedHTMLBuilder<HTMLElement, 'hgroup'>;
    hr: TypedHTMLBuilder<HTMLHRElement, 'hr'>;
    html: TypedHTMLBuilder<HTMLHtmlElement, 'html'>;
    i: TypedHTMLBuilder<HTMLElement, 'i'>;
    iframe: TypedHTMLBuilder<HTMLIFrameElement, 'iframe'>;
    img: TypedHTMLBuilder<HTMLImageElement, 'img'>;
    input: TypedHTMLBuilder<HTMLInputElement, 'input'>;
    ins: TypedHTMLBuilder<HTMLModElement, 'ins'>;
    isindex: TypedHTMLBuilder<HTMLUnknownElement, 'isindex'>;
    kbd: TypedHTMLBuilder<HTMLElement, 'kbd'>;
    keygen: TypedHTMLBuilder<HTMLElement, 'keygen'>;
    label: TypedHTMLBuilder<HTMLLabelElement, 'label'>;
    legend: TypedHTMLBuilder<HTMLLegendElement, 'legend'>;
    li: TypedHTMLBuilder<HTMLLIElement, 'li'>;
    link: TypedHTMLBuilder<HTMLLinkElement, 'link'>;
    listing: TypedHTMLBuilder<HTMLPreElement, 'listing'>;
    map: TypedHTMLBuilder<HTMLMapElement, 'map'>;
    mark: TypedHTMLBuilder<HTMLElement, 'mark'>;
    marquee: TypedHTMLBuilder<HTMLMarqueeElement, 'marquee'>;
    menu: TypedHTMLBuilder<HTMLMenuElement, 'menu'>;
    meta: TypedHTMLBuilder<HTMLMetaElement, 'meta'>;
    meter: TypedHTMLBuilder<HTMLMeterElement, 'meter'>;
    nav: TypedHTMLBuilder<HTMLElement, 'nav'>;
    nextid: TypedHTMLBuilder<HTMLUnknownElement, 'nextid'>;
    nobr: TypedHTMLBuilder<HTMLElement, 'nobr'>;
    noframes: TypedHTMLBuilder<HTMLElement, 'noframes'>;
    noscript: TypedHTMLBuilder<HTMLElement, 'noscript'>;
    object: TypedHTMLBuilder<HTMLObjectElement, 'object'>;
    ol: TypedHTMLBuilder<HTMLOListElement, 'ol'>;
    optgroup: TypedHTMLBuilder<HTMLOptGroupElement, 'optgroup'>;
    option: TypedHTMLBuilder<HTMLOptionElement, 'option'>;
    p: TypedHTMLBuilder<HTMLParagraphElement, 'p'>;
    param: TypedHTMLBuilder<HTMLParamElement, 'param'>;
    picture: TypedHTMLBuilder<HTMLPictureElement, 'picture'>;
    plaintext: TypedHTMLBuilder<HTMLElement, 'plaintext'>;
    pre: TypedHTMLBuilder<HTMLPreElement, 'pre'>;
    progress: TypedHTMLBuilder<HTMLProgressElement, 'progress'>;
    q: TypedHTMLBuilder<HTMLQuoteElement, 'q'>;
    rt: TypedHTMLBuilder<HTMLElement, 'rt'>;
    ruby: TypedHTMLBuilder<HTMLElement, 'ruby'>;
    s: TypedHTMLBuilder<HTMLElement, 's'>;
    samp: TypedHTMLBuilder<HTMLElement, 'samp'>;
    script: TypedHTMLBuilder<HTMLScriptElement, 'script'>;
    section: TypedHTMLBuilder<HTMLElement, 'section'>;
    select: TypedHTMLBuilder<HTMLSelectElement, 'select'>;
    small: TypedHTMLBuilder<HTMLElement, 'small'>;
    source: TypedHTMLBuilder<HTMLSourceElement, 'source'>;
    span: TypedHTMLBuilder<HTMLSpanElement, 'span'>;
    strike: TypedHTMLBuilder<HTMLElement, 'strike'>;
    strong: TypedHTMLBuilder<HTMLElement, 'strong'>;
    style: TypedHTMLBuilder<HTMLStyleElement, 'style'>;
    sub: TypedHTMLBuilder<HTMLElement, 'sub'>;
    sup: TypedHTMLBuilder<HTMLElement, 'sup'>;
    table: TypedHTMLBuilder<HTMLTableElement, 'table'>;
    tbody: TypedHTMLBuilder<HTMLTableSectionElement, 'tbody'>;
    td: TypedHTMLBuilder<HTMLTableDataCellElement, 'td'>;
    template: TypedHTMLBuilder<HTMLTemplateElement, 'template'>;
    textarea: TypedHTMLBuilder<HTMLTextAreaElement, 'textarea'>;
    tfoot: TypedHTMLBuilder<HTMLTableSectionElement, 'tfoot'>;
    th: TypedHTMLBuilder<HTMLTableHeaderCellElement, 'th'>;
    thead: TypedHTMLBuilder<HTMLTableSectionElement, 'thead'>;
    title: TypedHTMLBuilder<HTMLTitleElement, 'title'>;
    tr: TypedHTMLBuilder<HTMLTableRowElement, 'tr'>;
    track: TypedHTMLBuilder<HTMLTrackElement, 'track'>;
    tt: TypedHTMLBuilder<HTMLElement, 'tt'>;
    u: TypedHTMLBuilder<HTMLElement, 'u'>;
    ul: TypedHTMLBuilder<HTMLUListElement, 'ul'>;
    var: TypedHTMLBuilder<HTMLElement, 'var'>;
    video: TypedHTMLBuilder<HTMLVideoElement, 'video'>;
    wbr: TypedHTMLBuilder<HTMLElement, 'wbr'>;
    xmp: TypedHTMLBuilder<HTMLPreElement, 'xmp'>;
    // custom
    custom<T extends TypedHTMLChildren<HTMLElement>, U extends HTMLElement, V extends string>(children: T, factory: () => U, identity: V): TypedHTML<V, U, T>;
  };
  export default TypedHTML;
}
