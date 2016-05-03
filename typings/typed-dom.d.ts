/**
*
* typed-dom.d.ts
*
* @author falsandtru https://github.com/falsandtru/typed-dom
*/

declare module 'typed-dom' {
  export interface TypedHTML<T extends HTMLElement, U extends TypedHTMLContents<HTMLElement>> {
    raw: T;
    contents: U;
  }
  export type TypedHTMLContents<T extends HTMLElement> = void[] | TypedHTML<T, any>[] | { [name: string]: TypedHTML<T, any>; };
  interface TypedHTMLBuilder<T extends HTMLElement> {
    (): TypedHTML<T, void[]>;
    <U extends TypedHTMLContents<HTMLElement>>(contents: U, factory?: () => T): TypedHTML<T, U>;
  }

  const TypedHTML: {
    // lib.d.ts
    a: TypedHTMLBuilder<HTMLAnchorElement>;
    abbr: TypedHTMLBuilder<HTMLPhraseElement>;
    acronym: TypedHTMLBuilder<HTMLPhraseElement>;
    address: TypedHTMLBuilder<HTMLBlockElement>;
    applet: TypedHTMLBuilder<HTMLAppletElement>;
    area: TypedHTMLBuilder<HTMLAreaElement>;
    audio: TypedHTMLBuilder<HTMLAudioElement>;
    b: TypedHTMLBuilder<HTMLPhraseElement>;
    base: TypedHTMLBuilder<HTMLBaseElement>;
    basefont: TypedHTMLBuilder<HTMLBaseFontElement>;
    bdo: TypedHTMLBuilder<HTMLPhraseElement>;
    big: TypedHTMLBuilder<HTMLPhraseElement>;
    blockquote: TypedHTMLBuilder<HTMLBlockElement>;
    body: TypedHTMLBuilder<HTMLBodyElement>;
    br: TypedHTMLBuilder<HTMLBRElement>;
    button: TypedHTMLBuilder<HTMLButtonElement>;
    canvas: TypedHTMLBuilder<HTMLCanvasElement>;
    caption: TypedHTMLBuilder<HTMLTableCaptionElement>;
    center: TypedHTMLBuilder<HTMLBlockElement>;
    cite: TypedHTMLBuilder<HTMLPhraseElement>;
    code: TypedHTMLBuilder<HTMLPhraseElement>;
    col: TypedHTMLBuilder<HTMLTableColElement>;
    colgroup: TypedHTMLBuilder<HTMLTableColElement>;
    datalist: TypedHTMLBuilder<HTMLDataListElement>;
    dd: TypedHTMLBuilder<HTMLDDElement>;
    del: TypedHTMLBuilder<HTMLModElement>;
    dfn: TypedHTMLBuilder<HTMLPhraseElement>;
    dir: TypedHTMLBuilder<HTMLDirectoryElement>;
    div: TypedHTMLBuilder<HTMLDivElement>;
    dl: TypedHTMLBuilder<HTMLDListElement>;
    dt: TypedHTMLBuilder<HTMLDTElement>;
    em: TypedHTMLBuilder<HTMLPhraseElement>;
    embed: TypedHTMLBuilder<HTMLEmbedElement>;
    fieldset: TypedHTMLBuilder<HTMLFieldSetElement>;
    font: TypedHTMLBuilder<HTMLFontElement>;
    form: TypedHTMLBuilder<HTMLFormElement>;
    frame: TypedHTMLBuilder<HTMLFrameElement>;
    frameset: TypedHTMLBuilder<HTMLFrameSetElement>;
    h1: TypedHTMLBuilder<HTMLHeadingElement>;
    h2: TypedHTMLBuilder<HTMLHeadingElement>;
    h3: TypedHTMLBuilder<HTMLHeadingElement>;
    h4: TypedHTMLBuilder<HTMLHeadingElement>;
    h5: TypedHTMLBuilder<HTMLHeadingElement>;
    h6: TypedHTMLBuilder<HTMLHeadingElement>;
    head: TypedHTMLBuilder<HTMLHeadElement>;
    hr: TypedHTMLBuilder<HTMLHRElement>;
    html: TypedHTMLBuilder<HTMLHtmlElement>;
    i: TypedHTMLBuilder<HTMLPhraseElement>;
    iframe: TypedHTMLBuilder<HTMLIFrameElement>;
    img: TypedHTMLBuilder<HTMLImageElement>;
    input: TypedHTMLBuilder<HTMLInputElement>;
    ins: TypedHTMLBuilder<HTMLModElement>;
    isindex: TypedHTMLBuilder<HTMLIsIndexElement>;
    kbd: TypedHTMLBuilder<HTMLPhraseElement>;
    keygen: TypedHTMLBuilder<HTMLBlockElement>;
    label: TypedHTMLBuilder<HTMLLabelElement>;
    legend: TypedHTMLBuilder<HTMLLegendElement>;
    li: TypedHTMLBuilder<HTMLLIElement>;
    link: TypedHTMLBuilder<HTMLLinkElement>;
    listing: TypedHTMLBuilder<HTMLBlockElement>;
    map: TypedHTMLBuilder<HTMLMapElement>;
    marquee: TypedHTMLBuilder<HTMLMarqueeElement>;
    menu: TypedHTMLBuilder<HTMLMenuElement>;
    meta: TypedHTMLBuilder<HTMLMetaElement>;
    nextid: TypedHTMLBuilder<HTMLNextIdElement>;
    nobr: TypedHTMLBuilder<HTMLPhraseElement>;
    object: TypedHTMLBuilder<HTMLObjectElement>;
    ol: TypedHTMLBuilder<HTMLOListElement>;
    optgroup: TypedHTMLBuilder<HTMLOptGroupElement>;
    option: TypedHTMLBuilder<HTMLOptionElement>;
    p: TypedHTMLBuilder<HTMLParagraphElement>;
    param: TypedHTMLBuilder<HTMLParamElement>;
    picture: TypedHTMLBuilder<HTMLPictureElement>;
    plaintext: TypedHTMLBuilder<HTMLBlockElement>;
    pre: TypedHTMLBuilder<HTMLPreElement>;
    progress: TypedHTMLBuilder<HTMLProgressElement>;
    q: TypedHTMLBuilder<HTMLQuoteElement>;
    rt: TypedHTMLBuilder<HTMLPhraseElement>;
    ruby: TypedHTMLBuilder<HTMLPhraseElement>;
    s: TypedHTMLBuilder<HTMLPhraseElement>;
    samp: TypedHTMLBuilder<HTMLPhraseElement>;
    script: TypedHTMLBuilder<HTMLScriptElement>;
    select: TypedHTMLBuilder<HTMLSelectElement>;
    small: TypedHTMLBuilder<HTMLPhraseElement>;
    source: TypedHTMLBuilder<HTMLSourceElement>;
    span: TypedHTMLBuilder<HTMLSpanElement>;
    strike: TypedHTMLBuilder<HTMLPhraseElement>;
    strong: TypedHTMLBuilder<HTMLPhraseElement>;
    style: TypedHTMLBuilder<HTMLStyleElement>;
    sub: TypedHTMLBuilder<HTMLPhraseElement>;
    sup: TypedHTMLBuilder<HTMLPhraseElement>;
    table: TypedHTMLBuilder<HTMLTableElement>;
    tbody: TypedHTMLBuilder<HTMLTableSectionElement>;
    td: TypedHTMLBuilder<HTMLTableDataCellElement>;
    textarea: TypedHTMLBuilder<HTMLTextAreaElement>;
    tfoot: TypedHTMLBuilder<HTMLTableSectionElement>;
    th: TypedHTMLBuilder<HTMLTableHeaderCellElement>;
    thead: TypedHTMLBuilder<HTMLTableSectionElement>;
    title: TypedHTMLBuilder<HTMLTitleElement>;
    tr: TypedHTMLBuilder<HTMLTableRowElement>;
    track: TypedHTMLBuilder<HTMLTrackElement>;
    tt: TypedHTMLBuilder<HTMLPhraseElement>;
    u: TypedHTMLBuilder<HTMLPhraseElement>;
    ul: TypedHTMLBuilder<HTMLUListElement>;
    var: TypedHTMLBuilder<HTMLPhraseElement>;
    video: TypedHTMLBuilder<HTMLVideoElement>;
    xmp: TypedHTMLBuilder<HTMLBlockElement>;
    // sectioning contents
    article: TypedHTMLBuilder<HTMLElement>;
    aside: TypedHTMLBuilder<HTMLElement>;
    nav: TypedHTMLBuilder<HTMLElement>;
    section: TypedHTMLBuilder<HTMLElement>;
    // untyped
    untyped<T extends TypedHTMLContents<HTMLElement>, U extends HTMLElement>(contents: T, factory: () => U): TypedHTML<U, T>;
  };
  export default TypedHTML;
}
