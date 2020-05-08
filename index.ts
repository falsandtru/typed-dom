import 'spica/global';

export { Shadow, HTML, SVG, API } from './src/builder';
export { El, proxy } from './src/proxy';
export { NS, shadow, frag, html, svg, text, element, define } from './src/util/dom';
export { listen, once, wait, delegate, bind, currentTarget } from './src/util/listener';
export { apply } from './src/util/query';

type ShadowHostElementTagName =
  | 'article'
  | 'aside'
  | 'blockquote'
  | 'body'
  | 'div'
  | 'footer'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'header'
  | 'main'
  | 'nav'
  | 'p'
  | 'section'
  | 'span';
type ShadowHostElementTagNameMap_ = {
  [P in Extract<ShadowHostElementTagName, keyof HTMLElementTagNameMap>]: HTMLElementTagNameMap[P];
};

declare global {
  interface ShadowHostElementTagNameMap extends ShadowHostElementTagNameMap_ {
  }
  interface HTMLElementTagNameMap extends ShadowHostElementTagNameMap {
  }
  interface ElementEventMap {
    'connect': Event;
    'disconnect': Event;
  }
}
