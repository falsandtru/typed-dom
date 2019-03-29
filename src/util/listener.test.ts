import { bind, delegate, listen, once, wait, currentTargets } from './listener';
import { Shadow, HTML } from '../dom/builder';

describe('Unit: util/listener', () => {
  describe('bind', () => {
    it('click', done => {
      let cnt = 0;
      const a = HTML.a().element;
      bind(a, 'click', ev => {
        assert(ev instanceof Event);
        assert(currentTargets.get(ev) instanceof HTMLAnchorElement);
        ++cnt;
        bind(a, 'click', () => void assert(cnt === 2 && ++cnt) || done());
      });
      document.createDocumentFragment().appendChild(a);
      a.click();
      a.click();
    });

  });

  describe('delegate', () => {
    it('click', done => {
      let cnt = 0;
      const dom = HTML.p([HTML.a()]);
      delegate(dom.element, 'a', 'click', ev => {
        assert(ev instanceof Event);
        assert(currentTargets.get(ev) instanceof HTMLAnchorElement);
        ++cnt;
        delegate(dom.element, 'a', 'click', () => void assert(cnt === 2 && ++cnt) || done());
      });
      document.createDocumentFragment().appendChild(dom.element);
      dom.children = [HTML.a()];
      dom.children[0].element.click();
      dom.children = [HTML.a()];
      dom.children[0].element.click();
    });

  });

  describe('listen', () => {
    it('bind', done => {
      let cnt = 0;
      const a = HTML.a().element;
      listen(a, 'click', ev => {
        assert(ev instanceof Event);
        assert(currentTargets.get(ev) instanceof HTMLAnchorElement);
        ++cnt;
        listen(a, 'click', () => void assert(cnt === 2 && ++cnt) || done());
      });
      document.createDocumentFragment().appendChild(a);
      a.click();
      a.click();
    });

    it('delegate', done => {
      let cnt = 0;
      const dom = Shadow.section([HTML.a()]);
      listen(dom.element, 'a', 'click', ev => {
        assert(ev instanceof Event);
        assert(currentTargets.get(ev) instanceof HTMLAnchorElement);
        ++cnt;
        listen(dom.element, 'a', 'click', () => void assert(cnt === 2 && ++cnt) || done());
      });
      document.createDocumentFragment().appendChild(dom.element);
      dom.children = [HTML.a()];
      dom.children[0].element.click();
      dom.children = [HTML.a()];
      dom.children[0].element.click();
    });

  });

  describe('once', () => {
    it('bind', done => {
      let cnt = 0;
      const a = HTML.a().element;
      once(a, 'click', ev => {
        assert(ev instanceof Event);
        assert(currentTargets.get(ev) instanceof HTMLAnchorElement);
        assert(cnt === 0 && ++cnt);
        once(a, 'click', () => void assert(cnt === 1 && ++cnt) || done());
      });
      document.createDocumentFragment().appendChild(a);
      a.click();
      a.click();
    });

    it('delegate', done => {
      let cnt = 0;
      const dom = Shadow.section([HTML.a()]);
      once(dom.element, 'a', 'click', ev => {
        assert(ev instanceof Event);
        assert(currentTargets.get(ev) instanceof HTMLAnchorElement);
        assert(cnt === 0 && ++cnt);
        once(dom.element, 'click', () => void assert(cnt === 1 && ++cnt) || done());
      });
      document.createDocumentFragment().appendChild(dom.element);
      dom.children[0].element.click();
      dom.children[0].element.click();
    });

  });

  describe('wait', () => {
    it('bind', done => {
      const a = HTML.a().element;
      wait(a, 'click').then(ev => {
        assert(ev instanceof Event);
        assert(currentTargets.get(ev) instanceof HTMLAnchorElement);
        done();
      });
      document.createDocumentFragment().appendChild(a);
      a.click();
    });

    it('delegate', done => {
      const dom = Shadow.section([HTML.a()]);
      wait(dom.element, 'a', 'click').then(ev => {
        assert(ev instanceof Event);
        assert(currentTargets.get(ev) instanceof HTMLAnchorElement);
        done();
      });
      document.createDocumentFragment().appendChild(dom.element);
      dom.children[0].element.click();
    });

  });

});
