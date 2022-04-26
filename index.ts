import 'spica/global';

export { API, Shadow, HTML, SVG } from './src/builder';
export { El } from './src/proxy';
export { NS, Attrs, Children, Factory, shadow, frag, html, svg, text, element, define, append, prepend, defrag } from './src/util/dom';
export { listen, delegate, bind, once, wait, currentTarget } from './src/util/listener';
export { apply } from './src/util/query';
export { identity } from './src/util/identity';

declare global {
  interface ElementEventMap {
    'connect': Event;
    'disconnect': Event;
  }
}
