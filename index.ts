﻿export { TypedHTML as default, TypedHTML, TypedSVG } from './src/dom/builder';
export { html, svg, text, frag, observe } from './src/util/dom';
export * from './src/util/listener';

declare global {
  interface SVGElementTagNameMap_ extends SVGElementTagNameMap {
  }
}
