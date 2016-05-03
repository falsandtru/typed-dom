import {default as builder, TypedHTML as ITypedHTML, TypedHTMLContents} from 'typed-dom';
import {build} from './builder';

export type TypedHTML<T extends HTMLElement, U extends TypedHTMLContents<HTMLElement>> = ITypedHTML<T, U>;
export const TypedHTML: typeof builder = {
  a
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLAnchorElement = () => document.createElement('a'))
    : TypedHTML<HTMLAnchorElement, T> {
    return build(factory, contents);
  },
  abbr
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('abbr'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  acronym
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('acronym'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  address
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('address'))
    : TypedHTML<HTMLBlockElement, T> {
    return build(factory, contents);
  },
  applet
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLAppletElement = () => document.createElement('applet'))
    : TypedHTML<HTMLAppletElement, T> {
    return build(factory, contents);
  },
  area
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLAreaElement = () => document.createElement('area'))
    : TypedHTML<HTMLAreaElement, T> {
    return build(factory, contents);
  },
  audio
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLAudioElement = () => document.createElement('audio'))
    : TypedHTML<HTMLAudioElement, T> {
    return build(factory, contents);
  },
  b
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('b'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  base
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBaseElement = () => document.createElement('base'))
    : TypedHTML<HTMLBaseElement, T> {
    return build(factory, contents);
  },
  basefont
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBaseFontElement = () => document.createElement('basefont'))
    : TypedHTML<HTMLBaseFontElement, T> {
    return build(factory, contents);
  },
  bdo
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('bdo'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  big
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('big'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  blockquote
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('blockquote'))
    : TypedHTML<HTMLBlockElement, T> {
    return build(factory, contents);
  },
  body
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBodyElement = () => document.createElement('body'))
    : TypedHTML<HTMLBodyElement, T> {
    return build(factory, contents);
  },
  br
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBRElement = () => document.createElement('br'))
    : TypedHTML<HTMLBRElement, T> {
    return build(factory, contents);
  },
  button
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLButtonElement = () => document.createElement('button'))
    : TypedHTML<HTMLButtonElement, T> {
    return build(factory, contents);
  },
  canvas
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLCanvasElement = () => document.createElement('canvas'))
    : TypedHTML<HTMLCanvasElement, T> {
    return build(factory, contents);
  },
  caption
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableCaptionElement = () => document.createElement('caption'))
    : TypedHTML<HTMLTableCaptionElement, T> {
    return build(factory, contents);
  },
  center
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('center'))
    : TypedHTML<HTMLBlockElement, T> {
    return build(factory, contents);
  },
  cite
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('cite'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  code
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('code'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  col
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableColElement = () => document.createElement('col'))
    : TypedHTML<HTMLTableColElement, T> {
    return build(factory, contents);
  },
  colgroup
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableColElement = () => document.createElement('colgroup'))
    : TypedHTML<HTMLTableColElement, T> {
    return build(factory, contents);
  },
  datalist
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLDataListElement = () => document.createElement('datalist'))
    : TypedHTML<HTMLDataListElement, T> {
    return build(factory, contents);
  },
  dd
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLDDElement = () => document.createElement('dd'))
    : TypedHTML<HTMLDDElement, T> {
    return build(factory, contents);
  },
  del
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLModElement = () => document.createElement('del'))
    : TypedHTML<HTMLModElement, T> {
    return build(factory, contents);
  },
  dfn
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('dfn'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  dir
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLDirectoryElement = () => document.createElement('dir'))
    : TypedHTML<HTMLDirectoryElement, T> {
    return build(factory, contents);
  },
  div
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLDivElement = () => document.createElement('div'))
    : TypedHTML<HTMLDivElement, T> {
    return build(factory, contents);
  },
  dl
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLDListElement = () => document.createElement('dl'))
    : TypedHTML<HTMLDListElement, T> {
    return build(factory, contents);
  },
  dt
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLDTElement = () => document.createElement('dt'))
    : TypedHTML<HTMLDTElement, T> {
    return build(factory, contents);
  },
  em
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('em'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  embed
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLEmbedElement = () => document.createElement('embed'))
    : TypedHTML<HTMLEmbedElement, T> {
    return build(factory, contents);
  },
  fieldset
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLFieldSetElement = () => document.createElement('fieldset'))
    : TypedHTML<HTMLFieldSetElement, T> {
    return build(factory, contents);
  },
  font
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLFontElement = () => document.createElement('font'))
    : TypedHTML<HTMLFontElement, T> {
    return build(factory, contents);
  },
  form
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLFormElement = () => document.createElement('form'))
    : TypedHTML<HTMLFormElement, T> {
    return build(factory, contents);
  },
  frame
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLFrameElement = () => document.createElement('frame'))
    : TypedHTML<HTMLFrameElement, T> {
    return build(factory, contents);
  },
  frameset
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLFrameSetElement = () => document.createElement('frameset'))
    : TypedHTML<HTMLFrameSetElement, T> {
    return build(factory, contents);
  },
  h1
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadingElement = () => document.createElement('h1'))
    : TypedHTML<HTMLHeadingElement, T> {
    return build(factory, contents);
  },
  h2
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadingElement = () => document.createElement('h2'))
    : TypedHTML<HTMLHeadingElement, T> {
    return build(factory, contents);
  },
  h3
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadingElement = () => document.createElement('h3'))
    : TypedHTML<HTMLHeadingElement, T> {
    return build(factory, contents);
  },
  h4
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadingElement = () => document.createElement('h4'))
    : TypedHTML<HTMLHeadingElement, T> {
    return build(factory, contents);
  },
  h5
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadingElement = () => document.createElement('h5'))
    : TypedHTML<HTMLHeadingElement, T> {
    return build(factory, contents);
  },
  h6
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadingElement = () => document.createElement('h6'))
    : TypedHTML<HTMLHeadingElement, T> {
    return build(factory, contents);
  },
  head
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadElement = () => document.createElement('head'))
    : TypedHTML<HTMLHeadElement, T> {
    return build(factory, contents);
  },
  hr
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLHRElement = () => document.createElement('hr'))
    : TypedHTML<HTMLHRElement, T> {
    return build(factory, contents);
  },
  html
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLHtmlElement = () => document.createElement('html'))
    : TypedHTML<HTMLHtmlElement, T> {
    return build(factory, contents);
  },
  i
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('i'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  iframe
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLIFrameElement = () => document.createElement('iframe'))
    : TypedHTML<HTMLIFrameElement, T> {
    return build(factory, contents);
  },
  img
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLImageElement = () => document.createElement('img'))
    : TypedHTML<HTMLImageElement, T> {
    return build(factory, contents);
  },
  input
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLInputElement = () => document.createElement('input'))
    : TypedHTML<HTMLInputElement, T> {
    return build(factory, contents);
  },
  ins
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLModElement = () => document.createElement('ins'))
    : TypedHTML<HTMLModElement, T> {
    return build(factory, contents);
  },
  isindex
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLIsIndexElement = () => document.createElement('isindex'))
    : TypedHTML<HTMLIsIndexElement, T> {
    return build(factory, contents);
  },
  kbd
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('kbd'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  keygen
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('keygen'))
    : TypedHTML<HTMLBlockElement, T> {
    return build(factory, contents);
  },
  label
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLLabelElement = () => document.createElement('label'))
    : TypedHTML<HTMLLabelElement, T> {
    return build(factory, contents);
  },
  legend
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLLegendElement = () => document.createElement('legend'))
    : TypedHTML<HTMLLegendElement, T> {
    return build(factory, contents);
  },
  li
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLLIElement = () => document.createElement('li'))
    : TypedHTML<HTMLLIElement, T> {
    return build(factory, contents);
  },
  link
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLLinkElement = () => document.createElement('link'))
    : TypedHTML<HTMLLinkElement, T> {
    return build(factory, contents);
  },
  listing
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('listing'))
    : TypedHTML<HTMLBlockElement, T> {
    return build(factory, contents);
  },
  map
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLMapElement = () => document.createElement('map'))
    : TypedHTML<HTMLMapElement, T> {
    return build(factory, contents);
  },
  marquee
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLMarqueeElement = () => document.createElement('marquee'))
    : TypedHTML<HTMLMarqueeElement, T> {
    return build(factory, contents);
  },
  menu
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLMenuElement = () => document.createElement('menu'))
    : TypedHTML<HTMLMenuElement, T> {
    return build(factory, contents);
  },
  meta
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLMetaElement = () => document.createElement('meta'))
    : TypedHTML<HTMLMetaElement, T> {
    return build(factory, contents);
  },
  nextid
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLNextIdElement = () => document.createElement('nextid'))
    : TypedHTML<HTMLNextIdElement, T> {
    return build(factory, contents);
  },
  nobr
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('nobr'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  object
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLObjectElement = () => document.createElement('object'))
    : TypedHTML<HTMLObjectElement, T> {
    return build(factory, contents);
  },
  ol
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLOListElement = () => document.createElement('ol'))
    : TypedHTML<HTMLOListElement, T> {
    return build(factory, contents);
  },
  optgroup
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLOptGroupElement = () => document.createElement('optgroup'))
    : TypedHTML<HTMLOptGroupElement, T> {
    return build(factory, contents);
  },
  option
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLOptionElement = () => document.createElement('option'))
    : TypedHTML<HTMLOptionElement, T> {
    return build(factory, contents);
  },
  p
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLParagraphElement = () => document.createElement('p'))
    : TypedHTML<HTMLParagraphElement, T> {
    return build(factory, contents);
  },
  param
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLParamElement = () => document.createElement('param'))
    : TypedHTML<HTMLParamElement, T> {
    return build(factory, contents);
  },
  picture
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPictureElement = () => document.createElement('picture'))
    : TypedHTML<HTMLPictureElement, T> {
    return build(factory, contents);
  },
  plaintext
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('plaintext'))
    : TypedHTML<HTMLBlockElement, T> {
    return build(factory, contents);
  },
  pre
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPreElement = () => document.createElement('pre'))
    : TypedHTML<HTMLPreElement, T> {
    return build(factory, contents);
  },
  progress
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLProgressElement = () => document.createElement('progress'))
    : TypedHTML<HTMLProgressElement, T> {
    return build(factory, contents);
  },
  q
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLQuoteElement = () => document.createElement('q'))
    : TypedHTML<HTMLQuoteElement, T> {
    return build(factory, contents);
  },
  rt
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('rt'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  ruby
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('ruby'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  s
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('s'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  samp
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('samp'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  script
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLScriptElement = () => document.createElement('script'))
    : TypedHTML<HTMLScriptElement, T> {
    return build(factory, contents);
  },
  select
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLSelectElement = () => document.createElement('select'))
    : TypedHTML<HTMLSelectElement, T> {
    return build(factory, contents);
  },
  small
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('small'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  source
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLSourceElement = () => document.createElement('source'))
    : TypedHTML<HTMLSourceElement, T> {
    return build(factory, contents);
  },
  span
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLSpanElement = () => document.createElement('span'))
    : TypedHTML<HTMLSpanElement, T> {
    return build(factory, contents);
  },
  strike
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('strike'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  strong
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('strong'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  style
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLStyleElement = () => document.createElement('style'))
    : TypedHTML<HTMLStyleElement, T> {
    return build(factory, contents);
  },
  sub
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('sub'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  sup
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('sup'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  table
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableElement = () => document.createElement('table'))
    : TypedHTML<HTMLTableElement, T> {
    return build(factory, contents);
  },
  tbody
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableSectionElement = () => document.createElement('tbody'))
    : TypedHTML<HTMLTableSectionElement, T> {
    return build(factory, contents);
  },
  td
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableDataCellElement = () => document.createElement('td'))
    : TypedHTML<HTMLTableDataCellElement, T> {
    return build(factory, contents);
  },
  textarea
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTextAreaElement = () => document.createElement('textarea'))
    : TypedHTML<HTMLTextAreaElement, T> {
    return build(factory, contents);
  },
  tfoot
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableSectionElement = () => document.createElement('tfoot'))
    : TypedHTML<HTMLTableSectionElement, T> {
    return build(factory, contents);
  },
  th
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableHeaderCellElement = () => document.createElement('th'))
    : TypedHTML<HTMLTableHeaderCellElement, T> {
    return build(factory, contents);
  },
  thead
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableSectionElement = () => document.createElement('thead'))
    : TypedHTML<HTMLTableSectionElement, T> {
    return build(factory, contents);
  },
  title
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTitleElement = () => document.createElement('title'))
    : TypedHTML<HTMLTitleElement, T> {
    return build(factory, contents);
  },
  tr
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableRowElement = () => document.createElement('tr'))
    : TypedHTML<HTMLTableRowElement, T> {
    return build(factory, contents);
  },
  track
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTrackElement = () => document.createElement('track'))
    : TypedHTML<HTMLTrackElement, T> {
    return build(factory, contents);
  },
  tt
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('tt'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  u
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('u'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  ul
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLUListElement = () => document.createElement('ul'))
    : TypedHTML<HTMLUListElement, T> {
    return build(factory, contents);
  },
  var
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('var'))
    : TypedHTML<HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  video
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLVideoElement = () => document.createElement('video'))
    : TypedHTML<HTMLVideoElement, T> {
    return build(factory, contents);
  },
  xmp
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('xmp'))
    : TypedHTML<HTMLBlockElement, T> {
    return build(factory, contents);
  },
  article
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLElement = () => document.createElement('article'))
    : TypedHTML<HTMLElement, T> {
    return build(factory, contents);
  },
  aside
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLElement = () => document.createElement('aside'))
    : TypedHTML<HTMLElement, T> {
    return build(factory, contents);
  },
  nav
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLElement = () => document.createElement('nav'))
    : TypedHTML<HTMLElement, T> {
    return build(factory, contents);
  },
  section
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLElement = () => document.createElement('section'))
    : TypedHTML<HTMLElement, T> {
    return build(factory, contents);
  },
  untyped
    <T extends TypedHTMLContents<HTMLElement>, U extends HTMLElement>
    (contents: T, factory: () => U)
    : TypedHTML<U, T> {
    return build(factory, contents);
  }
};
