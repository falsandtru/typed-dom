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

    it('collection', function () {
      const collection = TypedHTML.ul([
        TypedHTML.li(),
        TypedHTML.li()
      ]);
      assert(collection.raw.nodeName === 'UL');
      assert(collection.contents[0].raw.nodeName === 'LI');
      assert(collection.contents[0].raw === collection.raw.children[0]);
      assert(collection.contents[1].raw.nodeName === 'LI');
      assert(collection.contents[1].raw === collection.raw.children[1]);
      assert(collection.contents[2] === void 0);
      assert(collection.raw.children[2] === void 0);
    });

    it('collection contents update', function () {
      const collection = TypedHTML.ul([
        TypedHTML.li(),
        TypedHTML.li()
      ]);
      collection.contents = [
        TypedHTML.li()
      ];
      assert(collection.contents[0].raw.nodeName === 'LI');
      assert(collection.contents[0].raw === collection.raw.children[0]);
      assert(collection.contents[1] === void 0);
      assert(collection.raw.children[1] === void 0);
    });

    it('collection contents partial update', function () {
      const collection = TypedHTML.ul([
        TypedHTML.li()
      ]);
      assert.throws(() => collection.contents[0] = TypedHTML.li());
      assert.throws(() => collection.contents[1] = TypedHTML.li());
      assert.throws(() => collection.contents.push(TypedHTML.li()));
      assert.throws(() => collection.contents.pop());
      assert.throws(() => collection.contents.length = 0);
      assert(collection.contents.length === 1);
    });

  });

});
