import TypedHTML, {
  TypedHTMLContents
} from 'typed-dom';

describe('Interface: Package', function () {
  describe('TypedHTML', function () {
    it('TypedHTML', function () {
      assert(typeof TypedHTML === 'object');
    });

  });

  describe('power-assert', function () {
    it('assertion self-check', function (done) {
      setTimeout(function () {
        try {
          console.log(assert(false === true), assert); // LOG: undefined, function powerAssert() { ... }
        }
        catch (e) {
          done();
          return;
        }
        throw new Error('WARNING!: assert function does not work.');
      }, 1);
    });

  });

});
