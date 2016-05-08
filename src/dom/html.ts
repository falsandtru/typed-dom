import {TypedHTML as ITypedHTML, TypedHTMLContents} from 'typed-dom';
import {build} from './builder';

export type TypedHTML<S extends string, T extends HTMLElement, U extends TypedHTMLContents<HTMLElement>> = ITypedHTML<S, T, U>;
export const TypedHTML = {
  a
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLAnchorElement = () => document.createElement('a'))
    : TypedHTML<string, HTMLAnchorElement, T> {
    return build(factory, contents);
  },
  abbr
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('abbr'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  acronym
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('acronym'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  address
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('address'))
    : TypedHTML<string, HTMLBlockElement, T> {
    return build(factory, contents);
  },
  applet
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLAppletElement = () => document.createElement('applet'))
    : TypedHTML<string, HTMLAppletElement, T> {
    return build(factory, contents);
  },
  area
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLAreaElement = () => document.createElement('area'))
    : TypedHTML<string, HTMLAreaElement, T> {
    return build(factory, contents);
  },
  audio
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLAudioElement = () => document.createElement('audio'))
    : TypedHTML<string, HTMLAudioElement, T> {
    return build(factory, contents);
  },
  b
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('b'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  base
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBaseElement = () => document.createElement('base'))
    : TypedHTML<string, HTMLBaseElement, T> {
    return build(factory, contents);
  },
  basefont
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBaseFontElement = () => document.createElement('basefont'))
    : TypedHTML<string, HTMLBaseFontElement, T> {
    return build(factory, contents);
  },
  bdo
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('bdo'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  big
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('big'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  blockquote
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('blockquote'))
    : TypedHTML<string, HTMLBlockElement, T> {
    return build(factory, contents);
  },
  body
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBodyElement = () => document.createElement('body'))
    : TypedHTML<string, HTMLBodyElement, T> {
    return build(factory, contents);
  },
  br
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBRElement = () => document.createElement('br'))
    : TypedHTML<string, HTMLBRElement, T> {
    return build(factory, contents);
  },
  button
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLButtonElement = () => document.createElement('button'))
    : TypedHTML<string, HTMLButtonElement, T> {
    return build(factory, contents);
  },
  canvas
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLCanvasElement = () => document.createElement('canvas'))
    : TypedHTML<string, HTMLCanvasElement, T> {
    return build(factory, contents);
  },
  caption
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableCaptionElement = () => document.createElement('caption'))
    : TypedHTML<string, HTMLTableCaptionElement, T> {
    return build(factory, contents);
  },
  center
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('center'))
    : TypedHTML<string, HTMLBlockElement, T> {
    return build(factory, contents);
  },
  cite
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('cite'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  code
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('code'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  col
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableColElement = () => document.createElement('col'))
    : TypedHTML<string, HTMLTableColElement, T> {
    return build(factory, contents);
  },
  colgroup
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableColElement = () => document.createElement('colgroup'))
    : TypedHTML<string, HTMLTableColElement, T> {
    return build(factory, contents);
  },
  datalist
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLDataListElement = () => document.createElement('datalist'))
    : TypedHTML<string, HTMLDataListElement, T> {
    return build(factory, contents);
  },
  dd
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLDDElement = () => document.createElement('dd'))
    : TypedHTML<string, HTMLDDElement, T> {
    return build(factory, contents);
  },
  del
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLModElement = () => document.createElement('del'))
    : TypedHTML<string, HTMLModElement, T> {
    return build(factory, contents);
  },
  dfn
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('dfn'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  dir
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLDirectoryElement = () => document.createElement('dir'))
    : TypedHTML<string, HTMLDirectoryElement, T> {
    return build(factory, contents);
  },
  div
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLDivElement = () => document.createElement('div'))
    : TypedHTML<string, HTMLDivElement, T> {
    return build(factory, contents);
  },
  dl
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLDListElement = () => document.createElement('dl'))
    : TypedHTML<string, HTMLDListElement, T> {
    return build(factory, contents);
  },
  dt
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLDTElement = () => document.createElement('dt'))
    : TypedHTML<string, HTMLDTElement, T> {
    return build(factory, contents);
  },
  em
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('em'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  embed
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLEmbedElement = () => document.createElement('embed'))
    : TypedHTML<string, HTMLEmbedElement, T> {
    return build(factory, contents);
  },
  fieldset
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLFieldSetElement = () => document.createElement('fieldset'))
    : TypedHTML<string, HTMLFieldSetElement, T> {
    return build(factory, contents);
  },
  font
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLFontElement = () => document.createElement('font'))
    : TypedHTML<string, HTMLFontElement, T> {
    return build(factory, contents);
  },
  form
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLFormElement = () => document.createElement('form'))
    : TypedHTML<string, HTMLFormElement, T> {
    return build(factory, contents);
  },
  frame
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLFrameElement = () => document.createElement('frame'))
    : TypedHTML<string, HTMLFrameElement, T> {
    return build(factory, contents);
  },
  frameset
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLFrameSetElement = () => document.createElement('frameset'))
    : TypedHTML<string, HTMLFrameSetElement, T> {
    return build(factory, contents);
  },
  h1
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadingElement = () => document.createElement('h1'))
    : TypedHTML<string, HTMLHeadingElement, T> {
    return build(factory, contents);
  },
  h2
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadingElement = () => document.createElement('h2'))
    : TypedHTML<string, HTMLHeadingElement, T> {
    return build(factory, contents);
  },
  h3
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadingElement = () => document.createElement('h3'))
    : TypedHTML<string, HTMLHeadingElement, T> {
    return build(factory, contents);
  },
  h4
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadingElement = () => document.createElement('h4'))
    : TypedHTML<string, HTMLHeadingElement, T> {
    return build(factory, contents);
  },
  h5
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadingElement = () => document.createElement('h5'))
    : TypedHTML<string, HTMLHeadingElement, T> {
    return build(factory, contents);
  },
  h6
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadingElement = () => document.createElement('h6'))
    : TypedHTML<string, HTMLHeadingElement, T> {
    return build(factory, contents);
  },
  head
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLHeadElement = () => document.createElement('head'))
    : TypedHTML<string, HTMLHeadElement, T> {
    return build(factory, contents);
  },
  hr
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLHRElement = () => document.createElement('hr'))
    : TypedHTML<string, HTMLHRElement, T> {
    return build(factory, contents);
  },
  html
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLHtmlElement = () => document.createElement('html'))
    : TypedHTML<string, HTMLHtmlElement, T> {
    return build(factory, contents);
  },
  i
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('i'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  iframe
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLIFrameElement = () => document.createElement('iframe'))
    : TypedHTML<string, HTMLIFrameElement, T> {
    return build(factory, contents);
  },
  img
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLImageElement = () => document.createElement('img'))
    : TypedHTML<string, HTMLImageElement, T> {
    return build(factory, contents);
  },
  input
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLInputElement = () => document.createElement('input'))
    : TypedHTML<string, HTMLInputElement, T> {
    return build(factory, contents);
  },
  ins
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLModElement = () => document.createElement('ins'))
    : TypedHTML<string, HTMLModElement, T> {
    return build(factory, contents);
  },
  isindex
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLIsIndexElement = () => document.createElement('isindex'))
    : TypedHTML<string, HTMLIsIndexElement, T> {
    return build(factory, contents);
  },
  kbd
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('kbd'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  keygen
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('keygen'))
    : TypedHTML<string, HTMLBlockElement, T> {
    return build(factory, contents);
  },
  label
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLLabelElement = () => document.createElement('label'))
    : TypedHTML<string, HTMLLabelElement, T> {
    return build(factory, contents);
  },
  legend
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLLegendElement = () => document.createElement('legend'))
    : TypedHTML<string, HTMLLegendElement, T> {
    return build(factory, contents);
  },
  li
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLLIElement = () => document.createElement('li'))
    : TypedHTML<string, HTMLLIElement, T> {
    return build(factory, contents);
  },
  link
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLLinkElement = () => document.createElement('link'))
    : TypedHTML<string, HTMLLinkElement, T> {
    return build(factory, contents);
  },
  listing
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('listing'))
    : TypedHTML<string, HTMLBlockElement, T> {
    return build(factory, contents);
  },
  map
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLMapElement = () => document.createElement('map'))
    : TypedHTML<string, HTMLMapElement, T> {
    return build(factory, contents);
  },
  marquee
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLMarqueeElement = () => document.createElement('marquee'))
    : TypedHTML<string, HTMLMarqueeElement, T> {
    return build(factory, contents);
  },
  menu
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLMenuElement = () => document.createElement('menu'))
    : TypedHTML<string, HTMLMenuElement, T> {
    return build(factory, contents);
  },
  meta
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLMetaElement = () => document.createElement('meta'))
    : TypedHTML<string, HTMLMetaElement, T> {
    return build(factory, contents);
  },
  nextid
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLNextIdElement = () => document.createElement('nextid'))
    : TypedHTML<string, HTMLNextIdElement, T> {
    return build(factory, contents);
  },
  nobr
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('nobr'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  object
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLObjectElement = () => document.createElement('object'))
    : TypedHTML<string, HTMLObjectElement, T> {
    return build(factory, contents);
  },
  ol
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLOListElement = () => document.createElement('ol'))
    : TypedHTML<string, HTMLOListElement, T> {
    return build(factory, contents);
  },
  optgroup
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLOptGroupElement = () => document.createElement('optgroup'))
    : TypedHTML<string, HTMLOptGroupElement, T> {
    return build(factory, contents);
  },
  option
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLOptionElement = () => document.createElement('option'))
    : TypedHTML<string, HTMLOptionElement, T> {
    return build(factory, contents);
  },
  p
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLParagraphElement = () => document.createElement('p'))
    : TypedHTML<string, HTMLParagraphElement, T> {
    return build(factory, contents);
  },
  param
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLParamElement = () => document.createElement('param'))
    : TypedHTML<string, HTMLParamElement, T> {
    return build(factory, contents);
  },
  picture
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPictureElement = () => document.createElement('picture'))
    : TypedHTML<string, HTMLPictureElement, T> {
    return build(factory, contents);
  },
  plaintext
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('plaintext'))
    : TypedHTML<string, HTMLBlockElement, T> {
    return build(factory, contents);
  },
  pre
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPreElement = () => document.createElement('pre'))
    : TypedHTML<string, HTMLPreElement, T> {
    return build(factory, contents);
  },
  progress
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLProgressElement = () => document.createElement('progress'))
    : TypedHTML<string, HTMLProgressElement, T> {
    return build(factory, contents);
  },
  q
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLQuoteElement = () => document.createElement('q'))
    : TypedHTML<string, HTMLQuoteElement, T> {
    return build(factory, contents);
  },
  rt
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('rt'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  ruby
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('ruby'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  s
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('s'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  samp
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('samp'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  script
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLScriptElement = () => document.createElement('script'))
    : TypedHTML<string, HTMLScriptElement, T> {
    return build(factory, contents);
  },
  select
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLSelectElement = () => document.createElement('select'))
    : TypedHTML<string, HTMLSelectElement, T> {
    return build(factory, contents);
  },
  small
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('small'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  source
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLSourceElement = () => document.createElement('source'))
    : TypedHTML<string, HTMLSourceElement, T> {
    return build(factory, contents);
  },
  span
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLSpanElement = () => document.createElement('span'))
    : TypedHTML<string, HTMLSpanElement, T> {
    return build(factory, contents);
  },
  strike
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('strike'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  strong
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('strong'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  style
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLStyleElement = () => document.createElement('style'))
    : TypedHTML<string, HTMLStyleElement, T> {
    return build(factory, contents);
  },
  sub
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('sub'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  sup
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('sup'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  table
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableElement = () => document.createElement('table'))
    : TypedHTML<string, HTMLTableElement, T> {
    return build(factory, contents);
  },
  tbody
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableSectionElement = () => document.createElement('tbody'))
    : TypedHTML<string, HTMLTableSectionElement, T> {
    return build(factory, contents);
  },
  td
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableDataCellElement = () => document.createElement('td'))
    : TypedHTML<string, HTMLTableDataCellElement, T> {
    return build(factory, contents);
  },
  textarea
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTextAreaElement = () => document.createElement('textarea'))
    : TypedHTML<string, HTMLTextAreaElement, T> {
    return build(factory, contents);
  },
  tfoot
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableSectionElement = () => document.createElement('tfoot'))
    : TypedHTML<string, HTMLTableSectionElement, T> {
    return build(factory, contents);
  },
  th
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableHeaderCellElement = () => document.createElement('th'))
    : TypedHTML<string, HTMLTableHeaderCellElement, T> {
    return build(factory, contents);
  },
  thead
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableSectionElement = () => document.createElement('thead'))
    : TypedHTML<string, HTMLTableSectionElement, T> {
    return build(factory, contents);
  },
  title
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTitleElement = () => document.createElement('title'))
    : TypedHTML<string, HTMLTitleElement, T> {
    return build(factory, contents);
  },
  tr
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTableRowElement = () => document.createElement('tr'))
    : TypedHTML<string, HTMLTableRowElement, T> {
    return build(factory, contents);
  },
  track
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLTrackElement = () => document.createElement('track'))
    : TypedHTML<string, HTMLTrackElement, T> {
    return build(factory, contents);
  },
  tt
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('tt'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  u
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('u'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  ul
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLUListElement = () => document.createElement('ul'))
    : TypedHTML<string, HTMLUListElement, T> {
    return build(factory, contents);
  },
  var
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLPhraseElement = () => document.createElement('var'))
    : TypedHTML<string, HTMLPhraseElement, T> {
    return build(factory, contents);
  },
  video
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLVideoElement = () => document.createElement('video'))
    : TypedHTML<string, HTMLVideoElement, T> {
    return build(factory, contents);
  },
  xmp
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLBlockElement = () => document.createElement('xmp'))
    : TypedHTML<string, HTMLBlockElement, T> {
    return build(factory, contents);
  },
  article
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLElement = () => document.createElement('article'))
    : TypedHTML<string, HTMLElement, T> {
    return build(factory, contents);
  },
  aside
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLElement = () => document.createElement('aside'))
    : TypedHTML<string, HTMLElement, T> {
    return build(factory, contents);
  },
  nav
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLElement = () => document.createElement('nav'))
    : TypedHTML<string, HTMLElement, T> {
    return build(factory, contents);
  },
  section
    <T extends TypedHTMLContents<HTMLElement>>
    (contents?: T, factory: () => HTMLElement = () => document.createElement('section'))
    : TypedHTML<string, HTMLElement, T> {
    return build(factory, contents);
  },
  untyped
    <T extends TypedHTMLContents<HTMLElement>, U extends HTMLElement>
    (contents: T, factory: () => U)
    : TypedHTML<string, U, T> {
    return build(factory, contents);
  }
};
