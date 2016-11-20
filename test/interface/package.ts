import TypedHTML, { __esModule } from 'typed-dom';

declare module 'typed-dom' {
  export const __esModule: boolean | undefined;
}

describe('Interface: Package', function () {
  describe('module', function () {
    it('module', function () {
      assert(__esModule === true);
    });

  });

  describe('TypedHTML', function () {
    it('TypedHTML', function () {
      assert(typeof TypedHTML === 'object');
    });

  });

});
