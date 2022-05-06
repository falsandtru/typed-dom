import { bind, delegate, listen, once, wait, currentTarget } from './listener';
import { Shadow, HTML } from '../builder';

describe('Unit: util/listener', () => {
  describe('bind', () => {
    it('click', done => {
      let cnt = 0;
      const el = HTML.a().element;
      bind(el, 'click', ev => {
        assert(ev instanceof Event);
        assert(ev[currentTarget] === ev.currentTarget);
        ++cnt;
        bind(el, 'click', () => void assert(cnt === 2 && ++cnt) || done());
      });
      document.createDocumentFragment().appendChild(el);
      el.click();
      el.click();
    });

  });

  describe('delegate', () => {
    it('click', done => {
      let cnt = 0;
      const dom = HTML.p([HTML.a()]);
      delegate(dom.element, 'a', 'click', ev => {
        assert(ev instanceof Event);
        assert(ev[currentTarget] === ev.currentTarget);
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
      const el = HTML.a().element;
      listen(el, 'click', ev => {
        assert(ev instanceof Event);
        assert(ev[currentTarget] === ev.currentTarget);
        ++cnt;
        listen(el, 'click', () => void assert(cnt === 2 && ++cnt) || done());
      });
      document.createDocumentFragment().appendChild(el);
      el.click();
      el.click();
    });

    it('delegate', done => {
      let cnt = 0;
      const dom = Shadow.section([HTML.a()]);
      listen(dom.element, 'a', 'click', ev => {
        assert(ev instanceof Event);
        assert(ev[currentTarget] === ev.currentTarget);
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
      const el = HTML.a().element;
      once(el, 'click', ev => {
        assert(ev instanceof Event);
        assert(ev[currentTarget] === ev.currentTarget);
        assert(cnt === 0 && ++cnt);
        once(el, 'click', () => void assert(cnt === 1 && ++cnt) || done());
      });
      document.createDocumentFragment().appendChild(el);
      el.click();
      el.click();
    });

    it('delegate', done => {
      let cnt = 0;
      const dom = Shadow.section([HTML.a()]);
      once(dom.element, 'a', 'click', ev => {
        assert(ev instanceof Event);
        assert(ev[currentTarget] === ev.currentTarget);
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
      const el = HTML.a().element;
      wait(el, 'click').then(ev => {
        assert(ev instanceof Event);
        assert(ev[currentTarget] === ev.currentTarget);
        done();
      });
      document.createDocumentFragment().appendChild(el);
      el.click();
    });

    it('delegate', done => {
      const dom = Shadow.section([HTML.a()]);
      wait(dom.element, 'a', 'click').then(ev => {
        assert(ev instanceof Event);
        assert(ev[currentTarget] === ev.currentTarget);
        done();
      });
      document.createDocumentFragment().appendChild(dom.element);
      dom.children[0].element.click();
    });

  });

});
