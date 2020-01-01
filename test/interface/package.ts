import { Shadow, HTML, SVG, API, proxy, shadow, html, svg, text, frag, define, listen, once, wait, bind, delegate, currentTarget, apply } from '../../index';

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

    it('proxy', function () {
      assert(typeof proxy === 'function');
    });

  });

  describe('Native', function () {
    it('shadow', function () {
      assert(typeof shadow === 'function');
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

    it('frag', function () {
      assert(typeof frag === 'function');
    });

    it('define', function () {
      assert(typeof define === 'function');
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

  });

});
