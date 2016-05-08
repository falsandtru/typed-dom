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
  export interface TypedHTML<S extends string, T extends HTMLElement, U extends TypedHTMLContents<HTMLElement>> extends HTML<S> {
    raw: T;
    contents: U;
  }
  export type TypedHTMLContents<T extends HTMLElement> = void[] | TypedHTML<string, T, any>[] | { [name: string]: TypedHTML<string, T, any>; };
  interface TypedHTMLBuilder<T extends HTMLElement, S extends string> {
    (): TypedHTML<S, T, void[]>;
    <U extends TypedHTMLContents<HTMLElement>>(contents: U, factory?: () => T): TypedHTML<S, T, U>;
  }

  const TypedHTML: {
    // lib.d.ts
    a: TypedHTMLBuilder<HTMLAnchorElement, 'a'>;
    abbr: TypedHTMLBuilder<HTMLPhraseElement, 'abbr'>;
    acronym: TypedHTMLBuilder<HTMLPhraseElement, 'acronym'>;
    address: TypedHTMLBuilder<HTMLBlockElement, 'address'>;
    applet: TypedHTMLBuilder<HTMLAppletElement, 'applet'>;
    area: TypedHTMLBuilder<HTMLAreaElement, 'area'>;
    audio: TypedHTMLBuilder<HTMLAudioElement, 'audio'>;
    b: TypedHTMLBuilder<HTMLPhraseElement, 'b'>;
    base: TypedHTMLBuilder<HTMLBaseElement, 'base'>;
    basefont: TypedHTMLBuilder<HTMLBaseFontElement, 'basefont'>;
    bdo: TypedHTMLBuilder<HTMLPhraseElement, 'bdo'>;
    big: TypedHTMLBuilder<HTMLPhraseElement, 'big'>;
    blockquote: TypedHTMLBuilder<HTMLBlockElement, 'blockquote'>;
    body: TypedHTMLBuilder<HTMLBodyElement, 'body'>;
    br: TypedHTMLBuilder<HTMLBRElement, 'br'>;
    button: TypedHTMLBuilder<HTMLButtonElement, 'button'>;
    canvas: TypedHTMLBuilder<HTMLCanvasElement, 'canvas'>;
    caption: TypedHTMLBuilder<HTMLTableCaptionElement, 'caption'>;
    center: TypedHTMLBuilder<HTMLBlockElement, 'center'>;
    cite: TypedHTMLBuilder<HTMLPhraseElement, 'cite'>;
    code: TypedHTMLBuilder<HTMLPhraseElement, 'code'>;
    col: TypedHTMLBuilder<HTMLTableColElement, 'col'>;
    colgroup: TypedHTMLBuilder<HTMLTableColElement, 'colgroup'>;
    datalist: TypedHTMLBuilder<HTMLDataListElement, 'datalist'>;
    dd: TypedHTMLBuilder<HTMLDDElement, 'dd'>;
    del: TypedHTMLBuilder<HTMLModElement, 'del'>;
    dfn: TypedHTMLBuilder<HTMLPhraseElement, 'dfn'>;
    dir: TypedHTMLBuilder<HTMLDirectoryElement, 'dir'>;
    div: TypedHTMLBuilder<HTMLDivElement, 'div'>;
    dl: TypedHTMLBuilder<HTMLDListElement, 'dl'>;
    dt: TypedHTMLBuilder<HTMLDTElement, 'dt'>;
    em: TypedHTMLBuilder<HTMLPhraseElement, 'em'>;
    embed: TypedHTMLBuilder<HTMLEmbedElement, 'embed'>;
    fieldset: TypedHTMLBuilder<HTMLFieldSetElement, 'fieldset'>;
    font: TypedHTMLBuilder<HTMLFontElement, 'font'>;
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
    hr: TypedHTMLBuilder<HTMLHRElement, 'hr'>;
    html: TypedHTMLBuilder<HTMLHtmlElement, 'html'>;
    i: TypedHTMLBuilder<HTMLPhraseElement, 'i'>;
    iframe: TypedHTMLBuilder<HTMLIFrameElement, 'iframe'>;
    img: TypedHTMLBuilder<HTMLImageElement, 'img'>;
    input: TypedHTMLBuilder<HTMLInputElement, 'input'>;
    ins: TypedHTMLBuilder<HTMLModElement, 'ins'>;
    isindex: TypedHTMLBuilder<HTMLIsIndexElement, 'isindex'>;
    kbd: TypedHTMLBuilder<HTMLPhraseElement, 'kbd'>;
    keygen: TypedHTMLBuilder<HTMLBlockElement, 'keygen'>;
    label: TypedHTMLBuilder<HTMLLabelElement, 'label'>;
    legend: TypedHTMLBuilder<HTMLLegendElement, 'legend'>;
    li: TypedHTMLBuilder<HTMLLIElement, 'li'>;
    link: TypedHTMLBuilder<HTMLLinkElement, 'link'>;
    listing: TypedHTMLBuilder<HTMLBlockElement, 'listing'>;
    map: TypedHTMLBuilder<HTMLMapElement, 'map'>;
    marquee: TypedHTMLBuilder<HTMLMarqueeElement, 'marquee'>;
    menu: TypedHTMLBuilder<HTMLMenuElement, 'menu'>;
    meta: TypedHTMLBuilder<HTMLMetaElement, 'meta'>;
    nextid: TypedHTMLBuilder<HTMLNextIdElement, 'nextid'>;
    nobr: TypedHTMLBuilder<HTMLPhraseElement, 'nobr'>;
    object: TypedHTMLBuilder<HTMLObjectElement, 'object'>;
    ol: TypedHTMLBuilder<HTMLOListElement, 'ol'>;
    optgroup: TypedHTMLBuilder<HTMLOptGroupElement, 'optgroup'>;
    option: TypedHTMLBuilder<HTMLOptionElement, 'option'>;
    p: TypedHTMLBuilder<HTMLParagraphElement, 'p'>;
    param: TypedHTMLBuilder<HTMLParamElement, 'param'>;
    picture: TypedHTMLBuilder<HTMLPictureElement, 'picture'>;
    plaintext: TypedHTMLBuilder<HTMLBlockElement, 'plaintext'>;
    pre: TypedHTMLBuilder<HTMLPreElement, 'pre'>;
    progress: TypedHTMLBuilder<HTMLProgressElement, 'progress'>;
    q: TypedHTMLBuilder<HTMLQuoteElement, 'q'>;
    rt: TypedHTMLBuilder<HTMLPhraseElement, 'rt'>;
    ruby: TypedHTMLBuilder<HTMLPhraseElement, 'ruby'>;
    s: TypedHTMLBuilder<HTMLPhraseElement, 's'>;
    samp: TypedHTMLBuilder<HTMLPhraseElement, 'samp'>;
    script: TypedHTMLBuilder<HTMLScriptElement, 'script'>;
    select: TypedHTMLBuilder<HTMLSelectElement, 'select'>;
    small: TypedHTMLBuilder<HTMLPhraseElement, 'small'>;
    source: TypedHTMLBuilder<HTMLSourceElement, 'source'>;
    span: TypedHTMLBuilder<HTMLSpanElement, 'span'>;
    strike: TypedHTMLBuilder<HTMLPhraseElement, 'strike'>;
    strong: TypedHTMLBuilder<HTMLPhraseElement, 'strong'>;
    style: TypedHTMLBuilder<HTMLStyleElement, 'style'>;
    sub: TypedHTMLBuilder<HTMLPhraseElement, 'sub'>;
    sup: TypedHTMLBuilder<HTMLPhraseElement, 'sup'>;
    table: TypedHTMLBuilder<HTMLTableElement, 'table'>;
    tbody: TypedHTMLBuilder<HTMLTableSectionElement, 'tbody'>;
    td: TypedHTMLBuilder<HTMLTableDataCellElement, 'td'>;
    textarea: TypedHTMLBuilder<HTMLTextAreaElement, 'textarea'>;
    tfoot: TypedHTMLBuilder<HTMLTableSectionElement, 'tfoot'>;
    th: TypedHTMLBuilder<HTMLTableHeaderCellElement, 'th'>;
    thead: TypedHTMLBuilder<HTMLTableSectionElement, 'thead'>;
    title: TypedHTMLBuilder<HTMLTitleElement, 'title'>;
    tr: TypedHTMLBuilder<HTMLTableRowElement, 'tr'>;
    track: TypedHTMLBuilder<HTMLTrackElement, 'track'>;
    tt: TypedHTMLBuilder<HTMLPhraseElement, 'tt'>;
    u: TypedHTMLBuilder<HTMLPhraseElement, 'u'>;
    ul: TypedHTMLBuilder<HTMLUListElement, 'ul'>;
    var: TypedHTMLBuilder<HTMLPhraseElement, 'var'>;
    video: TypedHTMLBuilder<HTMLVideoElement, 'video'>;
    xmp: TypedHTMLBuilder<HTMLBlockElement, 'xmp'>;
    // sectioning contents
    article: TypedHTMLBuilder<HTMLElement, 'article'>;
    aside: TypedHTMLBuilder<HTMLElement, 'aside'>;
    nav: TypedHTMLBuilder<HTMLElement, 'nav'>;
    section: TypedHTMLBuilder<HTMLElement, 'section'>;
    // untyped
    untyped<T extends TypedHTMLContents<HTMLElement>, U extends HTMLElement, V extends string>(contents: T, factory: () => U, identity: V): TypedHTML<V, U, T>;
  };
  export default TypedHTML;
}
