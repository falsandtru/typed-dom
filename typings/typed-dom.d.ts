/**
*
* typed-dom.d.ts
*
* @author falsandtru https://github.com/falsandtru/typed-dom
*/

declare module 'typed-dom' {
  export interface TypedHTMLElement<T extends HTMLElement, U extends TypedHTMLElementChildren<HTMLElement>> {
    raw: T;
    contents: U;
  }
  export type TypedHTMLElementChildren<T extends HTMLElement> = void[] | TypedHTMLElement<T, any>[] | { [name: string]: TypedHTMLElement<T, any>; };
  interface TypedHTMLElementBuilder<T extends HTMLElement> {
    (): TypedHTMLElement<T, void[]>;
    <U extends TypedHTMLElementChildren<HTMLElement>>(contents: U, factory?: () => T): TypedHTMLElement<T, U>;
  }

  const TypedHTML: {
    // lib.d.ts
    a: TypedHTMLElementBuilder<HTMLAnchorElement>;
    abbr: TypedHTMLElementBuilder<HTMLPhraseElement>;
    acronym: TypedHTMLElementBuilder<HTMLPhraseElement>;
    address: TypedHTMLElementBuilder<HTMLBlockElement>;
    applet: TypedHTMLElementBuilder<HTMLAppletElement>;
    area: TypedHTMLElementBuilder<HTMLAreaElement>;
    audio: TypedHTMLElementBuilder<HTMLAudioElement>;
    b: TypedHTMLElementBuilder<HTMLPhraseElement>;
    base: TypedHTMLElementBuilder<HTMLBaseElement>;
    basefont: TypedHTMLElementBuilder<HTMLBaseFontElement>;
    bdo: TypedHTMLElementBuilder<HTMLPhraseElement>;
    big: TypedHTMLElementBuilder<HTMLPhraseElement>;
    blockquote: TypedHTMLElementBuilder<HTMLBlockElement>;
    body: TypedHTMLElementBuilder<HTMLBodyElement>;
    br: TypedHTMLElementBuilder<HTMLBRElement>;
    button: TypedHTMLElementBuilder<HTMLButtonElement>;
    canvas: TypedHTMLElementBuilder<HTMLCanvasElement>;
    caption: TypedHTMLElementBuilder<HTMLTableCaptionElement>;
    center: TypedHTMLElementBuilder<HTMLBlockElement>;
    cite: TypedHTMLElementBuilder<HTMLPhraseElement>;
    code: TypedHTMLElementBuilder<HTMLPhraseElement>;
    col: TypedHTMLElementBuilder<HTMLTableColElement>;
    colgroup: TypedHTMLElementBuilder<HTMLTableColElement>;
    datalist: TypedHTMLElementBuilder<HTMLDataListElement>;
    dd: TypedHTMLElementBuilder<HTMLDDElement>;
    del: TypedHTMLElementBuilder<HTMLModElement>;
    dfn: TypedHTMLElementBuilder<HTMLPhraseElement>;
    dir: TypedHTMLElementBuilder<HTMLDirectoryElement>;
    div: TypedHTMLElementBuilder<HTMLDivElement>;
    dl: TypedHTMLElementBuilder<HTMLDListElement>;
    dt: TypedHTMLElementBuilder<HTMLDTElement>;
    em: TypedHTMLElementBuilder<HTMLPhraseElement>;
    embed: TypedHTMLElementBuilder<HTMLEmbedElement>;
    fieldset: TypedHTMLElementBuilder<HTMLFieldSetElement>;
    font: TypedHTMLElementBuilder<HTMLFontElement>;
    form: TypedHTMLElementBuilder<HTMLFormElement>;
    frame: TypedHTMLElementBuilder<HTMLFrameElement>;
    frameset: TypedHTMLElementBuilder<HTMLFrameSetElement>;
    h1: TypedHTMLElementBuilder<HTMLHeadingElement>;
    h2: TypedHTMLElementBuilder<HTMLHeadingElement>;
    h3: TypedHTMLElementBuilder<HTMLHeadingElement>;
    h4: TypedHTMLElementBuilder<HTMLHeadingElement>;
    h5: TypedHTMLElementBuilder<HTMLHeadingElement>;
    h6: TypedHTMLElementBuilder<HTMLHeadingElement>;
    head: TypedHTMLElementBuilder<HTMLHeadElement>;
    hr: TypedHTMLElementBuilder<HTMLHRElement>;
    html: TypedHTMLElementBuilder<HTMLHtmlElement>;
    i: TypedHTMLElementBuilder<HTMLPhraseElement>;
    iframe: TypedHTMLElementBuilder<HTMLIFrameElement>;
    img: TypedHTMLElementBuilder<HTMLImageElement>;
    input: TypedHTMLElementBuilder<HTMLInputElement>;
    ins: TypedHTMLElementBuilder<HTMLModElement>;
    isindex: TypedHTMLElementBuilder<HTMLIsIndexElement>;
    kbd: TypedHTMLElementBuilder<HTMLPhraseElement>;
    keygen: TypedHTMLElementBuilder<HTMLBlockElement>;
    label: TypedHTMLElementBuilder<HTMLLabelElement>;
    legend: TypedHTMLElementBuilder<HTMLLegendElement>;
    li: TypedHTMLElementBuilder<HTMLLIElement>;
    link: TypedHTMLElementBuilder<HTMLLinkElement>;
    listing: TypedHTMLElementBuilder<HTMLBlockElement>;
    map: TypedHTMLElementBuilder<HTMLMapElement>;
    marquee: TypedHTMLElementBuilder<HTMLMarqueeElement>;
    menu: TypedHTMLElementBuilder<HTMLMenuElement>;
    meta: TypedHTMLElementBuilder<HTMLMetaElement>;
    nextid: TypedHTMLElementBuilder<HTMLNextIdElement>;
    nobr: TypedHTMLElementBuilder<HTMLPhraseElement>;
    object: TypedHTMLElementBuilder<HTMLObjectElement>;
    ol: TypedHTMLElementBuilder<HTMLOListElement>;
    optgroup: TypedHTMLElementBuilder<HTMLOptGroupElement>;
    option: TypedHTMLElementBuilder<HTMLOptionElement>;
    p: TypedHTMLElementBuilder<HTMLParagraphElement>;
    param: TypedHTMLElementBuilder<HTMLParamElement>;
    picture: TypedHTMLElementBuilder<HTMLPictureElement>;
    plaintext: TypedHTMLElementBuilder<HTMLBlockElement>;
    pre: TypedHTMLElementBuilder<HTMLPreElement>;
    progress: TypedHTMLElementBuilder<HTMLProgressElement>;
    q: TypedHTMLElementBuilder<HTMLQuoteElement>;
    rt: TypedHTMLElementBuilder<HTMLPhraseElement>;
    ruby: TypedHTMLElementBuilder<HTMLPhraseElement>;
    s: TypedHTMLElementBuilder<HTMLPhraseElement>;
    samp: TypedHTMLElementBuilder<HTMLPhraseElement>;
    script: TypedHTMLElementBuilder<HTMLScriptElement>;
    select: TypedHTMLElementBuilder<HTMLSelectElement>;
    small: TypedHTMLElementBuilder<HTMLPhraseElement>;
    source: TypedHTMLElementBuilder<HTMLSourceElement>;
    span: TypedHTMLElementBuilder<HTMLSpanElement>;
    strike: TypedHTMLElementBuilder<HTMLPhraseElement>;
    strong: TypedHTMLElementBuilder<HTMLPhraseElement>;
    style: TypedHTMLElementBuilder<HTMLStyleElement>;
    sub: TypedHTMLElementBuilder<HTMLPhraseElement>;
    sup: TypedHTMLElementBuilder<HTMLPhraseElement>;
    table: TypedHTMLElementBuilder<HTMLTableElement>;
    tbody: TypedHTMLElementBuilder<HTMLTableSectionElement>;
    td: TypedHTMLElementBuilder<HTMLTableDataCellElement>;
    textarea: TypedHTMLElementBuilder<HTMLTextAreaElement>;
    tfoot: TypedHTMLElementBuilder<HTMLTableSectionElement>;
    th: TypedHTMLElementBuilder<HTMLTableHeaderCellElement>;
    thead: TypedHTMLElementBuilder<HTMLTableSectionElement>;
    title: TypedHTMLElementBuilder<HTMLTitleElement>;
    tr: TypedHTMLElementBuilder<HTMLTableRowElement>;
    track: TypedHTMLElementBuilder<HTMLTrackElement>;
    tt: TypedHTMLElementBuilder<HTMLPhraseElement>;
    u: TypedHTMLElementBuilder<HTMLPhraseElement>;
    ul: TypedHTMLElementBuilder<HTMLUListElement>;
    var: TypedHTMLElementBuilder<HTMLPhraseElement>;
    video: TypedHTMLElementBuilder<HTMLVideoElement>;
    xmp: TypedHTMLElementBuilder<HTMLBlockElement>;
    // sectioning contents
    article: TypedHTMLElementBuilder<HTMLElement>;
    aside: TypedHTMLElementBuilder<HTMLElement>;
    nav: TypedHTMLElementBuilder<HTMLElement>;
    section: TypedHTMLElementBuilder<HTMLElement>;
    // untyped
    untyped<T extends TypedHTMLElementChildren<HTMLElement>, U extends HTMLElement>(contents: T, factory: () => U): TypedHTMLElement<U, T>;
  };
  export default TypedHTML;
}
