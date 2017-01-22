import { Sequence } from 'spica';
import TypedHTML from 'typed-dom';

declare const _: {
  shuffle<T>(as: T[]): T[]; 
};

describe('Integration: TypedHTML', function () {
  describe('spec', function () {
    it('attr with array', function () {
      const dom = TypedHTML.script({ id: 'test', src: './' }, []);
      assert(dom.raw.id === 'test');
      assert(dom.raw.getAttribute('src') === './');
      assert.deepStrictEqual(dom.contents, []);
    });

    it('attr with object', function () {
      const dom = TypedHTML.script({ id: 'test', src: './' }, {});
      assert(dom.raw.id === 'test');
      assert(dom.raw.getAttribute('src') === './');
      assert.deepStrictEqual(dom.contents, {});
    });

    it('factory with array', function () {
      const dom = TypedHTML.script([], () => {
        const el = document.createElement('script');
        el.id = 'test';
        return el;
      });
      assert(dom.raw.id === 'test');
      assert.deepStrictEqual(dom.contents, []);
    });

    it('factory with object', function () {
      const dom = TypedHTML.script({}, () => {
        const el = document.createElement('script');
        el.id = 'test';
        return el;
      });
      assert(dom.raw.id === 'test');
      assert.deepStrictEqual(dom.contents, {});
    });

    it('sanitize', function () {
      const dom = TypedHTML.div('<script>');
      assert(dom.raw.innerHTML === '&lt;script&gt;');
      assert(dom.contents === '<script>');
      dom.contents = '<script>';
      assert(dom.raw.innerHTML === '&lt;script&gt;');
      assert(dom.contents === '<script>');
    });

    it('empty', function () {
      const empty = TypedHTML.div();
      assert(empty.raw.outerHTML === '<div></div>');
      assert(empty.contents === void 0);
    });

    it('struct', function () {
      const struct = TypedHTML.article({
        title: TypedHTML.h1('title'),
        content: TypedHTML.p([TypedHTML.a()])
      });
      assert(struct.raw.outerHTML === '<article><h1>title</h1><p><a></a></p></article>');
      assert(struct.contents.title.raw === struct.raw.firstChild);
      assert(struct.contents.content.raw === struct.raw.lastChild);
    });

    it('struct contents update', function () {
      const struct = TypedHTML.article({
        title: TypedHTML.h1<string>('a')
      });
      struct.contents = {
        title: TypedHTML.h1('b')
      };
      assert(struct.contents.title.raw.textContent === 'b');
      assert(struct.contents.title.raw === struct.raw.firstChild);
      assert(struct.contents.title.contents === 'b');
    });

    it('struct contents partial update', function () {
      const struct = TypedHTML.article({
        title: TypedHTML.h1<string>('a')
      });
      struct.contents.title = TypedHTML.h1('b');
      assert(struct.contents.title.raw.textContent === 'b');
      assert(struct.contents.title.raw === struct.raw.firstChild);
      assert(struct.contents.title.contents === 'b');
      struct.contents.title.contents = 'c';
      assert(struct.contents.title.raw.textContent === 'c');
      assert(struct.contents.title.raw === struct.raw.firstChild);
      assert(struct.contents.title.contents === 'c');
    });

    it('collection', function () {
      const collection = TypedHTML.ul([
        TypedHTML.li('1'),
        TypedHTML.li('2')
      ]);
      assert(collection.raw.outerHTML === '<ul><li>1</li><li>2</li></ul>');
      assert(collection.contents.length === collection.raw.children.length);
      assert(collection.contents[0].raw === collection.raw.children[0]);
      assert(collection.contents[1].raw === collection.raw.children[1]);
    });

    it('collection contents update', function () {
      const collection = TypedHTML.ul([
        TypedHTML.li(),
        TypedHTML.li()
      ]);
      collection.contents = [
        TypedHTML.li()
      ];
      assert(collection.contents.length === collection.raw.children.length);
      assert(collection.contents[0].raw === collection.raw.children[0]);

      // property test
      const ss = Array(3).fill(0).map(() => TypedHTML.li());
      void Sequence.zip(
        Sequence.cycle([Array(3).fill(0).map(() => TypedHTML.li()).concat(ss)]),
        Sequence.cycle([Array(3).fill(0).map(() => TypedHTML.li()).concat(ss)]))
        .take(1000)
        .map(lss =>
          lss
            .map(ls =>
              _.shuffle(ls.slice(-ls.length % (Math.random() * ls.length | 0)))))
        .extract()
        .forEach(([os, ns]) => {
          collection.contents = os;
          Sequence.zip(
            Sequence.from(Array.from(collection.raw.children)),
            Sequence.from(os.map(({raw}) => raw)))
            .extract()
            .forEach(([a, b]) =>
              void assert(a === b));
          collection.contents = ns;
          Sequence.zip(
            Sequence.from(Array.from(collection.raw.children)),
            Sequence.from(ns.map(({raw}) => raw)))
            .extract()
            .forEach(([a, b]) =>
              void assert(a === b));
        });
    });

    it('collection contents partial update', function () {
      const collection = TypedHTML.ul([
        TypedHTML.li()
      ]);
      assert.throws(() => collection.contents[0] = TypedHTML.li());
      assert.throws(() => collection.contents.push(TypedHTML.li()));
      assert.throws(() => collection.contents.pop());
      assert.throws(() => collection.contents.length = 0);
      assert(collection.contents.length === 1);
    });

  });

});
