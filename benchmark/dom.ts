import { benchmark } from './benchmark';
import { HTML, html } from '..';

describe('Benchmark:', function () {
  this.timeout(20 * 1e3);

  describe('create', function () {
    it('native', function (done) {
      const doc = document;
      benchmark('create native', () => doc.createElement('div'), done);
    });

    it('html', function (done) {
      benchmark('create html', () => html('div'), done);
    });

    it('HTML', function (done) {
      benchmark('create HTML', () => HTML.div(), done);
    });

  });

  describe('build', function () {
    it('native', function (done) {
      const doc = document;
      benchmark('build native', () => {
        const el = doc.createElement('div');
        el.appendChild(doc.createElement('div'));
        el.appendChild(doc.createElement('div'));
        el.appendChild(doc.createElement('div'));
      }, done);
    });

    it('html', function (done) {
      benchmark('build html', () => html('div', [html('div'), html('div'), html('div')]), done);
    });

    it('HTML array', function (done) {
      benchmark('build HTML array', () => HTML.div([HTML.div(), HTML.div(), HTML.div()]), done);
    });

    it('HTML struct', function (done) {
      benchmark('build HTML struct', () => HTML.div({ a: HTML.div(), b: HTML.div(), c: HTML.div() }), done);
    });

  });

  describe('set text', function () {
    it('native', function (done) {
      const el = document.createElement('div');
      let cnt = 0;
      benchmark('set text native', () => el.textContent = `${++cnt}`, done);
    });

    it('HTML', function (done) {
      const el = HTML.div('');
      let cnt = 0;
      benchmark('set text HTML', () => el.children = `${++cnt}`, done);
    });

  });

  describe('set node', function () {
    it('native', function (done) {
      const el = document.createElement('div');
      const nodes = [
        document.createElement('div'),
        document.createElement('div'),
      ];
      let cnt = 0;
      benchmark('set node native', () => el.replaceChildren(nodes[++cnt % 2]), done);
    });

    it('HTML array', function (done) {
      const el = HTML.div([]);
      const nodes = [
        HTML.div(),
        HTML.div(),
      ];
      let cnt = 0;
      benchmark('set node HTML array', () => el.children = [nodes[++cnt % 2]], done);
    });

    it('HTML struct', function (done) {
      const el = HTML.div({ a: HTML.div() });
      const nodes = [
        HTML.div(),
        HTML.div(),
      ];
      let cnt = 0;
      benchmark('set node HTML struct', () => el.children = { a: nodes[++cnt % 2] }, done);
    });

    it('HTML struct field', function (done) {
      const el = HTML.div({ a: HTML.div() });
      const nodes = [
        HTML.div(),
        HTML.div(),
      ];
      let cnt = 0;
      benchmark('set node HTML struct field', () => el.children.a = nodes[++cnt % 2], done);
    });

  });

  describe('traversal', function () {
    it('native', function (done) {
      const el = document.createElement('div');
      el.appendChild(document.createElement('div'));
      benchmark('traversal native', () => el.firstChild, done);
    });

    it('HTML array', function (done) {
      const el = HTML.div([HTML.div()]);
      benchmark('traversal HTML array', () => el.children[0], done);
    });

    it('HTML struct', function (done) {
      const el = HTML.div({ a: HTML.div() });
      benchmark('traversal HTML struct', () => el.children.a, done);
    });

  });

});
