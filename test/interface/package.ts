import def, { TypedHTML, TypedSVG, html, svg, frag, text, listen, once, bind, delegate, currentTargets } from '../../index';

describe('Interface: Package', function () {
  describe('default', function () {
    it('default', function () {
      assert(def === TypedHTML);
    });

  });

  describe('TypedHTML', function () {
    it('TypedHTML', function () {
      assert(typeof TypedHTML === 'object');
    });

    it('TypedSVG', function () {
      assert(typeof TypedSVG === 'object');
    });

  });

  describe('dom', function () {
    it('html', function () {
      assert(typeof html === 'function');
    });

    it('svg', function () {
      assert(typeof svg === 'function');
    });

    it('frag', function () {
      assert(typeof frag === 'function');
    });

    it('text', function () {
      assert(typeof text === 'function');
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

    it('currentTargets', function () {
      assert(currentTargets instanceof WeakMap);
    });

  });

});
