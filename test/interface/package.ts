import def, { TypedHTML, unique, bind, once, delegate } from '../../index';

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

  describe('unique', function () {
    it('unique', function () {
      assert(typeof unique === 'function');
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
