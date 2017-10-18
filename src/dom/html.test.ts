import { tags } from './html';

describe('Unit: dom/html', function () {
  describe('tags', function () {
    it('', function () {
      assert((): keyof ElementTagNameMap => '' as keyof typeof tags);
      assert((): keyof typeof tags => '' as keyof ElementTagNameMap);
    });

  });

});
