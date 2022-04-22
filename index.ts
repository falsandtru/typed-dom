import 'spica/global';

export { Shadow, HTML, SVG, API } from './src/builder';
export { El, proxy } from './src/proxy';
export { NS, shadow, frag, html, svg, text, element, define, defrag } from './src/util/dom';
export { listen, delegate, bind, once, wait, currentTarget } from './src/util/listener';
export { apply } from './src/util/query';
export { identity } from './src/util/identity';

declare global {
  interface ShadowHostElementTagNameMap {
    'article': HTMLElement;
    'aside': HTMLElement;
    'blockquote': HTMLQuoteElement;
    'body': HTMLBodyElement;
    'div': HTMLDivElement;
    'footer': HTMLElement;
    'h1': HTMLHeadingElement;
    'h2': HTMLHeadingElement;
    'h3': HTMLHeadingElement;
    'h4': HTMLHeadingElement;
    'h5': HTMLHeadingElement;
    'h6': HTMLHeadingElement;
    'header': HTMLElement;
    'main': HTMLElement;
    'nav': HTMLElement;
    'p': HTMLParagraphElement;
    'section': HTMLElement;
    'span': HTMLSpanElement;
  }
  interface HTMLElementTagNameMap extends ShadowHostElementTagNameMap {
  }
  interface ElementEventMap {
    'connect': Event;
    'disconnect': Event;
  }
}
