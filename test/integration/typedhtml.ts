import TypedHTML from 'typed-dom';

describe('Integration: TypedHTML', function () {
  describe('usage', function () {
    it('struct', function () {
      const struct = TypedHTML.div({
        title: TypedHTML.h1(),
        list: TypedHTML.ul([TypedHTML.li()])
      });
      assert(struct.raw.nodeName === 'DIV');
      assert(struct.raw.firstChild === struct.contents.title.raw);
      assert(struct.contents.title.raw.nodeName === 'H1');
      assert(struct.contents.list.raw.nodeName === 'UL');
      assert(struct.contents.list.contents[0].raw.nodeName === 'LI');

      struct.contents.title = TypedHTML.h2();
      assert(struct.raw.children[0].nodeName === 'H2');
      assert(struct.contents.title.raw.nodeName === 'H2');
      struct.contents = {
        title: TypedHTML.h1(),
        list: TypedHTML.ul([TypedHTML.li()])
      };
      assert(struct.raw.children[0].nodeName === 'H1');
      assert(struct.contents.title.raw.nodeName === 'H1');
    });

    it('list', function () {
      const list = TypedHTML.p([TypedHTML.a()]);
      assert(list.raw.nodeName === 'P');
      assert(list.contents[0].raw.nodeName === 'A');
      assert(list.contents[0].contents[0] === void 0);
      assert(list.contents[1] === void 0);

      list.contents = [TypedHTML.a(), TypedHTML.a()];
      assert(list.raw.children[1].nodeName === 'A');
      assert(list.contents[1].raw.nodeName === 'A');
    });

  });

});
