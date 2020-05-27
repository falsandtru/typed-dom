import { apply } from './query';
import { html } from './dom';

describe('Unit: util/query', () => {
  describe('apply', () => {
    it('', () => {
      assert.deepStrictEqual(
        [...apply(html('div', [html('br'), html('br')]), 'br', {})].map(el => el.outerHTML),
        ['<br>', '<br>']);
      assert.deepStrictEqual(
        [...apply(html('div', [html('br'), html('br')]), 'br:not([id])', { id: '' })].map(el => el.outerHTML),
        ['<br id="">', '<br id="">']);
    });

  });

});
