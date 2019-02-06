export { TypedHTML as default, TypedShadow, TypedHTML, TypedSVG, API } from './src/dom/builder';
export { ElInterface as El, proxy } from './src/dom/manager';
export { frag, shadow, html, svg, text, define } from './src/util/dom';
export * from './src/util/listener';

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
  interface SVGElementTagNameMap_ extends SVGElementTagNameMap {
  }
}
