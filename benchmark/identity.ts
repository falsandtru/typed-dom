import { benchmark } from './benchmark';
import { identity } from '../src/util/identity';

describe('Benchmark:', function () {
  describe('identity', function () {
    it(``, function (done) {
      benchmark(`identity`, () => identity(), done);
    });

  });

});
