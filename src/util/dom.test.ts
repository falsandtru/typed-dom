import {
  bind,
  delegate,
  once,
  currentTargets,
} from './dom';
import { TypedHTML } from '../dom/html';

describe('Unit: util/dom', () => {
  describe('bind', () => {
    it('click', done => {
      const a = TypedHTML.a().element;
      bind(a, 'click', ev => {
        assert(ev instanceof Event);
        assert(currentTargets.get(ev) instanceof HTMLAnchorElement);
        bind(a, 'click', () => done());
      });
      document.createDocumentFragment().appendChild(a);
      a.click();
      a.click();
    });

    it('once', done => {
      let cnt = 0;
      const a = TypedHTML.a().element;
      bind(a, 'click', ev => {
        assert(ev instanceof Event);
        assert(currentTargets.get(ev) instanceof HTMLAnchorElement);
        assert(cnt === 0 && ++cnt);
        once(a, 'click', () => assert(cnt === 1 && ++cnt) || done());
      }, { once: true });
      document.createDocumentFragment().appendChild(a);
      a.click();
      a.click();
    });

  });

  describe('delegate', () => {
    it('click', done => {
      const dom = TypedHTML.div([TypedHTML.a()]);
      delegate(dom.element, 'a', 'click', ev => {
        assert(ev instanceof Event);
        assert(currentTargets.get(ev) instanceof HTMLAnchorElement);
        delegate(dom.element, 'a', 'click', () => done());
      });
      document.createDocumentFragment().appendChild(dom.element);
      dom.children = [TypedHTML.a()];
      dom.children[0].element.click();
      dom.children = [TypedHTML.a()];
      dom.children[0].element.click();
    });

    it('once', done => {
      let cnt = 0;
      const dom = TypedHTML.div([TypedHTML.a()]);
      delegate(dom.element, 'a', 'click', ev => {
        assert(ev instanceof Event);
        assert(currentTargets.get(ev) instanceof HTMLAnchorElement);
        assert(cnt === 0 && ++cnt);
        delegate(dom.element, 'a', 'click', () => assert(cnt === 1 && ++cnt) || done());
      }, { once: true });
      document.createDocumentFragment().appendChild(dom.element);
      dom.children = [TypedHTML.a()];
      dom.children[0].element.click();
      dom.children = [TypedHTML.a()];
      dom.children[0].element.click();
    });

  });

  describe('once', () => {
    it('click', done => {
      let cnt = 0;
      const a = TypedHTML.a().element;
      once(a, 'click', ev => {
        assert(ev instanceof Event);
        assert(currentTargets.get(ev) instanceof HTMLAnchorElement);
        assert(cnt === 0 && ++cnt);
        once(a, 'click', () => assert(cnt === 1 && ++cnt) || done());
      });
      document.createDocumentFragment().appendChild(a);
      a.click();
      a.click();
    });

  });

});
