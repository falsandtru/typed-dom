import { Shadow, HTML, SVG, API, NS, shadow, frag, html, svg, text, element, define, defrag, listen, once, wait, bind, delegate, currentTarget, apply, identity } from '../../index';

describe('Interface: Package', function () {
  describe('Typed', function () {
    it('Shadow', function () {
      assert(typeof Shadow === 'function');
    });

    it('HTML', function () {
      assert(typeof HTML === 'function');
    });

    it('SVG', function () {
      assert(typeof SVG === 'function');
    });

    it('API', function () {
      assert((): API<HTMLElementTagNameMap> => HTML);
      assert((): typeof HTML => API(html));
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

    it('text', function () {
      assert(typeof text === 'function');
    });

    it('element', function () {
      assert(typeof element === 'function');
    });

    it('define', function () {
      assert(typeof define === 'function');
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

    it('wait', function () {
      assert(typeof wait === 'function');
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

    it('apply', function () {
      assert(typeof apply === 'function');
    });

    it('identity', function () {
      assert(typeof identity === 'function');
    });

  });

});
