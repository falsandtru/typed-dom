import { querySelectorWith, querySelectorAllWith } from './query';
import { html } from './dom';

describe('Unit: util/query', () => {
  describe('querySelectorWith', () => {
    it('', () => {
      assert.deepStrictEqual(
        querySelectorWith(html('a', { id: '1' }, [html('a', { id: '2' })]), ':scope')?.id,
        '1');
      assert.deepStrictEqual(
        querySelectorWith(html('a', { id: '1' }, [html('a', { id: '2' })]), ':scope > a')?.id,
        '2');
    });

  });

  describe('querySelectorAllWith', () => {
    it('', () => {
      assert.deepStrictEqual(
        querySelectorAllWith(html('a', { id: '1' }, [html('a', { id: '2' }), html('a', { id: '3' })]), ':scope').map(el => el.id),
        ['1']);
      assert.deepStrictEqual(
        querySelectorAllWith(html('a', { id: '1' }, [html('a', { id: '2' }), html('a', { id: '3' })]), ':scope > a').map(el => el.id),
        ['2', '3']);
      assert.deepStrictEqual(
        querySelectorAllWith(html('a', { id: '1' }, [html('a', { id: '2' }), html('a', { id: '3' })]), 'a').map(el => el.id),
        ['1', '2', '3']);
    });

  });

});
