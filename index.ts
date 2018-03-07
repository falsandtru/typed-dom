export { TypedHTML as default, TypedHTML, TypedSVG } from './src/dom/builder';
export * from './src/util/dom';
export * from './src/util/listener';

declare global {
  interface SVGElementTagNameMap_ extends SVGElementTagNameMap {
  }
}
