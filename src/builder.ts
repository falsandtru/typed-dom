import {default as Builder, TypedHTMLElement, TypedHTMLElementChildren} from 'typed-dom';

export const TypedHTML: typeof Builder = {
  a
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLAnchorElement = () => document.createElement('a'))
    : TypedHTMLElement<HTMLAnchorElement, T> {
    return build(factory, children);
  },
  abbr
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('abbr'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  acronym
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('acronym'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  address
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLBlockElement = () => document.createElement('address'))
    : TypedHTMLElement<HTMLBlockElement, T> {
    return build(factory, children);
  },
  applet
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLAppletElement = () => document.createElement('applet'))
    : TypedHTMLElement<HTMLAppletElement, T> {
    return build(factory, children);
  },
  area
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLAreaElement = () => document.createElement('area'))
    : TypedHTMLElement<HTMLAreaElement, T> {
    return build(factory, children);
  },
  audio
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLAudioElement = () => document.createElement('audio'))
    : TypedHTMLElement<HTMLAudioElement, T> {
    return build(factory, children);
  },
  b
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('b'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  base
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLBaseElement = () => document.createElement('base'))
    : TypedHTMLElement<HTMLBaseElement, T> {
    return build(factory, children);
  },
  basefont
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLBaseFontElement = () => document.createElement('basefont'))
    : TypedHTMLElement<HTMLBaseFontElement, T> {
    return build(factory, children);
  },
  bdo
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('bdo'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  big
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('big'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  blockquote
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLBlockElement = () => document.createElement('blockquote'))
    : TypedHTMLElement<HTMLBlockElement, T> {
    return build(factory, children);
  },
  body
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLBodyElement = () => document.createElement('body'))
    : TypedHTMLElement<HTMLBodyElement, T> {
    return build(factory, children);
  },
  br
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLBRElement = () => document.createElement('br'))
    : TypedHTMLElement<HTMLBRElement, T> {
    return build(factory, children);
  },
  button
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLButtonElement = () => document.createElement('button'))
    : TypedHTMLElement<HTMLButtonElement, T> {
    return build(factory, children);
  },
  canvas
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLCanvasElement = () => document.createElement('canvas'))
    : TypedHTMLElement<HTMLCanvasElement, T> {
    return build(factory, children);
  },
  caption
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLTableCaptionElement = () => document.createElement('caption'))
    : TypedHTMLElement<HTMLTableCaptionElement, T> {
    return build(factory, children);
  },
  center
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLBlockElement = () => document.createElement('center'))
    : TypedHTMLElement<HTMLBlockElement, T> {
    return build(factory, children);
  },
  cite
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('cite'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  code
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('code'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  col
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLTableColElement = () => document.createElement('col'))
    : TypedHTMLElement<HTMLTableColElement, T> {
    return build(factory, children);
  },
  colgroup
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLTableColElement = () => document.createElement('colgroup'))
    : TypedHTMLElement<HTMLTableColElement, T> {
    return build(factory, children);
  },
  datalist
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLDataListElement = () => document.createElement('datalist'))
    : TypedHTMLElement<HTMLDataListElement, T> {
    return build(factory, children);
  },
  dd
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLDDElement = () => document.createElement('dd'))
    : TypedHTMLElement<HTMLDDElement, T> {
    return build(factory, children);
  },
  del
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLModElement = () => document.createElement('del'))
    : TypedHTMLElement<HTMLModElement, T> {
    return build(factory, children);
  },
  dfn
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('dfn'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  dir
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLDirectoryElement = () => document.createElement('dir'))
    : TypedHTMLElement<HTMLDirectoryElement, T> {
    return build(factory, children);
  },
  div
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLDivElement = () => document.createElement('div'))
    : TypedHTMLElement<HTMLDivElement, T> {
    return build(factory, children);
  },
  dl
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLDListElement = () => document.createElement('dl'))
    : TypedHTMLElement<HTMLDListElement, T> {
    return build(factory, children);
  },
  dt
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLDTElement = () => document.createElement('dt'))
    : TypedHTMLElement<HTMLDTElement, T> {
    return build(factory, children);
  },
  em
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('em'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  embed
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLEmbedElement = () => document.createElement('embed'))
    : TypedHTMLElement<HTMLEmbedElement, T> {
    return build(factory, children);
  },
  fieldset
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLFieldSetElement = () => document.createElement('fieldset'))
    : TypedHTMLElement<HTMLFieldSetElement, T> {
    return build(factory, children);
  },
  font
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLFontElement = () => document.createElement('font'))
    : TypedHTMLElement<HTMLFontElement, T> {
    return build(factory, children);
  },
  form
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLFormElement = () => document.createElement('form'))
    : TypedHTMLElement<HTMLFormElement, T> {
    return build(factory, children);
  },
  frame
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLFrameElement = () => document.createElement('frame'))
    : TypedHTMLElement<HTMLFrameElement, T> {
    return build(factory, children);
  },
  frameset
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLFrameSetElement = () => document.createElement('frameset'))
    : TypedHTMLElement<HTMLFrameSetElement, T> {
    return build(factory, children);
  },
  h1
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLHeadingElement = () => document.createElement('h1'))
    : TypedHTMLElement<HTMLHeadingElement, T> {
    return build(factory, children);
  },
  h2
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLHeadingElement = () => document.createElement('h2'))
    : TypedHTMLElement<HTMLHeadingElement, T> {
    return build(factory, children);
  },
  h3
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLHeadingElement = () => document.createElement('h3'))
    : TypedHTMLElement<HTMLHeadingElement, T> {
    return build(factory, children);
  },
  h4
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLHeadingElement = () => document.createElement('h4'))
    : TypedHTMLElement<HTMLHeadingElement, T> {
    return build(factory, children);
  },
  h5
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLHeadingElement = () => document.createElement('h5'))
    : TypedHTMLElement<HTMLHeadingElement, T> {
    return build(factory, children);
  },
  h6
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLHeadingElement = () => document.createElement('h6'))
    : TypedHTMLElement<HTMLHeadingElement, T> {
    return build(factory, children);
  },
  head
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLHeadElement = () => document.createElement('head'))
    : TypedHTMLElement<HTMLHeadElement, T> {
    return build(factory, children);
  },
  hr
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLHRElement = () => document.createElement('hr'))
    : TypedHTMLElement<HTMLHRElement, T> {
    return build(factory, children);
  },
  html
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLHtmlElement = () => document.createElement('html'))
    : TypedHTMLElement<HTMLHtmlElement, T> {
    return build(factory, children);
  },
  i
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('i'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  iframe
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLIFrameElement = () => document.createElement('iframe'))
    : TypedHTMLElement<HTMLIFrameElement, T> {
    return build(factory, children);
  },
  img
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLImageElement = () => document.createElement('img'))
    : TypedHTMLElement<HTMLImageElement, T> {
    return build(factory, children);
  },
  input
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLInputElement = () => document.createElement('input'))
    : TypedHTMLElement<HTMLInputElement, T> {
    return build(factory, children);
  },
  ins
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLModElement = () => document.createElement('ins'))
    : TypedHTMLElement<HTMLModElement, T> {
    return build(factory, children);
  },
  isindex
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLIsIndexElement = () => document.createElement('isindex'))
    : TypedHTMLElement<HTMLIsIndexElement, T> {
    return build(factory, children);
  },
  kbd
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('kbd'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  keygen
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLBlockElement = () => document.createElement('keygen'))
    : TypedHTMLElement<HTMLBlockElement, T> {
    return build(factory, children);
  },
  label
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLLabelElement = () => document.createElement('label'))
    : TypedHTMLElement<HTMLLabelElement, T> {
    return build(factory, children);
  },
  legend
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLLegendElement = () => document.createElement('legend'))
    : TypedHTMLElement<HTMLLegendElement, T> {
    return build(factory, children);
  },
  li
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLLIElement = () => document.createElement('li'))
    : TypedHTMLElement<HTMLLIElement, T> {
    return build(factory, children);
  },
  link
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLLinkElement = () => document.createElement('link'))
    : TypedHTMLElement<HTMLLinkElement, T> {
    return build(factory, children);
  },
  listing
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLBlockElement = () => document.createElement('listing'))
    : TypedHTMLElement<HTMLBlockElement, T> {
    return build(factory, children);
  },
  map
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLMapElement = () => document.createElement('map'))
    : TypedHTMLElement<HTMLMapElement, T> {
    return build(factory, children);
  },
  marquee
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLMarqueeElement = () => document.createElement('marquee'))
    : TypedHTMLElement<HTMLMarqueeElement, T> {
    return build(factory, children);
  },
  menu
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLMenuElement = () => document.createElement('menu'))
    : TypedHTMLElement<HTMLMenuElement, T> {
    return build(factory, children);
  },
  meta
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLMetaElement = () => document.createElement('meta'))
    : TypedHTMLElement<HTMLMetaElement, T> {
    return build(factory, children);
  },
  nextid
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLNextIdElement = () => document.createElement('nextid'))
    : TypedHTMLElement<HTMLNextIdElement, T> {
    return build(factory, children);
  },
  nobr
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('nobr'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  object
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLObjectElement = () => document.createElement('object'))
    : TypedHTMLElement<HTMLObjectElement, T> {
    return build(factory, children);
  },
  ol
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLOListElement = () => document.createElement('ol'))
    : TypedHTMLElement<HTMLOListElement, T> {
    return build(factory, children);
  },
  optgroup
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLOptGroupElement = () => document.createElement('optgroup'))
    : TypedHTMLElement<HTMLOptGroupElement, T> {
    return build(factory, children);
  },
  option
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLOptionElement = () => document.createElement('option'))
    : TypedHTMLElement<HTMLOptionElement, T> {
    return build(factory, children);
  },
  p
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLParagraphElement = () => document.createElement('p'))
    : TypedHTMLElement<HTMLParagraphElement, T> {
    return build(factory, children);
  },
  param
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLParamElement = () => document.createElement('param'))
    : TypedHTMLElement<HTMLParamElement, T> {
    return build(factory, children);
  },
  picture
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPictureElement = () => document.createElement('picture'))
    : TypedHTMLElement<HTMLPictureElement, T> {
    return build(factory, children);
  },
  plaintext
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLBlockElement = () => document.createElement('plaintext'))
    : TypedHTMLElement<HTMLBlockElement, T> {
    return build(factory, children);
  },
  pre
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPreElement = () => document.createElement('pre'))
    : TypedHTMLElement<HTMLPreElement, T> {
    return build(factory, children);
  },
  progress
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLProgressElement = () => document.createElement('progress'))
    : TypedHTMLElement<HTMLProgressElement, T> {
    return build(factory, children);
  },
  q
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLQuoteElement = () => document.createElement('q'))
    : TypedHTMLElement<HTMLQuoteElement, T> {
    return build(factory, children);
  },
  rt
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('rt'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  ruby
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('ruby'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  s
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('s'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  samp
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('samp'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  script
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLScriptElement = () => document.createElement('script'))
    : TypedHTMLElement<HTMLScriptElement, T> {
    return build(factory, children);
  },
  select
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLSelectElement = () => document.createElement('select'))
    : TypedHTMLElement<HTMLSelectElement, T> {
    return build(factory, children);
  },
  small
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('small'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  source
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLSourceElement = () => document.createElement('source'))
    : TypedHTMLElement<HTMLSourceElement, T> {
    return build(factory, children);
  },
  span
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLSpanElement = () => document.createElement('span'))
    : TypedHTMLElement<HTMLSpanElement, T> {
    return build(factory, children);
  },
  strike
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('strike'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  strong
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('strong'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  style
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLStyleElement = () => document.createElement('style'))
    : TypedHTMLElement<HTMLStyleElement, T> {
    return build(factory, children);
  },
  sub
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('sub'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  sup
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('sup'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  table
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLTableElement = () => document.createElement('table'))
    : TypedHTMLElement<HTMLTableElement, T> {
    return build(factory, children);
  },
  tbody
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLTableSectionElement = () => document.createElement('tbody'))
    : TypedHTMLElement<HTMLTableSectionElement, T> {
    return build(factory, children);
  },
  td
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLTableDataCellElement = () => document.createElement('td'))
    : TypedHTMLElement<HTMLTableDataCellElement, T> {
    return build(factory, children);
  },
  textarea
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLTextAreaElement = () => document.createElement('textarea'))
    : TypedHTMLElement<HTMLTextAreaElement, T> {
    return build(factory, children);
  },
  tfoot
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLTableSectionElement = () => document.createElement('tfoot'))
    : TypedHTMLElement<HTMLTableSectionElement, T> {
    return build(factory, children);
  },
  th
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLTableHeaderCellElement = () => document.createElement('th'))
    : TypedHTMLElement<HTMLTableHeaderCellElement, T> {
    return build(factory, children);
  },
  thead
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLTableSectionElement = () => document.createElement('thead'))
    : TypedHTMLElement<HTMLTableSectionElement, T> {
    return build(factory, children);
  },
  title
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLTitleElement = () => document.createElement('title'))
    : TypedHTMLElement<HTMLTitleElement, T> {
    return build(factory, children);
  },
  tr
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLTableRowElement = () => document.createElement('tr'))
    : TypedHTMLElement<HTMLTableRowElement, T> {
    return build(factory, children);
  },
  track
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLTrackElement = () => document.createElement('track'))
    : TypedHTMLElement<HTMLTrackElement, T> {
    return build(factory, children);
  },
  tt
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('tt'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  u
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('u'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  ul
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLUListElement = () => document.createElement('ul'))
    : TypedHTMLElement<HTMLUListElement, T> {
    return build(factory, children);
  },
  var
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLPhraseElement = () => document.createElement('var'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, children);
  },
  video
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLVideoElement = () => document.createElement('video'))
    : TypedHTMLElement<HTMLVideoElement, T> {
    return build(factory, children);
  },
  xmp
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLBlockElement = () => document.createElement('xmp'))
    : TypedHTMLElement<HTMLBlockElement, T> {
    return build(factory, children);
  },
  article
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLElement = () => document.createElement('article'))
    : TypedHTMLElement<HTMLElement, T> {
    return build(factory, children);
  },
  aside
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLElement = () => document.createElement('aside'))
    : TypedHTMLElement<HTMLElement, T> {
    return build(factory, children);
  },
  nav
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLElement = () => document.createElement('nav'))
    : TypedHTMLElement<HTMLElement, T> {
    return build(factory, children);
  },
  section
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (children?: T, factory: () => HTMLElement = () => document.createElement('section'))
    : TypedHTMLElement<HTMLElement, T> {
    return build(factory, children);
  },
  untyped
    <T extends TypedHTMLElementChildren<HTMLElement>, U extends HTMLElement>
    (children: T, factory: () => U)
    : TypedHTMLElement<U, T> {
    return build(factory, children);
  }
};

function build<T extends HTMLElement, U extends TypedHTMLElementChildren<HTMLElement>>(factory: () => T, children: U = <any>[]): TypedHTMLElement<T, U> {
  const raw = factory();
  void Object.keys(children)
    .forEach(idx => void raw.appendChild(children[idx].raw));
  if (children instanceof Array === false) {
    const c = children;
    children = Object.keys(children)
      .reduce((obj, idx) => {
        Object.defineProperty(obj, idx, {
          get() {
            return c[idx];
          },
          set(newElt) {
            const oldElt = c[idx];
            c[idx] = newElt;
            raw.replaceChild(newElt.raw, oldElt.raw);
          }
        });
        return obj;
      }, <typeof children>{});
  }
  return {
    raw,
    get contents(): typeof children {
      return children;
    },
    set contents(c) {
      if (children instanceof Array === false) throw new TypeError(`TypedDOM: Children cannot update when its type is not an array.`);
      children = c;
      raw.innerHTML = '';
      (<any[]><any>children)
        .forEach(child => raw.appendChild(child.raw));
    }
  };
}
