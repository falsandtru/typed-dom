export { TypedHTML as default, TypedHTML, TypedSVG } from './src/dom/builder';
export * from './src/util/dom';

declare global {
  interface SVGElementTagNameMap_ extends SVGElementTagNameMap {
  }
}
