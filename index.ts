export { TypedHTML as default, TypedHTML, TypedSVG, API } from './src/dom/builder';
export { ElInterface as El, proxy } from './src/dom/manager';
export { html, svg, text, frag, define } from './src/util/dom';
export * from './src/util/listener';

declare global {
  interface SVGElementTagNameMap_ extends SVGElementTagNameMap {
  }
}
