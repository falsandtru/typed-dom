import { benchmark } from './benchmark';
import { html } from '../src/util/dom';
import { querySelectorAll, querySelectorWith, querySelectorAllWith } from '../src/util/query';

describe('Benchmark:', function () {
  const el = html('div', [html('a'), html('a'), html('a')]);

  describe('querySelectorWith', function () {
    it('native', function (done) {
      benchmark('querySelector', () => el.querySelector('a'), done);
    });

    it('custom', function (done) {
      benchmark('querySelectorWith', () => querySelectorWith(el, 'a'), done);
    });

  });

  describe('querySelectorAllWith', function () {
    it('native', function (done) {
      benchmark('querySelectorAll', () => el.querySelectorAll('a'), done);
    });

    it('custom', function (done) {
      benchmark('querySelectorAllWith', () => querySelectorAllWith(el, 'a'), done);
    });

  });

  describe('querySelectorAll', function () {
    it(`native for ${el.children.length}`, function (done) {
      benchmark(`querySelectorAll native for ${el.children.length}`, () => {
        for (let es = el.querySelectorAll('a'), i = 0, len = es.length; i < len; ++i) {
          es[i];
        }
      }, done);
    });

    it(`custom for ${el.children.length}`, function (done) {
      benchmark(`querySelectorAll custom for ${el.children.length}`, () => {
        for (let es = querySelectorAll(el, 'a'), i = 0, len = es.length; i < len; ++i) {
          es[i];
        }
      }, done);
    });

    it(`native for-of ${el.children.length}`, function (done) {
      benchmark(`querySelectorAll native for-of ${el.children.length}`, () => {
        for (const e of el.querySelectorAll('a')) e;
      }, done);
    });

    it(`custom for-of ${el.children.length}`, function (done) {
      benchmark(`querySelectorAll custom for-of ${el.children.length}`, () => {
        for (const e of querySelectorAll(el, 'a')) e;
      }, done);
    });

    for (const length of [1, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6]) {
      const el = html('div');
      for (let i = 0; i < length; ++i) el.appendChild(html('div'));

      it(`native ${length.toLocaleString('en')}`, function (done) {
        benchmark(`querySelectorAll native ${length.toLocaleString('en')}`, () => {
          for (const e of el.querySelectorAll('div')) e;
        }, done);
      });

      it(`custom ${length.toLocaleString('en')}`, function (done) {
        benchmark(`querySelectorAll custom ${length.toLocaleString('en')}`, () => {
          for (const e of querySelectorAll(el, 'div')) e;
        }, done);
      });
    }
  });

});
