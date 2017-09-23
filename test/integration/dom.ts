import TypedHTML from '../../index';
import { Sequence } from 'spica/sequence';
import { sqid } from 'spica/sqid';

declare const _: { shuffle<T>(as: T[]): T[]; };

describe('Integration: Typed DOM', function () {
  describe('spec', function () {
    it('empty', function () {
      const dom = TypedHTML.p();
      assert(dom.element.outerHTML === '<p></p>');
      assert(dom.children === void 0);
    });

    it('factory', function () {
      const dom = TypedHTML.p(() => {
        const el = document.createElement('p');
        el.id = 'test';
        return el;
      });
      assert(dom.element.id === 'test');
      assert(dom.children === void 0);
    });

    it('text', function () {
      const dom = TypedHTML.p(`a`);
      assert(dom.element.outerHTML === '<p>a</p>');
      assert(dom.children === 'a');
    });

    it('text children update', function () {
      const dom = TypedHTML.p(`a` as string);
      dom.children = 'b';
      assert(dom.element.outerHTML === '<p>b</p>');
      assert(dom.children === 'b');
    });

    it('text with factory', function () {
      const dom = TypedHTML.p(`a`, () => {
        const el = document.createElement('p');
        el.id = 'test';
        return el;
      });
      assert(dom.element.id === 'test');
      assert(dom.children === 'a');
    });

    it('collection', function () {
      const dom = TypedHTML.ul([
        TypedHTML.li(`1` as string),
        TypedHTML.li(`2`)
      ]);
      assert(dom.element.outerHTML === '<ul><li>1</li><li>2</li></ul>');
      assert(dom.children.length === 2);
      assert(dom.children.every(({element}, i) => element === dom.element.children[i]));
    });

    it('collection children update', function () {
      const dom = TypedHTML.ul([
        TypedHTML.li(`1` as string)
      ]);
      dom.children = [
        TypedHTML.li('2'),
        TypedHTML.li('3')
      ];
      assert(dom.element.outerHTML === '<ul><li>2</li><li>3</li></ul>');
      assert(dom.children.length === 2);
      assert(dom.children.every(({element}, i) => element === dom.element.children[i]));
      dom.children = [
        TypedHTML.li('4')
      ];
      assert(dom.element.outerHTML === '<ul><li>4</li></ul>');
      assert(dom.children.length === 1);
      assert(dom.children.every(({element}, i) => element === dom.element.children[i]));

      // property test
      const ss = Array(3).fill(0).map(() => TypedHTML.li(``));
      void Sequence.zip(
        Sequence.cycle([[...Array(3).fill(0).map(() => TypedHTML.li(``)), ...ss]]),
        Sequence.cycle([[...Array(3).fill(0).map(() => TypedHTML.li(``)), ...ss]]))
        .take(1000)
        .map(lss =>
          lss
            .map(ls =>
              _.shuffle(ls.slice(-ls.length % (Math.random() * ls.length | 0)))))
        .extract()
        .forEach(([os, ns]) => {
          dom.children = os;
          Sequence.zip(
            Sequence.from(Array.from(dom.element.children)),
            Sequence.from(os.map(({element}) => element)))
            .extract()
            .forEach(([a, b]) =>
              void assert(a === b));
          dom.children = ns;
          Sequence.zip(
            Sequence.from(Array.from(dom.element.children)),
            Sequence.from(ns.map(({element}) => element)))
            .extract()
            .forEach(([a, b]) =>
              void assert(a === b));
        });
    });

    it('collection children partial update', function () {
      const dom = TypedHTML.ul([
        TypedHTML.li()
      ]);
      assert.throws(() => dom.children[0] = TypedHTML.li());
      assert.throws(() => dom.children.push(TypedHTML.li()));
      assert.throws(() => dom.children.pop());
      assert.throws(() => dom.children.length = 0);
      assert(dom.children.length === 1);
      assert(dom.children.every(({element}, i) => element === dom.element.children[i]));
    });

    it('collection with factory', function () {
      const dom = TypedHTML.ul([], () => {
        const el = document.createElement('ul');
        el.id = 'test';
        return el;
      });
      assert(dom.element.id === 'test');
      assert.deepStrictEqual(dom.children, []);
    });

    it('struct', function () {
      const dom = TypedHTML.article({
        title: TypedHTML.h1(`title`),
        content: TypedHTML.p([TypedHTML.a()])
      });
      assert(dom.element.outerHTML === '<article><h1>title</h1><p><a></a></p></article>');
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.content.element === dom.element.lastChild);
    });

    it('struct children update', function () {
      const dom = TypedHTML.article({
        title: TypedHTML.h1(`a` as string)
      });
      dom.children = {
        title: TypedHTML.h1(`b`)
      };
      assert(dom.children.title.element.textContent === 'b');
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.children === 'b');
    });

    it('struct children partial update', function () {
      const dom = TypedHTML.article({
        title: TypedHTML.h1(`a` as string)
      });
      dom.children.title = TypedHTML.h1(`b`);
      assert(dom.children.title.element.textContent === 'b');
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.children === 'b');
      dom.children.title.children = 'c';
      assert(dom.children.title.element.textContent === 'c');
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.children === 'c');
    });

    it('struct with factory', function () {
      const dom = TypedHTML.article({}, () => {
        const el = document.createElement('article');
        el.id = 'test';
        return el;
      });
      assert(dom.element.id === 'test');
      assert.deepStrictEqual(dom.children, {});
    });

    it('attr', function () {
      const dom = TypedHTML.div({ id: 'test', class: 'test' });
      assert(dom.element.id === 'test');
      assert(dom.element.getAttribute('class') === 'test');
      assert(dom.children === void 0);
    });

    it('attr with factory', function () {
      const dom = TypedHTML.div({ id: 'test' }, () => {
        const el = document.createElement('div');
        el.id = 'id';
        el.className = 'test';
        return el;
      });
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert(dom.children === void 0);
    });

    it('attr with text', function () {
      const dom = TypedHTML.div({ id: 'test', class: 'test' }, '');
      assert(dom.element.id === 'test');
      assert(dom.element.getAttribute('class') === 'test');
      assert(dom.children === '');
    });

    it('attr with collection', function () {
      const dom = TypedHTML.div({ id: 'test', class: 'test' }, []);
      assert(dom.element.id === 'test');
      assert(dom.element.getAttribute('class') === 'test');
      assert.deepStrictEqual(dom.children, []);
    });

    it('attr with struct', function () {
      const dom = TypedHTML.div({ id: 'test', class: 'test' }, {});
      assert(dom.element.id === 'test');
      assert(dom.element.getAttribute('class') === 'test');
      assert.deepStrictEqual(dom.children, {});
    });

    it('attr with text and factory', function () {
      const dom = TypedHTML.div({ id: 'test' }, '', () => {
        const el = document.createElement('div');
        el.id = 'id';
        el.className = 'test';
        return el;
      });
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert(dom.children === '');
    });

    it('attr with collection and factory', function () {
      const dom = TypedHTML.div({ id: 'test' }, [], () => {
        const el = document.createElement('div');
        el.id = 'id';
        el.className = 'test';
        return el;
      });
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert.deepStrictEqual(dom.children, []);
    });

    it('attr with struct and factory', function () {
      const dom = TypedHTML.div({ id: 'test' }, {}, () => {
        const el = document.createElement('div');
        el.id = 'id';
        el.className = 'test';
        return el;
      });
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert.deepStrictEqual(dom.children, {});
    });

    it('create', function () {
      const dom = TypedHTML.create('any');
      assert(dom.element.outerHTML === '<any></any>');
      assert(dom.children === void 0);
    });

    it('create with factory', function () {
      const dom = TypedHTML.create('any', () =>
        document.createElement('any'));
      assert(dom.element.outerHTML === '<any></any>');
      assert(dom.children === void 0);
    });

    it('create with children', function () {
      const dom = TypedHTML.create('any', 'a');
      assert(dom.element.outerHTML === '<any>a</any>');
      assert(dom.children === 'a');
    });

    it('create with children and factory', function () {
      const dom = TypedHTML.create('any', 'a', () => {
        const el = document.createElement('any');
        el.textContent = 'b';
        return el;
      });
      assert(dom.element.outerHTML === '<any>a</any>');
      assert(dom.children === 'a');
    });

    it('create with attr', function () {
      const dom = TypedHTML.create('any', { id: 'test' });
      assert(dom.element.id === 'test');
      assert(dom.children === void 0);
    });

    it('create with attr and factory', function () {
      const dom = TypedHTML.create('any', { id: 'test' }, () => {
        const el = document.createElement('any');
        el.id = 'id';
        el.className = 'test';
        return el;
      });
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert(dom.children === void 0);
    });

    it('create with attr and children', function () {
      const dom = TypedHTML.create('any', { id: 'test' }, {});
      assert(dom.element.id === 'test');
      assert.deepStrictEqual(dom.children, {});
    });

    it('create with attr, children, and factory', function () {
      const dom = TypedHTML.create('any', { id: 'test' }, {}, () => {
        const el = document.createElement('any');
        el.id = 'id';
        el.className = 'test';
        return el;
      });
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert.deepStrictEqual(dom.children, {});
    });

    it('check tag name', function () {
      TypedHTML.create('div', [TypedHTML.create('p')]);
      TypedHTML.create('div', () => TypedHTML.div([TypedHTML.create('p')]).element);
      assert.throws(() => TypedHTML.section(() => document.createElement('any')));
      assert.throws(() => TypedHTML.create('div', () => document.createElement('any')));
      assert.throws(() => TypedHTML.create('any', () => document.createElement('div')));
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

    it('clear', function () {
      assert(TypedHTML.p(() => TypedHTML.p('a').element).element.innerHTML === 'a');
      assert(TypedHTML.p(() => TypedHTML.p('a').element).children === void 0);
      assert(TypedHTML.p('', () => TypedHTML.p('a').element).element.innerHTML === '');
      assert(TypedHTML.p('', () => TypedHTML.p('a').element).children === '');
      assert(TypedHTML.p([], () => TypedHTML.p('a').element).element.childNodes.length === 0);
      assert.deepStrictEqual(TypedHTML.p([], () => TypedHTML.p('a').element).children, []);
      assert(TypedHTML.p({}, () => TypedHTML.p('a').element).element.childNodes.length === 0);
      assert.deepStrictEqual(TypedHTML.p({}, () => TypedHTML.p('a').element).children, {});
    });

  });

  describe('usage', function () {
    class MicroComponent {
      constructor(private readonly parent: HTMLElement) {
        this.parent.appendChild(this.dom.element);
      }
      private readonly dom = TypedHTML.div({ id: `${this.parent.id}-list-${sqid()}` }, {
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
