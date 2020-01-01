import 'spica/global';

export { Shadow, HTML, SVG, API } from './src/dom/builder';
export { El, proxy } from './src/dom/proxy';
export { frag, shadow, html, svg, text, define } from './src/util/dom';
export { listen, once, wait, delegate, bind, currentTarget } from './src/util/listener';
export { apply } from './src/util/query';

type ShadowRootElementTagName =
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
type ShadowRootElementTagNameMap_ = {
  [P in Extract<ShadowRootElementTagName, keyof HTMLElementTagNameMap>]: HTMLElementTagNameMap[P];
};

declare global {
  interface ShadowHostElementTagNameMap extends ShadowRootElementTagNameMap_ {
  }
  interface HTMLElementTagNameMap extends ShadowHostElementTagNameMap {
  }
  interface ElementEventMap {
    'connect': Event;
    'disconnect': Event;
  }
}
