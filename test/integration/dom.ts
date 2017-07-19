import TypedHTML, { unique } from '../../index';
import { Sequence } from 'spica/sequence';

declare const _: {
  shuffle<T>(as: T[]): T[]; 
};

describe('Integration: Typed DOM', function () {
  describe('spec', function () {
    it('attr with array', function () {
      const dom = TypedHTML.script({ id: 'test', src: './' }, []);
      assert(dom.element.id === 'test');
      assert(dom.element.getAttribute('src') === './');
      assert.deepStrictEqual(dom.children, []);
    });

    it('attr with object', function () {
      const dom = TypedHTML.script({ id: 'test', src: './' }, {});
      assert(dom.element.id === 'test');
      assert(dom.element.getAttribute('src') === './');
      assert.deepStrictEqual(dom.children, {});
    });

    it('factory with array', function () {
      const dom = TypedHTML.script([], () => {
        const el = document.createElement('script');
        el.id = 'test';
        return el;
      });
      assert(dom.element.id === 'test');
      assert.deepStrictEqual(dom.children, []);
    });

    it('factory with object', function () {
      const dom = TypedHTML.script({}, () => {
        const el = document.createElement('script');
        el.id = 'test';
        return el;
      });
      assert(dom.element.id === 'test');
      assert.deepStrictEqual(dom.children, {});
    });

    it('sanitize', function () {
      const dom = TypedHTML.div('<script>');
      assert(dom.element.innerHTML === '&lt;script&gt;');
      assert(dom.children === '<script>');
      dom.children = '<script>';
      assert(dom.element.innerHTML === '&lt;script&gt;');
      assert(dom.children === '<script>');
    });

    it('scope', function () {
      const template = `$scope {}\n  $scope {}`;
      const result = `#test {}\n#test {}`;
      assert(TypedHTML.div({ id: 'test' }, [TypedHTML.style(template)]).children[0].element.innerHTML === result);
      assert(TypedHTML.div({ id: 'test' }, { style: TypedHTML.style(template) }).children.style.element.innerHTML === result);
      assert(TypedHTML.div({ id: 'test' }, [TypedHTML.style(`<script>`)]).children[0].element.children.length === 0);
      assert(TypedHTML.div({ id: '><script>' }, [TypedHTML.style(template)]).children[0].element.innerHTML === template);
    });

    it('empty', function () {
      const empty = TypedHTML.div();
      assert(empty.element.outerHTML === '<div></div>');
      assert(empty.children === void 0);
    });

    it('text', function () {
      const text = TypedHTML.p(`a`);
      assert(text.element.outerHTML === '<p>a</p>');
      assert(text.children === 'a');
    });

    it('text children update', function () {
      const text = TypedHTML.p(`a`);
      text.children = 'b';
      assert(text.element.outerHTML === '<p>b</p>');
      assert(text.children === 'b');
    });

    it('struct', function () {
      const struct = TypedHTML.article({
        title: TypedHTML.h1(`title`),
        content: TypedHTML.p([TypedHTML.a()])
      });
      assert(struct.element.outerHTML === '<article><h1>title</h1><p><a></a></p></article>');
      assert(struct.children.title.element === struct.element.firstChild);
      assert(struct.children.content.element === struct.element.lastChild);
    });

    it('struct children update', function () {
      const struct = TypedHTML.article({
        title: TypedHTML.h1(`a`)
      });
      struct.children = {
        title: TypedHTML.h1(`b`)
      };
      assert(struct.children.title.element.textContent === 'b');
      assert(struct.children.title.element === struct.element.firstChild);
      assert(struct.children.title.children === 'b');
    });

    it('struct children partial update', function () {
      const struct = TypedHTML.article({
        title: TypedHTML.h1(`a`)
      });
      struct.children.title = TypedHTML.h1(`b`);
      assert(struct.children.title.element.textContent === 'b');
      assert(struct.children.title.element === struct.element.firstChild);
      assert(struct.children.title.children === 'b');
      struct.children.title.children = 'c';
      assert(struct.children.title.element.textContent === 'c');
      assert(struct.children.title.element === struct.element.firstChild);
      assert(struct.children.title.children === 'c');
    });

    it('collection', function () {
      const collection = TypedHTML.ul([
        TypedHTML.li(`1`),
        TypedHTML.li(`2`)
      ]);
      assert(collection.element.outerHTML === '<ul><li>1</li><li>2</li></ul>');
      assert(collection.children.length === 2);
      assert(collection.children.every(({element}, i) => element === collection.element.children[i]));
    });

    it('collection children update', function () {
      const collection = TypedHTML.ul([
        TypedHTML.li(`1`)
      ]);
      collection.children = [
        TypedHTML.li('2'),
        TypedHTML.li('3')
      ];
      assert(collection.element.outerHTML === '<ul><li>2</li><li>3</li></ul>');
      assert(collection.children.length === 2);
      assert(collection.children.every(({element}, i) => element === collection.element.children[i]));
      collection.children = [
        TypedHTML.li('4')
      ];
      assert(collection.element.outerHTML === '<ul><li>4</li></ul>');
      assert(collection.children.length === 1);
      assert(collection.children.every(({element}, i) => element === collection.element.children[i]));

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
          collection.children = os;
          Sequence.zip(
            Sequence.from(Array.from(collection.element.children)),
            Sequence.from(os.map(({element}) => element)))
            .extract()
            .forEach(([a, b]) =>
              void assert(a === b));
          collection.children = ns;
          Sequence.zip(
            Sequence.from(Array.from(collection.element.children)),
            Sequence.from(ns.map(({element}) => element)))
            .extract()
            .forEach(([a, b]) =>
              void assert(a === b));
        });
    });

    it('collection children partial update', function () {
      const collection = TypedHTML.ul([
        TypedHTML.li()
      ]);
      assert.throws(() => collection.children[0] = TypedHTML.li());
      assert.throws(() => collection.children.push(TypedHTML.li()));
      assert.throws(() => collection.children.pop());
      assert.throws(() => collection.children.length = 0);
      assert(collection.children.length === 1);
      assert(collection.children.every(({element}, i) => element === collection.element.children[i]));
    });

    it('unique', function () {
      assert(unique().match(/^0\d{8}$/));
      assert(unique() < unique());
    });

  });

  describe('usage', function () {
    class MicroComponent {
      constructor(private readonly parent: HTMLElement) {
        this.parent.appendChild(this.dom.element);
      }
      private readonly dom = TypedHTML.div({ id: `${this.parent.id}-list-${unique()}` }, {
        style: TypedHTML.style(`$scope ul { width: 100px; }`),
        content: TypedHTML.ul([
          TypedHTML.li(`item`)
        ])
      });
    }
    class Component {
      constructor(private readonly parent: HTMLElement) {
        this.parent.appendChild(this.element);
      }
      private readonly element = TypedHTML.div({ id: 'id' }, [
        TypedHTML.style(`$scope { position: relative; }`)
      ]).element;
      private readonly children = Object.freeze({
        list: new MicroComponent(this.element)
      });
      destroy() {
        this.children;
        this.element.remove();
      }
    }

    it('micro component', function () {
      new MicroComponent(document.createElement('div'));
    });

    it('component', function () {
      new Component(document.createElement('div'));
    });

  });

});
