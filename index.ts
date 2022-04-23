import 'spica/global';

export { Shadow, HTML, SVG, API } from './src/builder';
export { El } from './src/proxy';
export { NS, shadow, frag, html, svg, text, element, define, defrag } from './src/util/dom';
export { listen, delegate, bind, once, wait, currentTarget } from './src/util/listener';
export { apply } from './src/util/query';
export { identity } from './src/util/identity';

declare global {
  interface ElementEventMap {
    'connect': Event;
    'disconnect': Event;
  }
}
