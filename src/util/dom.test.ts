import {
  html,
  svg,
  bind,
  delegate,
  once,
  listen,
  currentTargets,
} from './dom';
import { TypedHTML, TypedSVG } from '../dom/builder';

describe('Unit: util/dom', () => {
  describe('html', () => {
    it('', () => {
      assert(html('a').outerHTML === TypedHTML.a().element.outerHTML);
      assert(html('a', { class: 'test' }).outerHTML === TypedHTML.a({ class: 'test' }).element.outerHTML);
      assert(html('a', { class: 'test' }, 'b').outerHTML === TypedHTML.a({ class: 'test' }, 'b').element.outerHTML);
      assert(html('a', 'b').outerHTML === TypedHTML.a('b').element.outerHTML);
    });

  });

  describe('svg', () => {
    it('', () => {
      assert(svg('a').outerHTML === TypedSVG.a().element.outerHTML);
      assert(svg('a', { class: 'test' }).outerHTML === TypedSVG.a({ class: 'test' }).element.outerHTML);
      assert(svg('a', { class: 'test' }, 'b').outerHTML === TypedSVG.a({ class: 'test' }, 'b').element.outerHTML);
      assert(svg('a', 'b').outerHTML === TypedSVG.a('b').element.outerHTML);
    });

  });

  describe('bind', () => {
    it('click', done => {
      let cnt = 0;
      const a = TypedHTML.a().element;
      bind(a, 'click', ev => {
        assert(ev instanceof Event);
        assert(currentTargets.get(ev) instanceof HTMLAnchorElement);
        ++cnt;
        bind(a, 'click', () => assert(cnt === 2 && ++cnt) || done());
      });
      document.createDocumentFragment().appendChild(a);
      a.click();
      a.click();
    });

  });

  describe('delegate', () => {
    it('click', done => {
      let cnt = 0;
      const dom = TypedHTML.p([TypedHTML.a()]);
      delegate(dom.element, 'a', 'click', ev => {
        assert(ev instanceof Event);
        assert(currentTargets.get(ev) instanceof HTMLAnchorElement);
        ++cnt;
        delegate(dom.element, 'a', 'click', () => assert(cnt === 2 && ++cnt) || done());
      });
      document.createDocumentFragment().appendChild(dom.element);
      dom.children = [TypedHTML.a()];
      dom.children[0].element.click();
      dom.children = [TypedHTML.a()];
      dom.children[0].element.click();
    });

  });

  describe('listen', () => {
    it('bind', done => {
      let cnt = 0;
      const a = TypedHTML.a().element;
      listen(a, 'click', ev => {
        assert(ev instanceof Event);
        assert(currentTargets.get(ev) instanceof HTMLAnchorElement);
        ++cnt;
        listen(a, 'click', () => assert(cnt === 2 && ++cnt) || done());
      });
      document.createDocumentFragment().appendChild(a);
      a.click();
      a.click();
    });

    it('delegate', done => {
      let cnt = 0;
      const dom = TypedHTML.p([TypedHTML.a()]);
      listen(dom.element, 'a', 'click', ev => {
        assert(ev instanceof Event);
        assert(currentTargets.get(ev) instanceof HTMLAnchorElement);
        ++cnt;
        listen(dom.element, 'a', 'click', () => assert(cnt === 2 && ++cnt) || done());
      });
      document.createDocumentFragment().appendChild(dom.element);
      dom.children = [TypedHTML.a()];
      dom.children[0].element.click();
      dom.children = [TypedHTML.a()];
      dom.children[0].element.click();
    });

  });

  describe('once', () => {
    it('bind', done => {
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

    it('delegate', done => {
      let cnt = 0;
      const dom = TypedHTML.p([TypedHTML.a()]);
      once(dom.element, 'a', 'click', ev => {
        assert(ev instanceof Event);
        assert(currentTargets.get(ev) instanceof HTMLAnchorElement);
        assert(cnt === 0 && ++cnt);
        once(dom.element, 'click', () => assert(cnt === 1 && ++cnt) || done());
      });
      document.createDocumentFragment().appendChild(dom.element);
      dom.children[0].element.click();
      dom.children[0].element.click();
    });

  });

});
