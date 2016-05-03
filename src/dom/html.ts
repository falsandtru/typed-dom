import {default as Builder, TypedHTMLElement, TypedHTMLElementChildren} from 'typed-dom';
import {build} from './builder';

export const TypedHTML: typeof Builder = {
  a
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLAnchorElement = () => document.createElement('a'))
    : TypedHTMLElement<HTMLAnchorElement, T> {
    return build(factory, contents);
  },
  abbr
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('abbr'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  acronym
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('acronym'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  address
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('address'))
    : TypedHTMLElement<HTMLBlockElement, T> {
    return build(factory, contents);
  },
  applet
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLAppletElement = () => document.createElement('applet'))
    : TypedHTMLElement<HTMLAppletElement, T> {
    return build(factory, contents);
  },
  area
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLAreaElement = () => document.createElement('area'))
    : TypedHTMLElement<HTMLAreaElement, T> {
    return build(factory, contents);
  },
  audio
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLAudioElement = () => document.createElement('audio'))
    : TypedHTMLElement<HTMLAudioElement, T> {
    return build(factory, contents);
  },
  b
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('b'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  base
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLBaseElement = () => document.createElement('base'))
    : TypedHTMLElement<HTMLBaseElement, T> {
    return build(factory, contents);
  },
  basefont
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLBaseFontElement = () => document.createElement('basefont'))
    : TypedHTMLElement<HTMLBaseFontElement, T> {
    return build(factory, contents);
  },
  bdo
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('bdo'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  big
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('big'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  blockquote
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('blockquote'))
    : TypedHTMLElement<HTMLBlockElement, T> {
    return build(factory, contents);
  },
  body
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLBodyElement = () => document.createElement('body'))
    : TypedHTMLElement<HTMLBodyElement, T> {
    return build(factory, contents);
  },
  br
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLBRElement = () => document.createElement('br'))
    : TypedHTMLElement<HTMLBRElement, T> {
    return build(factory, contents);
  },
  button
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLButtonElement = () => document.createElement('button'))
    : TypedHTMLElement<HTMLButtonElement, T> {
    return build(factory, contents);
  },
  canvas
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLCanvasElement = () => document.createElement('canvas'))
    : TypedHTMLElement<HTMLCanvasElement, T> {
    return build(factory, contents);
  },
  caption
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLTableCaptionElement = () => document.createElement('caption'))
    : TypedHTMLElement<HTMLTableCaptionElement, T> {
    return build(factory, contents);
  },
  center
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('center'))
    : TypedHTMLElement<HTMLBlockElement, T> {
    return build(factory, contents);
  },
  cite
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('cite'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  code
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('code'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  col
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLTableColElement = () => document.createElement('col'))
    : TypedHTMLElement<HTMLTableColElement, T> {
    return build(factory, contents);
  },
  colgroup
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLTableColElement = () => document.createElement('colgroup'))
    : TypedHTMLElement<HTMLTableColElement, T> {
    return build(factory, contents);
  },
  datalist
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLDataListElement = () => document.createElement('datalist'))
    : TypedHTMLElement<HTMLDataListElement, T> {
    return build(factory, contents);
  },
  dd
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLDDElement = () => document.createElement('dd'))
    : TypedHTMLElement<HTMLDDElement, T> {
    return build(factory, contents);
  },
  del
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLModElement = () => document.createElement('del'))
    : TypedHTMLElement<HTMLModElement, T> {
    return build(factory, contents);
  },
  dfn
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('dfn'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  dir
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLDirectoryElement = () => document.createElement('dir'))
    : TypedHTMLElement<HTMLDirectoryElement, T> {
    return build(factory, contents);
  },
  div
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLDivElement = () => document.createElement('div'))
    : TypedHTMLElement<HTMLDivElement, T> {
    return build(factory, contents);
  },
  dl
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLDListElement = () => document.createElement('dl'))
    : TypedHTMLElement<HTMLDListElement, T> {
    return build(factory, contents);
  },
  dt
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLDTElement = () => document.createElement('dt'))
    : TypedHTMLElement<HTMLDTElement, T> {
    return build(factory, contents);
  },
  em
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('em'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  embed
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLEmbedElement = () => document.createElement('embed'))
    : TypedHTMLElement<HTMLEmbedElement, T> {
    return build(factory, contents);
  },
  fieldset
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLFieldSetElement = () => document.createElement('fieldset'))
    : TypedHTMLElement<HTMLFieldSetElement, T> {
    return build(factory, contents);
  },
  font
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLFontElement = () => document.createElement('font'))
    : TypedHTMLElement<HTMLFontElement, T> {
    return build(factory, contents);
  },
  form
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLFormElement = () => document.createElement('form'))
    : TypedHTMLElement<HTMLFormElement, T> {
    return build(factory, contents);
  },
  frame
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLFrameElement = () => document.createElement('frame'))
    : TypedHTMLElement<HTMLFrameElement, T> {
    return build(factory, contents);
  },
  frameset
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLFrameSetElement = () => document.createElement('frameset'))
    : TypedHTMLElement<HTMLFrameSetElement, T> {
    return build(factory, contents);
  },
  h1
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadingElement = () => document.createElement('h1'))
    : TypedHTMLElement<HTMLHeadingElement, T> {
    return build(factory, contents);
  },
  h2
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadingElement = () => document.createElement('h2'))
    : TypedHTMLElement<HTMLHeadingElement, T> {
    return build(factory, contents);
  },
  h3
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadingElement = () => document.createElement('h3'))
    : TypedHTMLElement<HTMLHeadingElement, T> {
    return build(factory, contents);
  },
  h4
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadingElement = () => document.createElement('h4'))
    : TypedHTMLElement<HTMLHeadingElement, T> {
    return build(factory, contents);
  },
  h5
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadingElement = () => document.createElement('h5'))
    : TypedHTMLElement<HTMLHeadingElement, T> {
    return build(factory, contents);
  },
  h6
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadingElement = () => document.createElement('h6'))
    : TypedHTMLElement<HTMLHeadingElement, T> {
    return build(factory, contents);
  },
  head
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadElement = () => document.createElement('head'))
    : TypedHTMLElement<HTMLHeadElement, T> {
    return build(factory, contents);
  },
  hr
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLHRElement = () => document.createElement('hr'))
    : TypedHTMLElement<HTMLHRElement, T> {
    return build(factory, contents);
  },
  html
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLHtmlElement = () => document.createElement('html'))
    : TypedHTMLElement<HTMLHtmlElement, T> {
    return build(factory, contents);
  },
  i
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('i'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  iframe
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLIFrameElement = () => document.createElement('iframe'))
    : TypedHTMLElement<HTMLIFrameElement, T> {
    return build(factory, contents);
  },
  img
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLImageElement = () => document.createElement('img'))
    : TypedHTMLElement<HTMLImageElement, T> {
    return build(factory, contents);
  },
  input
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLInputElement = () => document.createElement('input'))
    : TypedHTMLElement<HTMLInputElement, T> {
    return build(factory, contents);
  },
  ins
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLModElement = () => document.createElement('ins'))
    : TypedHTMLElement<HTMLModElement, T> {
    return build(factory, contents);
  },
  isindex
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLIsIndexElement = () => document.createElement('isindex'))
    : TypedHTMLElement<HTMLIsIndexElement, T> {
    return build(factory, contents);
  },
  kbd
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('kbd'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  keygen
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('keygen'))
    : TypedHTMLElement<HTMLBlockElement, T> {
    return build(factory, contents);
  },
  label
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLLabelElement = () => document.createElement('label'))
    : TypedHTMLElement<HTMLLabelElement, T> {
    return build(factory, contents);
  },
  legend
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLLegendElement = () => document.createElement('legend'))
    : TypedHTMLElement<HTMLLegendElement, T> {
    return build(factory, contents);
  },
  li
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLLIElement = () => document.createElement('li'))
    : TypedHTMLElement<HTMLLIElement, T> {
    return build(factory, contents);
  },
  link
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLLinkElement = () => document.createElement('link'))
    : TypedHTMLElement<HTMLLinkElement, T> {
    return build(factory, contents);
  },
  listing
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('listing'))
    : TypedHTMLElement<HTMLBlockElement, T> {
    return build(factory, contents);
  },
  map
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLMapElement = () => document.createElement('map'))
    : TypedHTMLElement<HTMLMapElement, T> {
    return build(factory, contents);
  },
  marquee
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLMarqueeElement = () => document.createElement('marquee'))
    : TypedHTMLElement<HTMLMarqueeElement, T> {
    return build(factory, contents);
  },
  menu
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLMenuElement = () => document.createElement('menu'))
    : TypedHTMLElement<HTMLMenuElement, T> {
    return build(factory, contents);
  },
  meta
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLMetaElement = () => document.createElement('meta'))
    : TypedHTMLElement<HTMLMetaElement, T> {
    return build(factory, contents);
  },
  nextid
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLNextIdElement = () => document.createElement('nextid'))
    : TypedHTMLElement<HTMLNextIdElement, T> {
    return build(factory, contents);
  },
  nobr
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('nobr'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  object
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLObjectElement = () => document.createElement('object'))
    : TypedHTMLElement<HTMLObjectElement, T> {
    return build(factory, contents);
  },
  ol
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLOListElement = () => document.createElement('ol'))
    : TypedHTMLElement<HTMLOListElement, T> {
    return build(factory, contents);
  },
  optgroup
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLOptGroupElement = () => document.createElement('optgroup'))
    : TypedHTMLElement<HTMLOptGroupElement, T> {
    return build(factory, contents);
  },
  option
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLOptionElement = () => document.createElement('option'))
    : TypedHTMLElement<HTMLOptionElement, T> {
    return build(factory, contents);
  },
  p
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLParagraphElement = () => document.createElement('p'))
    : TypedHTMLElement<HTMLParagraphElement, T> {
    return build(factory, contents);
  },
  param
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLParamElement = () => document.createElement('param'))
    : TypedHTMLElement<HTMLParamElement, T> {
    return build(factory, contents);
  },
  picture
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPictureElement = () => document.createElement('picture'))
    : TypedHTMLElement<HTMLPictureElement, T> {
    return build(factory, contents);
  },
  plaintext
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('plaintext'))
    : TypedHTMLElement<HTMLBlockElement, T> {
    return build(factory, contents);
  },
  pre
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPreElement = () => document.createElement('pre'))
    : TypedHTMLElement<HTMLPreElement, T> {
    return build(factory, contents);
  },
  progress
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLProgressElement = () => document.createElement('progress'))
    : TypedHTMLElement<HTMLProgressElement, T> {
    return build(factory, contents);
  },
  q
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLQuoteElement = () => document.createElement('q'))
    : TypedHTMLElement<HTMLQuoteElement, T> {
    return build(factory, contents);
  },
  rt
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('rt'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  ruby
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('ruby'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  s
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('s'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  samp
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('samp'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  script
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLScriptElement = () => document.createElement('script'))
    : TypedHTMLElement<HTMLScriptElement, T> {
    return build(factory, contents);
  },
  select
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLSelectElement = () => document.createElement('select'))
    : TypedHTMLElement<HTMLSelectElement, T> {
    return build(factory, contents);
  },
  small
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('small'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  source
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLSourceElement = () => document.createElement('source'))
    : TypedHTMLElement<HTMLSourceElement, T> {
    return build(factory, contents);
  },
  span
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLSpanElement = () => document.createElement('span'))
    : TypedHTMLElement<HTMLSpanElement, T> {
    return build(factory, contents);
  },
  strike
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('strike'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  strong
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('strong'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  style
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLStyleElement = () => document.createElement('style'))
    : TypedHTMLElement<HTMLStyleElement, T> {
    return build(factory, contents);
  },
  sub
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('sub'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  sup
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('sup'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  table
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLTableElement = () => document.createElement('table'))
    : TypedHTMLElement<HTMLTableElement, T> {
    return build(factory, contents);
  },
  tbody
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLTableSectionElement = () => document.createElement('tbody'))
    : TypedHTMLElement<HTMLTableSectionElement, T> {
    return build(factory, contents);
  },
  td
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLTableDataCellElement = () => document.createElement('td'))
    : TypedHTMLElement<HTMLTableDataCellElement, T> {
    return build(factory, contents);
  },
  textarea
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLTextAreaElement = () => document.createElement('textarea'))
    : TypedHTMLElement<HTMLTextAreaElement, T> {
    return build(factory, contents);
  },
  tfoot
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLTableSectionElement = () => document.createElement('tfoot'))
    : TypedHTMLElement<HTMLTableSectionElement, T> {
    return build(factory, contents);
  },
  th
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLTableHeaderCellElement = () => document.createElement('th'))
    : TypedHTMLElement<HTMLTableHeaderCellElement, T> {
    return build(factory, contents);
  },
  thead
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLTableSectionElement = () => document.createElement('thead'))
    : TypedHTMLElement<HTMLTableSectionElement, T> {
    return build(factory, contents);
  },
  title
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLTitleElement = () => document.createElement('title'))
    : TypedHTMLElement<HTMLTitleElement, T> {
    return build(factory, contents);
  },
  tr
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLTableRowElement = () => document.createElement('tr'))
    : TypedHTMLElement<HTMLTableRowElement, T> {
    return build(factory, contents);
  },
  track
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLTrackElement = () => document.createElement('track'))
    : TypedHTMLElement<HTMLTrackElement, T> {
    return build(factory, contents);
  },
  tt
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('tt'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  u
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('u'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  ul
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLUListElement = () => document.createElement('ul'))
    : TypedHTMLElement<HTMLUListElement, T> {
    return build(factory, contents);
  },
  var
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('var'))
    : TypedHTMLElement<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  video
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLVideoElement = () => document.createElement('video'))
    : TypedHTMLElement<HTMLVideoElement, T> {
    return build(factory, contents);
  },
  xmp
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('xmp'))
    : TypedHTMLElement<HTMLBlockElement, T> {
    return build(factory, contents);
  },
  article
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLElement = () => document.createElement('article'))
    : TypedHTMLElement<HTMLElement, T> {
    return build(factory, contents);
  },
  aside
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLElement = () => document.createElement('aside'))
    : TypedHTMLElement<HTMLElement, T> {
    return build(factory, contents);
  },
  nav
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLElement = () => document.createElement('nav'))
    : TypedHTMLElement<HTMLElement, T> {
    return build(factory, contents);
  },
  section
    <T extends TypedHTMLElementChildren<HTMLElement>>
    (contents?: T, factory: () => HTMLElement = () => document.createElement('section'))
    : TypedHTMLElement<HTMLElement, T> {
    return build(factory, contents);
  },
  untyped
    <T extends TypedHTMLElementChildren<HTMLElement>, U extends HTMLElement>
    (contents: T, factory: () => U)
    : TypedHTMLElement<U, T> {
    return build(factory, contents);
  }
};
