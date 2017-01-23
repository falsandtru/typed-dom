/**
*
* typed-dom.d.ts
*
* @author falsandtru https://github.com/falsandtru/typed-dom
*/

declare module 'typed-dom' {
  export default TypedHTML;

  export interface TypedHTMLElement<
    T extends string,
    E extends HTMLElement,
    C extends TypedHTMLElementChildren<HTMLElement>,
  > extends AbstractTypedHTMLElement<T> {
    readonly element: E;
    children: C;
  }
  export type TypedHTMLElementChildren<E extends HTMLElement>
    = string
    | TypedHTMLElement<string, E, any>[]
    | { [name: string]: TypedHTMLElement<string, E, any>; };
  abstract class AbstractTypedHTMLElement<E extends string> {
    private identifier: E;
  }

  interface TypedHTMLElementBuilder<E extends HTMLElement, T extends string> {
    (): TypedHTMLElement<T, E, never>;
    <C extends string>
    (children: C): TypedHTMLElement<T, E, C>;
    <C extends string>
    (children: C, factory?: () => E): never;
    <C extends TypedHTMLElementChildren<HTMLElement>>
    (children: C, factory?: () => E): TypedHTMLElement<T, E, C>;
    <C extends string>
    (attrs: { [name: string]: string; }, children: C, factory?: () => E): never;
    <C extends TypedHTMLElementChildren<HTMLElement>>
    (attrs: { [name: string]: string; }, children: C, factory?: () => E): TypedHTMLElement<T, E, C>;
  }

