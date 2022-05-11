import { benchmark } from './benchmark';
import { html } from '../src/util/dom';
import { querySelector, querySelectorAll } from '../src/util/query';

describe('Benchmark:', function () {
  this.timeout(30 * 1e3);

  if (navigator.userAgent.includes('Firefox')) return;

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

  describe('querySelectorAll loop', function () {
    it('native for-i', function (done) {
      benchmark('querySelectorAll loop native for-i', () => {
        for (let es = el.querySelectorAll('a'), i = 0, len = es.length; i < len; ++i) {
          es[i];
        }
      }, done);
    });

    it('custom for-i', function (done) {
      benchmark('querySelectorAll loop custom for-i', () => {
        for (let es = querySelectorAll(el, 'a'), i = 0, len = es.length; i < len; ++i) {
          es[i];
        }
      }, done);
    });

    it('native for-of', function (done) {
      benchmark('querySelectorAll loop native for-of', () => {
        for (const e of el.querySelectorAll('a')) {
          e;
        }
      }, done);
    });

    it('custom for-of', function (done) {
      benchmark('querySelectorAll loop custom for-of', () => {
        for (const e of querySelectorAll(el, 'a')) {
          e;
        }
      }, done);
    });

  });

});
