import { shadow, html, svg, text, frag, define } from './dom';
import { HTML, SVG } from '../dom/builder';

describe('Unit: util/dom', () => {
  describe('shadow', () => {
    it('', () => {
      assert(shadow('section') instanceof ShadowRoot);
      assert(shadow('section').mode === 'open');
      assert(shadow('section', { mode: 'closed' }).mode === 'closed');
      assert(shadow('section').childNodes.length === 0);
      assert(shadow('section', 'a').textContent === 'a');
      assert(shadow('section', [html('p')]).innerHTML === '<p></p>');
      assert(shadow(html('section', [html('p')])).innerHTML === '<p></p>');
      assert(shadow(html('section', [html('p')]), { mode: 'closed' }).innerHTML === '<p></p>');
      assert(shadow(shadow('section').host as HTMLElement));
      assert(shadow(shadow('section', { mode: 'open' }).host as HTMLElement));
      assert(shadow(shadow('section', { mode: 'closed' }).host as HTMLElement));
      assert.throws(() => shadow(shadow('section', { mode: 'open' }).host as HTMLElement, { mode: 'closed' }));
      assert.throws(() => shadow(shadow('section', { mode: 'closed' }).host as HTMLElement, { mode: 'open' }));
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
      assert(define(html('html', 'a'), [frag(['b', text('c')])]).innerHTML === 'bc');
      assert(define(html('html', [frag(['a', text('b')])]), 'c').innerHTML === 'c');
    });

  });

});
