import { shadow, html, svg, frag, define } from './dom';
import { HTML, SVG } from '../dom/builder';

describe('Unit: util/dom', () => {
  describe('shadow', () => {
    it('', () => {
      assert(shadow(html('section')).mode === 'closed');
      assert(shadow(html('section'), { mode: 'open' }).mode === 'open');
      assert(shadow(html('section')).innerHTML === '');
      assert(shadow(html('section'), 'a').innerHTML === 'a');
      assert(shadow(html('section'), [html('p', 'a')]).innerHTML === '<p>a</p>');
    });

  });

  describe('html', () => {
    it('', () => {
      assert(html('a').outerHTML === HTML.a().element.outerHTML);
      assert(html('a', { class: 'test' }).outerHTML === HTML.a({ class: 'test' }).element.outerHTML);
      assert(html('a', { class: 'test' }, 'b').outerHTML === HTML.a({ class: 'test' }, 'b').element.outerHTML);
      assert(html('a', 'b').outerHTML === HTML.a('b').element.outerHTML);
    });

  });

  describe('svg', () => {
    it('', () => {
      assert(svg('a').outerHTML === SVG.a().element.outerHTML);
      assert(svg('a', { class: 'test' }).outerHTML === SVG.a({ class: 'test' }).element.outerHTML);
      assert(svg('a', { class: 'test' }, 'b').outerHTML === SVG.a({ class: 'test' }, 'b').element.outerHTML);
      assert(svg('a', 'b').outerHTML === SVG.a('b').element.outerHTML);
    });

  });

  describe('frag', () => {
    function stringify(frag: DocumentFragment): string {
      return [...frag.childNodes].reduce((acc, node) => acc + (node instanceof Element ? node.outerHTML : node.textContent), '');
    }

    it('', () => {
      assert(stringify(frag('a')) === 'a');
    });

  });

  describe('define', () => {
    it('', () => {
      assert(define(html('html'), []).innerHTML === '');
      assert(define(define(html('a', { href: '' })), { href: null }).matches(':not([href])'));
    });

  });

});
