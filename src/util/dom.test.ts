import {
  bind,
  delegate,
  once
} from './dom';
import { TypedHTML } from '../dom/html';

describe('Unit: util/dom', () => {
  describe('bind', () => {
    it('click', done => {
      const a = TypedHTML.a().element;
      bind(a, 'click', ev => {
        assert(ev instanceof Event);
        bind(a, 'click', () => done());
      });
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
        delegate(dom.element, 'a', 'click', () => done());
      });
      document.createDocumentFragment().appendChild(dom.element);
      dom.children = [TypedHTML.a()];
      dom.children[0].element.click();
      dom.children = [TypedHTML.a()];
      dom.children[0].element.click();
    });

  });

  describe('once', () => {
    it('click', done => {
      const a = TypedHTML.a().element;
      let cnt = 0;
      once(a, 'click', ev => {
        assert(ev instanceof Event);
        assert(cnt === 0 && ++cnt);
        once(a, 'click', () => assert(cnt === 1 && ++cnt) || done());
      });
      document.createDocumentFragment().appendChild(a);
      a.click();
      a.click();
    });

  });

});
