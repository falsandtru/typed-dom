import { querySelector, querySelectorAll } from './query';
import { html } from './dom';

describe('Unit: util/query', () => {
  describe('querySelector', () => {
    it('', () => {
      assert.deepStrictEqual(
        querySelector(html('a', { id: '1' }, [html('a', { id: '2' })]), ':scope')?.id,
        '1');
      assert.deepStrictEqual(
        querySelector(html('a', { id: '1' }, [html('a', { id: '2' })]), ':scope > a')?.id,
        '2');
    });

  });

  describe('querySelectorAll', () => {
    it('', () => {
      assert.deepStrictEqual(
        querySelectorAll(html('a', { id: '1' }, [html('a', { id: '2' }), html('a', { id: '3' })]), ':scope').map(el => el.id),
        ['1']);
      assert.deepStrictEqual(
        querySelectorAll(html('a', { id: '1' }, [html('a', { id: '2' }), html('a', { id: '3' })]), ':scope > a').map(el => el.id),
        ['2', '3']);
      assert.deepStrictEqual(
        querySelectorAll(html('a', { id: '1' }, [html('a', { id: '2' }), html('a', { id: '3' })]), 'a').map(el => el.id),
        ['1', '2', '3']);
    });

  });

});
