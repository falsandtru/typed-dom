import { benchmark } from './benchmark';
import { html } from '../src/util/dom';
import { querySelectorAll, querySelectorWith, querySelectorAllWith } from '../src/util/query';

describe('Benchmark:', function () {
  const el = html('div', [html('a'), html('a'), html('a')]);

  describe('querySelector', function () {
    it('querySelector', function (done) {
      benchmark('querySelector', () => el.querySelector('a'), done);
    });

    it('querySelectorWith', function (done) {
      benchmark('querySelectorWith', () => querySelectorWith(el, 'a'), done);
    });

  });

  describe('querySelectorAll', function () {
    it('querySelectorAll', function (done) {
      benchmark('querySelectorAll', () => el.querySelectorAll('a'), done);
    });

    it('querySelectorAllWith', function (done) {
      benchmark('querySelectorAllWith', () => querySelectorAllWith(el, 'a'), done);
    });

  });

  describe('querySelectorAll', function () {
    for (const length of [1, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6]) {
      const el = html('div');
      for (let i = 0; i < length; ++i) el.appendChild(html('div'));

      it(`native for    ${length.toLocaleString('en')}`, function (done) {
        benchmark(`querySelectorAll native for    ${length.toLocaleString('en')}`, () => {
          for (let es = el.querySelectorAll('a'), i = 0, len = es.length; i < len; ++i) {
            es[i];
          }
        }, done);
      });

      it(`custom for    ${length.toLocaleString('en')}`, function (done) {
        benchmark(`querySelectorAll custom for    ${length.toLocaleString('en')}`, () => {
          for (let es = querySelectorAll(el, 'a'), i = 0, len = es.length; i < len; ++i) {
            es[i];
          }
        }, done);
      });

      it(`native for-of ${length.toLocaleString('en')}`, function (done) {
        benchmark(`querySelectorAll native for-of ${length.toLocaleString('en')}`, () => {
          for (const e of el.querySelectorAll('div')) e;
        }, done);
      });

      it(`custom for-of ${length.toLocaleString('en')}`, function (done) {
        benchmark(`querySelectorAll custom for-of ${length.toLocaleString('en')}`, () => {
          for (const e of querySelectorAll(el, 'div')) e;
        }, done);
      });
    }
  });

});
