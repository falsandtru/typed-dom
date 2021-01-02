import { benchmark } from './benchmark';
import { html } from '../';

describe('Benchmark:', function () {
  this.timeout(10 * 1e3);

  describe('appendChild', function () {
    function f(len: number) {
      const children = [...Array(len)].map(() => html('div'));
      return () => {
        const el = html('div');
        for (let i = 0; i < len; ++i) {
          el.appendChild(children[i]);
        }
      };
    }

    it('1', function (done) {
      benchmark('appendChild 1', f(1), done);
    });

    it('10', function (done) {
      benchmark('appendChild 10', f(10), done);
    });

    it('100', function (done) {
      benchmark('appendChild 100', f(100), done);
    });

  });

  describe('append for', function () {
    function f(len: number) {
      const children = [...Array(len)].map(() => html('div'));
      return () => {
        const el = html('div');
        for (let i = 0; i < len; ++i) {
          el.append(children[i]);
        }
      };
    }

    it('1', function (done) {
      benchmark('append for 1', f(1), done);
    });

    it('10', function (done) {
      benchmark('append for 10', f(10), done);
    });

    it('100', function (done) {
      benchmark('append for 100', f(100), done);
    });

  });

  describe('append spread', function () {
    function f(len: number) {
      const children = [...Array(len)].map(() => html('div'));
      return () => {
        const el = html('div');
        el.append(...children);
      };
    }

    it('1', function (done) {
      benchmark('append spread 1', f(1), done);
    });

    it('10', function (done) {
      benchmark('append spread 10', f(10), done);
    });

    it('100', function (done) {
      benchmark('append spread 100', f(100), done);
    });

  });

});
