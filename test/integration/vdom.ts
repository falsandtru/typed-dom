import TypedHTML from 'typed-dom';

describe('Integration: Virtual DOM', function () {
  describe('spec', function () {
    it('text', function () {
      const text = TypedHTML.p(`a`);

      text.buffer();

      text.children = `b`;
      assert(text['element_'].textContent === 'a');
      assert(text.children === 'b');

      assert(text.element.textContent === 'b');
      assert(text.children === 'b');

      text.children = `c`;
      assert(text['element_'].textContent === 'b');
      assert(text.children === 'c');

      assert(text.element.textContent === 'c');
      assert(text.children === 'c');

      text.unbuffer();

      text.children = 'd';
      assert(text['element_'].textContent === 'd');
      assert(text.children === 'd');
    });

    it('struct', function () {
      const struct = TypedHTML.article({
        title: TypedHTML.h1(`a`)
      });

      struct.buffer();

      struct.children = {
        title: TypedHTML.h1(`b`)
      };
      assert(struct['element_'].firstChild !== struct.children.title['element_']);
      assert(struct['element_'].textContent === 'a');
      assert(struct.element.textContent === 'b');
      assert(struct.element.firstChild === struct.children.title.element);
      assert(struct.children.title.element.textContent === 'b');
      assert(struct.children.title.children === 'b');

      struct.children.title = TypedHTML.h1('c');
      assert(struct['element_'].firstChild !== struct.children.title['element_']);
      assert(struct['element_'].textContent === 'b');
      assert(struct.element.textContent === 'c');
      assert(struct.element.firstChild === struct.children.title.element);
      assert(struct.children.title.element.textContent === 'c');
      assert(struct.children.title.children === 'c');

      struct.children.title.children = 'd';
      assert(struct['element_'].firstChild === struct.children.title['element_']);
      assert(struct['element_'].textContent === 'd');
      assert(struct.element.textContent === 'd');
      assert(struct.element.firstChild === struct.children.title.element);
      assert(struct.children.title.element.textContent === 'd');
      assert(struct.children.title.children === 'd');

      struct.children.title.buffer();

      struct.children.title.children = 'e';
      assert(struct['element_'].firstChild === struct.children.title['element_']);
      assert(struct['element_'].textContent === 'd');
      assert(struct.element.textContent === 'e');
      assert(struct.element.firstChild === struct.children.title.element);
      assert(struct.children.title.element.textContent === 'e');
      assert(struct.children.title.children === 'e');
    });

    it('collection', function () {
      const collection = TypedHTML.ul([
        TypedHTML.li(`1`)
      ]);

      collection.buffer();

      collection.children = [
        TypedHTML.li('2')
      ];
      assert(collection['element_'].firstChild !== collection.children[0]['element_']);
      assert(collection['element_'].textContent === '1');
      assert(collection.element.textContent === '2');
      assert(collection.element.firstChild === collection.children[0].element);
      assert(collection.children[0].element.textContent === '2');
      assert(collection.children[0].children === '2');

      collection.children[0].children = '3';
      assert(collection['element_'].firstChild === collection.children[0]['element_']);
      assert(collection['element_'].textContent === '3');
      assert(collection.element.textContent === '3');
      assert(collection.element.firstChild === collection.children[0].element);
      assert(collection.children[0].element.textContent === '3');
      assert(collection.children[0].children === '3');

      collection.children[0].buffer();

      collection.children[0].children = '4';
      assert(collection['element_'].firstChild === collection.children[0]['element_']);
      assert(collection['element_'].textContent === '3');
      assert(collection.element.textContent === '4');
      assert(collection.element.firstChild === collection.children[0].element);
      assert(collection.children[0].element.textContent === '4');
      assert(collection.children[0].children === '4');
    });

    it('example', function () {
      const native = TypedHTML.div().element;
      const article = TypedHTML.article({
        title: TypedHTML.h1(`a`)
      });

      native.appendChild(article.element);
      assert(native.textContent === 'a');

      article.children.title = TypedHTML.h1('b');
      assert(native.textContent === 'b');

      article.buffer();

      article.children.title = TypedHTML.h1('c');
      assert(native.textContent === 'b');

      assert(article.element.textContent === 'c');
      assert(native.textContent === 'c');

      article.children.title = TypedHTML.h1('d');
      article.render();
      assert(native.textContent === 'd');

      article.children.title = TypedHTML.h1('e');
      assert(native.textContent === 'd');

      article.unbuffer();

      assert(native.textContent === 'd');
      article.render();
      assert(native.textContent === 'e');

      article.children.title = TypedHTML.h1('f');
      assert(native.textContent === 'f');
    });

  });

});