  const TypedHTML: {
    // lib.dom.d.ts
    //[K in keyof HTMLElementTagNameMap]: TypedHTMLBuilder<HTMLElementTagNameMap[K], K>;
    a: TypedHTMLElementBuilder<HTMLAnchorElement, 'a'>;
    abbr: TypedHTMLElementBuilder<HTMLElement, 'abbr'>;
    acronym: TypedHTMLElementBuilder<HTMLElement, 'acronym'>;
    address: TypedHTMLElementBuilder<HTMLElement, 'address'>;
    applet: TypedHTMLElementBuilder<HTMLAppletElement, 'applet'>;
    area: TypedHTMLElementBuilder<HTMLAreaElement, 'area'>;
    article: TypedHTMLElementBuilder<HTMLElement, 'article'>;
    aside: TypedHTMLElementBuilder<HTMLElement, 'aside'>;
    audio: TypedHTMLElementBuilder<HTMLAudioElement, 'audio'>;
    b: TypedHTMLElementBuilder<HTMLElement, 'b'>;
    base: TypedHTMLElementBuilder<HTMLBaseElement, 'base'>;
    basefont: TypedHTMLElementBuilder<HTMLBaseFontElement, 'basefont'>;
    bdo: TypedHTMLElementBuilder<HTMLElement, 'bdo'>;
    big: TypedHTMLElementBuilder<HTMLElement, 'big'>;
    blockquote: TypedHTMLElementBuilder<HTMLQuoteElement, 'blockquote'>;
    body: TypedHTMLElementBuilder<HTMLBodyElement, 'body'>;
    br: TypedHTMLElementBuilder<HTMLBRElement, 'br'>;
    button: TypedHTMLElementBuilder<HTMLButtonElement, 'button'>;
    canvas: TypedHTMLElementBuilder<HTMLCanvasElement, 'canvas'>;
    caption: TypedHTMLElementBuilder<HTMLTableCaptionElement, 'caption'>;
    center: TypedHTMLElementBuilder<HTMLElement, 'center'>;
    cite: TypedHTMLElementBuilder<HTMLElement, 'cite'>;
    code: TypedHTMLElementBuilder<HTMLElement, 'code'>;
    col: TypedHTMLElementBuilder<HTMLTableColElement, 'col'>;
    colgroup: TypedHTMLElementBuilder<HTMLTableColElement, 'colgroup'>;
    datalist: TypedHTMLElementBuilder<HTMLDataListElement, 'datalist'>;
    dd: TypedHTMLElementBuilder<HTMLElement, 'dd'>;
    del: TypedHTMLElementBuilder<HTMLModElement, 'del'>;
    dfn: TypedHTMLElementBuilder<HTMLElement, 'dfn'>;
    dir: TypedHTMLElementBuilder<HTMLDirectoryElement, 'dir'>;
    div: TypedHTMLElementBuilder<HTMLDivElement, 'div'>;
    dl: TypedHTMLElementBuilder<HTMLDListElement, 'dl'>;
    dt: TypedHTMLElementBuilder<HTMLElement, 'dt'>;
    em: TypedHTMLElementBuilder<HTMLElement, 'em'>;
    embed: TypedHTMLElementBuilder<HTMLEmbedElement, 'embed'>;
    fieldset: TypedHTMLElementBuilder<HTMLFieldSetElement, 'fieldset'>;
    figcaption: TypedHTMLElementBuilder<HTMLElement, 'figcaption'>;
    figure: TypedHTMLElementBuilder<HTMLElement, 'figure'>;
    font: TypedHTMLElementBuilder<HTMLFontElement, 'font'>;
    footer: TypedHTMLElementBuilder<HTMLElement, 'footer'>;
    form: TypedHTMLElementBuilder<HTMLFormElement, 'form'>;
    frame: TypedHTMLElementBuilder<HTMLFrameElement, 'frame'>;
    frameset: TypedHTMLElementBuilder<HTMLFrameSetElement, 'frameset'>;
    h1: TypedHTMLElementBuilder<HTMLHeadingElement, 'h1'>;
    h2: TypedHTMLElementBuilder<HTMLHeadingElement, 'h2'>;
    h3: TypedHTMLElementBuilder<HTMLHeadingElement, 'h3'>;
    h4: TypedHTMLElementBuilder<HTMLHeadingElement, 'h4'>;
    h5: TypedHTMLElementBuilder<HTMLHeadingElement, 'h5'>;
    h6: TypedHTMLElementBuilder<HTMLHeadingElement, 'h6'>;
    head: TypedHTMLElementBuilder<HTMLHeadElement, 'head'>;
    header: TypedHTMLElementBuilder<HTMLElement, 'header'>;
    hgroup: TypedHTMLElementBuilder<HTMLElement, 'hgroup'>;
    hr: TypedHTMLElementBuilder<HTMLHRElement, 'hr'>;
    html: TypedHTMLElementBuilder<HTMLHtmlElement, 'html'>;
    i: TypedHTMLElementBuilder<HTMLElement, 'i'>;
    iframe: TypedHTMLElementBuilder<HTMLIFrameElement, 'iframe'>;
    img: TypedHTMLElementBuilder<HTMLImageElement, 'img'>;
    input: TypedHTMLElementBuilder<HTMLInputElement, 'input'>;
    ins: TypedHTMLElementBuilder<HTMLModElement, 'ins'>;
    isindex: TypedHTMLElementBuilder<HTMLUnknownElement, 'isindex'>;
    kbd: TypedHTMLElementBuilder<HTMLElement, 'kbd'>;
    keygen: TypedHTMLElementBuilder<HTMLElement, 'keygen'>;
    label: TypedHTMLElementBuilder<HTMLLabelElement, 'label'>;
    legend: TypedHTMLElementBuilder<HTMLLegendElement, 'legend'>;
    li: TypedHTMLElementBuilder<HTMLLIElement, 'li'>;
    link: TypedHTMLElementBuilder<HTMLLinkElement, 'link'>;
    listing: TypedHTMLElementBuilder<HTMLPreElement, 'listing'>;
    map: TypedHTMLElementBuilder<HTMLMapElement, 'map'>;
    mark: TypedHTMLElementBuilder<HTMLElement, 'mark'>;
    marquee: TypedHTMLElementBuilder<HTMLMarqueeElement, 'marquee'>;
    menu: TypedHTMLElementBuilder<HTMLMenuElement, 'menu'>;
    meta: TypedHTMLElementBuilder<HTMLMetaElement, 'meta'>;
    meter: TypedHTMLElementBuilder<HTMLMeterElement, 'meter'>;
    nav: TypedHTMLElementBuilder<HTMLElement, 'nav'>;
    nextid: TypedHTMLElementBuilder<HTMLUnknownElement, 'nextid'>;
    nobr: TypedHTMLElementBuilder<HTMLElement, 'nobr'>;
    noframes: TypedHTMLElementBuilder<HTMLElement, 'noframes'>;
    noscript: TypedHTMLElementBuilder<HTMLElement, 'noscript'>;
    object: TypedHTMLElementBuilder<HTMLObjectElement, 'object'>;
    ol: TypedHTMLElementBuilder<HTMLOListElement, 'ol'>;
    optgroup: TypedHTMLElementBuilder<HTMLOptGroupElement, 'optgroup'>;
    option: TypedHTMLElementBuilder<HTMLOptionElement, 'option'>;
    p: TypedHTMLElementBuilder<HTMLParagraphElement, 'p'>;
    param: TypedHTMLElementBuilder<HTMLParamElement, 'param'>;
    picture: TypedHTMLElementBuilder<HTMLPictureElement, 'picture'>;
    plaintext: TypedHTMLElementBuilder<HTMLElement, 'plaintext'>;
    pre: TypedHTMLElementBuilder<HTMLPreElement, 'pre'>;
    progress: TypedHTMLElementBuilder<HTMLProgressElement, 'progress'>;
    q: TypedHTMLElementBuilder<HTMLQuoteElement, 'q'>;
    rt: TypedHTMLElementBuilder<HTMLElement, 'rt'>;
    ruby: TypedHTMLElementBuilder<HTMLElement, 'ruby'>;
    s: TypedHTMLElementBuilder<HTMLElement, 's'>;
    samp: TypedHTMLElementBuilder<HTMLElement, 'samp'>;
    script: TypedHTMLElementBuilder<HTMLScriptElement, 'script'>;
    section: TypedHTMLElementBuilder<HTMLElement, 'section'>;
    select: TypedHTMLElementBuilder<HTMLSelectElement, 'select'>;
    small: TypedHTMLElementBuilder<HTMLElement, 'small'>;
    source: TypedHTMLElementBuilder<HTMLSourceElement, 'source'>;
    span: TypedHTMLElementBuilder<HTMLSpanElement, 'span'>;
    strike: TypedHTMLElementBuilder<HTMLElement, 'strike'>;
    strong: TypedHTMLElementBuilder<HTMLElement, 'strong'>;
    style: TypedHTMLElementBuilder<HTMLStyleElement, 'style'>;
    sub: TypedHTMLElementBuilder<HTMLElement, 'sub'>;
    sup: TypedHTMLElementBuilder<HTMLElement, 'sup'>;
    table: TypedHTMLElementBuilder<HTMLTableElement, 'table'>;
    tbody: TypedHTMLElementBuilder<HTMLTableSectionElement, 'tbody'>;
    td: TypedHTMLElementBuilder<HTMLTableDataCellElement, 'td'>;
    template: TypedHTMLElementBuilder<HTMLTemplateElement, 'template'>;
    textarea: TypedHTMLElementBuilder<HTMLTextAreaElement, 'textarea'>;
    tfoot: TypedHTMLElementBuilder<HTMLTableSectionElement, 'tfoot'>;
    th: TypedHTMLElementBuilder<HTMLTableHeaderCellElement, 'th'>;
    thead: TypedHTMLElementBuilder<HTMLTableSectionElement, 'thead'>;
    title: TypedHTMLElementBuilder<HTMLTitleElement, 'title'>;
    tr: TypedHTMLElementBuilder<HTMLTableRowElement, 'tr'>;
    track: TypedHTMLElementBuilder<HTMLTrackElement, 'track'>;
    tt: TypedHTMLElementBuilder<HTMLElement, 'tt'>;
    u: TypedHTMLElementBuilder<HTMLElement, 'u'>;
    ul: TypedHTMLElementBuilder<HTMLUListElement, 'ul'>;
    var: TypedHTMLElementBuilder<HTMLElement, 'var'>;
    video: TypedHTMLElementBuilder<HTMLVideoElement, 'video'>;
    wbr: TypedHTMLElementBuilder<HTMLElement, 'wbr'>;
    xmp: TypedHTMLElementBuilder<HTMLPreElement, 'xmp'>;
    // custom
    custom<E extends HTMLElement, T extends string, C extends TypedHTMLElementChildren<HTMLElement>>(children: C, factory: () => E, tag: T): TypedHTMLElement<T, E, C>;
  };
}
