import def, { TypedHTML, bind, once, delegate } from '../../index';

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

  });

  describe('dom', function () {
    it('bind', function () {
      assert(typeof bind === 'function');
    });

    it('once', function () {
      assert(typeof once === 'function');
    });

    it('delegate', function () {
      assert(typeof delegate === 'function');
    });

  });

});
