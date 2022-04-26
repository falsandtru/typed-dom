import { benchmark } from './benchmark';
import { html } from '../src/util/dom';
import { querySelector, querySelectorAll } from '../src/util/query';

describe('Benchmark:', function () {
  this.timeout(30 * 1e3);

  const el = html('div', [html('a'), html('a'), html('a')]);

  describe('querySelector', function () {
    it('native', function (done) {
      benchmark('querySelector native', () => el.querySelector('a'), done);
    });

    it('custom', function (done) {
      benchmark('querySelector custom', () => querySelector(el, 'a'), done);
    });

  });

  describe('querySelectorAll', function () {
    it('native', function (done) {
      benchmark('querySelectorAll native', () => el.querySelectorAll('a'), done);
    });

    it('custom', function (done) {
      benchmark('querySelectorAll custom', () => querySelectorAll(el, 'a'), done);
    });

  });

});
