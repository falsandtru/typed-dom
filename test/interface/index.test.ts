import {
  API, Shadow, HTML, SVG, Math, NS,
  shadow, frag, html, svg, math, text, element, define, append, prepend, defrag,
  listen, once, bind, delegate, currentTarget,
  querySelectorAll, querySelectorWith, querySelectorAllWith,
  scope,
} from '../../index';

describe('Interface: Package', function () {
  describe('Typed', function () {
    it('API', function () {
      assert((): API<HTMLElementTagNameMap> => HTML);
      assert((): typeof HTML => API(html));
    });

    it('Shadow', function () {
      assert(typeof Shadow === 'function');
    });

    it('HTML', function () {
      assert(typeof HTML === 'function');
    });

    it('SVG', function () {
      assert(typeof SVG === 'function');
    });

    it('Math', function () {
      assert(typeof Math === 'function');
    });

  });

  describe('Native', function () {
    it('NS', function () {
      assert(NS.HTML === 'HTML');
      assert(NS.SVG === 'SVG');
    });

    it('shadow', function () {
      assert(typeof shadow === 'function');
    });

    it('frag', function () {
      assert(typeof frag === 'function');
    });

    it('html', function () {
      assert(typeof html === 'function');
    });

    it('svg', function () {
      assert(typeof svg === 'function');
    });

    it('math', function () {
      assert(typeof math === 'function');
    });

    it('text', function () {
      assert(typeof text === 'function');
    });

    it('element', function () {
      assert(typeof element === 'function');
    });

    it('define', function () {
      assert(typeof define === 'function');
    });

    it('append', function () {
      assert(typeof append === 'function');
    });

    it('prepend', function () {
      assert(typeof prepend === 'function');
    });

    it('defrag', function () {
      assert(typeof defrag === 'function');
    });

    it('listen', function () {
      assert(typeof listen === 'function');
    });

    it('once', function () {
      assert(typeof once === 'function');
    });

    it('bind', function () {
      assert(typeof bind === 'function');
    });

    it('delegate', function () {
      assert(typeof delegate === 'function');
    });

    it('currentTarget', function () {
      assert(typeof currentTarget === 'symbol');
    });

    it('querySelectorAll', function () {
      assert(typeof querySelectorAll === 'function');
    });

    it('querySelectorWith', function () {
      assert(typeof querySelectorWith === 'function');
    });

    it('querySelectorAllWith', function () {
      assert(typeof querySelectorAllWith === 'function');
    });

    it('scope', function () {
      assert(typeof scope === 'function');
    });

  });

});
