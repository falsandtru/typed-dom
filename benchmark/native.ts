import { benchmark } from './benchmark';

describe('Benchmark:', function () {
  const doc = document;

  describe('native', function () {
    it('appendChild', function (done) {
      benchmark('appendChild', () => {
        const el = doc.createElement('div');
        el.appendChild(doc.createElement('div'));
        el.appendChild(doc.createElement('div'));
        el.appendChild(doc.createElement('div'));
      }, done);
    });

    it('append', function (done) {
      benchmark('append', () => {
        const el = doc.createElement('div');
        el.append(doc.createElement('div'));
        el.append(doc.createElement('div'));
        el.append(doc.createElement('div'));
      }, done);
    });

    it('append spread', function (done) {
      benchmark('append spread', () => {
        const el = doc.createElement('div');
        el.append(...[
          doc.createElement('div'),
          doc.createElement('div'),
          doc.createElement('div'),
        ]);
      }, done);
    });

    it('replaceChildren spread', function (done) {
      benchmark('replaceChildren spread', () => {
        const el = doc.createElement('div');
        el.replaceChildren(...[
          doc.createElement('div'),
          doc.createElement('div'),
          doc.createElement('div'),
        ]);
      }, done);
    });

    it('prepend', function (done) {
      benchmark('prepend', () => {
        const el = doc.createElement('div');
        el.prepend(doc.createElement('div'));
        el.prepend(doc.createElement('div'));
        el.prepend(doc.createElement('div'));
      }, done);
    });

    it('insertBefore', function (done) {
      benchmark('insertBefore', () => {
        const el = doc.createElement('div');
        el.insertBefore(doc.createElement('div'), null);
        el.insertBefore(doc.createElement('div'), null);
        el.insertBefore(doc.createElement('div'), null);
      }, done);
    });

  });

});
