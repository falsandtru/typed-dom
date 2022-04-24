import { benchmark } from './benchmark';

describe('Benchmark:', function () {
  this.timeout(30 * 1e3);

  const doc = document;

  describe('append', function () {
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

  });

});
