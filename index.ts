export { TypedHTML as default, TypedHTML, TypedSVG } from './src/dom/html';
export * from './src/util/dom';

declare global {
  interface SVGElementTagNameMap_ extends SVGElementTagNameMap {
  }
}
