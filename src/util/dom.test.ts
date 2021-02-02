import { shadow, frag, html, svg, text, define, defrag } from './dom';
import { HTML, SVG } from '../builder';
import { Sequence } from 'spica/sequence';

describe('Unit: util/dom', () => {
  describe('shadow', () => {
    it('', () => {
      assert(shadow('section') instanceof ShadowRoot);
      assert(shadow('section').mode === 'open');
      assert(shadow('section', { mode: 'closed' }).mode === 'closed');
      assert(shadow('section').childNodes.length === 0);
      assert(shadow('section', 'a').textContent === 'a');
      assert(shadow('section', [html('p')]).innerHTML === '<p></p>');
      assert(shadow('section', [html('p')], { mode: 'closed' }).innerHTML === '<p></p>');
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
      assert(html('a', undefined, 'b').outerHTML === HTML.a('b').element.outerHTML);
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
      assert(define(html('html'), undefined, 'a').innerHTML === 'a');
      assert(define(define(html('a', { href: '' })), { href: null }).matches(':not([href])'));
      assert(define(html('html', [frag(['a', text('b')])]), 'c').innerHTML === 'c');
      assert(define(html('html', 'a'), [frag(['b', text('c')])]).innerHTML === 'bc');
      assert(define(html('html', 'a'), ['a', frag(['b', 'c'])]).innerHTML === 'abc');
    });

    it('update', () => {
      const el = html('span');
      const es = Sequence.from([html('span', '1'), html('span', '2'), html('span', '3')]);
      // Property test
      Sequence.from([
        ...es.permutations(),
        ...es.permutations().bind(es => Sequence.from(es).subsequences()),
      ])
        .extract()
        .forEach(es =>
          assert.deepStrictEqual([...define(el, es).children], es));
    });

  });

  describe('defrag', () => {
    it('', () => {
      assert.deepStrictEqual(
        defrag([]),
        []);
      assert.deepStrictEqual(
        defrag(['']),
        []);
      assert.deepStrictEqual(
        defrag(['', 'a']),
        ['a']);
      assert.deepStrictEqual(
        defrag(['a', '']),
        ['a']);
      assert.deepStrictEqual(
        defrag(['a', 'b']),
        ['ab']);
    });

  });

});
