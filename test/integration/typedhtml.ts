import TypedHTML from 'typed-dom';

describe('Integration: TypedHTML', function () {
  describe('spec', function () {
    it('struct', function () {
      const struct = TypedHTML.article({
        title: TypedHTML.h1(),
        content: TypedHTML.p([TypedHTML.a()])
      });
      assert(struct.raw.nodeName === 'ARTICLE');
      assert(struct.contents.title.raw.nodeName === 'H1');
      assert(struct.contents.title.raw === struct.raw.firstChild);
      assert(struct.contents.content.raw.nodeName === 'P');
      assert(struct.contents.content.raw === struct.raw.lastChild);
    });

    it('struct contents update', function () {
      const struct = TypedHTML.article({
        title: TypedHTML.h1()
      });
      struct.contents = {
        title: TypedHTML.h2()
      };
      assert(struct.contents.title.raw.nodeName === 'H2');
      assert(struct.contents.title.raw === struct.raw.firstChild);
    });

    it('struct contents partial update', function () {
      const struct = TypedHTML.article({
        title: TypedHTML.h1()
      });
      struct.contents.title = TypedHTML.h2();
      assert(struct.contents.title.raw.nodeName === 'H2');
      assert(struct.contents.title.raw === struct.raw.firstChild);
    });

    it('list', function () {
      const list = TypedHTML.ul([
        TypedHTML.li(),
        TypedHTML.li()
      ]);
      assert(list.raw.nodeName === 'UL');
      assert(list.contents[0].raw.nodeName === 'LI');
      assert(list.contents[0].raw === list.raw.children[0]);
      assert(list.contents[1].raw.nodeName === 'LI');
      assert(list.contents[1].raw === list.raw.children[1]);
      assert(list.contents[2] === void 0);
      assert(list.raw.children[2] === void 0);
    });

    it('list contents update', function () {
      const list = TypedHTML.ul([
        TypedHTML.li(),
        TypedHTML.li()
      ]);
      list.contents = [
        TypedHTML.li()
      ];
      assert(list.contents[0].raw.nodeName === 'LI');
      assert(list.contents[0].raw === list.raw.children[0]);
      assert(list.contents[1] === void 0);
      assert(list.raw.children[1] === void 0);
    });

    it('list contents partial update', function () {
      const list = TypedHTML.ul([
        TypedHTML.li()
      ]);
      assert.throws(() => list.contents[0] = TypedHTML.li());
      assert.throws(() => list.contents[1] = TypedHTML.li());
      assert.throws(() => list.contents.push(TypedHTML.li()));
      assert.throws(() => list.contents.pop());
      assert.throws(() => list.contents.length = 0);
      assert(list.contents.length === 1);
    });

  });

});
