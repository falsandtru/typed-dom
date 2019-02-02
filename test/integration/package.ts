import { TypedHTML, TypedSVG, El, API, proxy, html, define } from '../../index';
import { Sequence } from 'spica/sequence';
import { frag } from '../../src/util/dom';

declare global {
  interface HTMLElementTagNameMap {
    'any': HTMLElement;
  }
  interface SVGElementTagNameMap_ {
    'a': SVGAElement;
  }
}
declare const _: { shuffle<T>(as: T[]): T[]; };

describe('Integration: Typed DOM', function () {
  describe('spec', function () {
    it('call', function () {
      assert(TypedHTML('p').element.outerHTML === '<p></p>');
      assert(TypedHTML('p', 'a').element.outerHTML === '<p>a</p>');
      assert(TypedHTML('p', { class: 'class' }, 'a', (f, t) => f(t, { id: 'id' })).element.outerHTML === '<p id="id" class="class">a</p>');
    });

    it('html', function () {
      assert(TypedHTML.html().element instanceof HTMLElement);
      assert(TypedHTML.html().element.outerHTML === '<html></html>');
    });

    it('svg', function () {
      assert(TypedSVG.svg().element instanceof SVGElement);
      assert(TypedSVG.svg().element.outerHTML === '<svg></svg>');
    });

    it('empty', function () {
      const dom = TypedHTML.p();
      assert(dom.element.outerHTML === '<p></p>');
      assert(dom.children === undefined);
    });

    it('factory', function () {
      const dom = TypedHTML.p((f, tag) => {
        const el = document.createElement('div').appendChild(f(tag));
        el.id = 'test';
        return el;
      });
      assert(dom.element.id === 'test');
      assert(dom.children === undefined);
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
      const dom = TypedHTML.p(`a`, (el, tag) =>
        el(tag, { id: 'test' }));
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
      this.timeout(9 * 1e3);

      const dom = TypedHTML.ul([
        TypedHTML.li(`1` as string)
      ]);
      assert.doesNotThrow(() => dom.children = dom.children);
      assert.throws(() => dom.children = TypedHTML.ul([TypedHTML.li(`1`)]).children);
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
            Sequence.from(os.map(({ element }) => element)))
            .extract()
            .forEach(([a, b]) =>
              void assert(a === b));
          dom.children = ns;
          Sequence.zip(
            Sequence.from(Array.from(dom.element.children)),
            Sequence.from(ns.map(({ element }) => element)))
            .extract()
            .forEach(([a, b]) =>
              void assert(a === b));
        });
    });

    it('collection children partial update', function () {
      const dom = TypedHTML.ul([
        TypedHTML.li()
      ]);
      assert.throws(() => dom.children[0] = dom.children[0]);
      assert.throws(() => dom.children[0] = TypedHTML.li());
      assert.throws(() => dom.children.push(TypedHTML.li()));
      assert.throws(() => dom.children.pop());
      assert.throws(() => dom.children.length = 0);
      assert(dom.children.length === 1);
      assert(dom.children.every(({element}, i) => element === dom.element.children[i]));
    });

    it('collection with factory', function () {
      const dom = TypedHTML.ul([], (el, tag) =>
        el(tag, { id: 'test' }));
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

    it('struct empty', function () {
      const dom = TypedHTML.div({});
      assert.deepStrictEqual(dom.children, {});
    });

    it('struct children update', function () {
      const dom = TypedHTML.article({
        title: TypedHTML.h1(`a` as string)
      });
      assert.doesNotThrow(() => dom.children = dom.children);
      assert.throws(() => dom.children = TypedHTML.article({ title: TypedHTML.h1(`b`) }).children);
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.element.textContent === 'a');
      assert(dom.children.title.children === 'a');
      dom.children = {
        title: TypedHTML.h1(`b`)
      };
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.element.textContent === 'b');
      assert(dom.children.title.children === 'b');
    });

    it('struct children partial update', function () {
      const dom = TypedHTML.article({
        title: TypedHTML.h1(`a` as string)
      });
      assert.doesNotThrow(() => dom.children.title = dom.children.title);
      assert.throws(() => dom.children.title = TypedHTML.article({ title: TypedHTML.h1(`b`) }).children.title);
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.element.textContent === 'a');
      assert(dom.children.title.children === 'a');
      dom.children.title = TypedHTML.h1(`b`);
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.element.textContent === 'b');
      assert(dom.children.title.children === 'b');
      dom.children.title.children = 'c';
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.element.textContent === 'c');
      assert(dom.children.title.children === 'c');
    });

    it('struct with factory', function () {
      const dom = TypedHTML.article({}, (el, tag) =>
        el(tag, { id: 'test' }));
      assert(dom.element.id === 'test');
      assert.deepStrictEqual(dom.children, {});
    });

    it('attr', function () {
      const dom = TypedHTML.div({ id: 'test', class: 'test' });
      assert(dom.element.id === 'test');
      assert(dom.element.getAttribute('class') === 'test');
      assert(dom.children === undefined);
    });

    it('attr with factory', function () {
      const dom = TypedHTML.div({ id: 'test' }, (el, tag) =>
        el(tag, { id: 'id', class: 'test' }));
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert(dom.children === undefined);
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
      const dom = TypedHTML.div({ id: 'test' }, '', (el, tag) =>
        el(tag, { id: 'id', class: 'test' }));
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert(dom.children === '');
    });

    it('attr with collection and factory', function () {
      const dom = TypedHTML.div({ id: 'test' }, [], (el, tag) =>
        el(tag, { id: 'id', class: 'test' }));
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert.deepStrictEqual(dom.children, []);
    });

    it('attr with struct and factory', function () {
      const dom = TypedHTML.div({ id: 'test' }, {}, (el, tag) =>
        el(tag, { id: 'id', class: 'test' }));
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert.deepStrictEqual(dom.children, {});
    });

    it('listen', function (done) {
      TypedHTML.a({ onclick: ev => void assert(ev instanceof Event) || done() }).element.click();
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
      const result = `#test {}\n  #test {}`;
      assert(TypedHTML.div({ id: 'test' }, [TypedHTML.style(template)]).children[0].element.innerHTML === result);
      assert(TypedHTML.div({ id: 'test' }, { style: TypedHTML.style(template) }).children.style.element.innerHTML === result);
      assert(TypedHTML.div({ id: 'test' }, [TypedHTML.style(`<script>`)]).children[0].element.children.length === 0);
      assert(TypedHTML.div([TypedHTML.style(template)]).element.className.startsWith('id-'));
      assert(TypedHTML.div([TypedHTML.style(template)]).children[0].element.innerHTML.match(/\.[\w\-]+\s/gm)!.length === 2);
    });

    it('clear', function () {
      assert(TypedHTML.p(() => TypedHTML.p('a').element).element.innerHTML === 'a');
      assert(TypedHTML.p(() => TypedHTML.p('a').element).children === undefined);
      assert(TypedHTML.p('', () => TypedHTML.p('a').element).element.innerHTML === '');
      assert(TypedHTML.p('', () => TypedHTML.p('a').element).children === '');
      assert(TypedHTML.p([], () => TypedHTML.p('a').element).element.childNodes.length === 0);
      assert.deepStrictEqual(TypedHTML.p([], () => TypedHTML.p('a').element).children, []);
      assert(TypedHTML.p({}, () => TypedHTML.p('a').element).element.childNodes.length === 0);
      assert.deepStrictEqual(TypedHTML.p({}, () => TypedHTML.p('a').element).children, {});
    });

    it('fragment', function () {
      TypedHTML.div([TypedHTML.p(() => document.createDocumentFragment().appendChild(document.createElement('p')))]);
    });

    it('parameter combination', function () {
      Sequence.from([
        [{ id: 'id' }],
        [undefined, '', [], {}],
        [() => document.createElement('div')]])
        .mapM(v => Sequence.from(v))
        .bind(v => Sequence.from(v).filterM(() => Sequence.from([false, true])))
        .extract()
        .forEach(params => {
          TypedHTML.div(...params as any);
        });
    });

    it('extend', function () {
      assert(TypedHTML.any().element.outerHTML === '<any></any>');
      assert(TypedSVG.a().element.outerHTML === '<a></a>');
    });

    it('swap', function () {
      assert.throws(() => TypedHTML.article(TypedHTML.article([TypedHTML.p()]).children));
      const el = TypedHTML.article([TypedHTML.p()]);
      const children = el.children;
      el.children = [TypedHTML.p()];
      frag(children.map(el => el.element));
      assert(TypedHTML.article(children));
    });

    it('observe text', function () {
      const el = TypedHTML.span(
        {
          onchange: (ev, el = ev.target as HTMLElement) =>
            el.textContent = el.textContent!.toUpperCase(),
        },
        'a');
      assert(el.children === 'A');
      el.children = 'b';
      assert(el.children === 'B');
    });

    it('observe collection', function () {
      const listeners: Record<string, EventListener> = {
        onconnect: (ev, el = ev.target as HTMLElement) =>
          el.textContent = el.textContent!.toUpperCase(),
        ondisconnect: (ev, el = ev.target as HTMLElement) =>
          el.textContent += el.textContent,
      };
      const el = TypedHTML.ul([
        TypedHTML.li(listeners, 'a' as string),
        TypedHTML.li(listeners, 'b'),
      ]);
      el.children = [
        el.children[1],
        TypedHTML.li(listeners, 'c'),
      ];
      assert.deepStrictEqual(
        el.children.map(el => el.children),
        [
          'B',
          'C',
        ]);
    });

    it('observe record', function () {
      const listeners: Record<string, EventListener> = {
        onconnect: (ev, el = ev.target as HTMLElement) =>
          el.textContent = el.textContent!.toUpperCase(),
        ondisconnect: (ev, el = ev.target as HTMLElement) =>
          el.textContent += el.textContent,
      };
      const el = TypedHTML.ul({
        a: TypedHTML.li(listeners, 'a' as string),
        b: TypedHTML.li(listeners, 'b'),
        c: TypedHTML.li(listeners, 'c'),
      });
      el.children = {
        a: el.children.a,
        b: el.children.c,
        c: TypedHTML.li(listeners, 'd'),
      };
      assert.deepStrictEqual(
        Object.entries(el.children).map(([k, v]) => [k, v.children]),
        [
          ['a', 'A'],
          ['b', 'C'],
          ['c', 'D'],
        ]);
    });

  });

  describe('usage', function () {
    it('component', function () {
      class Component implements El {
        private readonly dom = TypedHTML.div({
          style: TypedHTML.style(`$scope ul { width: 100px; }`),
          content: TypedHTML.ul([
            TypedHTML.li(`item`)
          ]),
        });
        public readonly element = this.dom.element;
        public get children() {
          return this.dom.children.content.children;
        }
        public set children(children) {
          this.dom.children.content.children = children;
        }
      }

      const el = new Component();
      assert(TypedHTML.div([el]));
      assert(el.children[0].children === 'item');
      el.children = [
        TypedHTML.li('Item')
      ];
      assert(el.children[0].children === 'Item');
    });

    it('translate', function () {
      const i18n = i18next.createInstance({
        lng: 'en',
        resources: {
          en: {
            translation: {
              "a": "{{data}}",
              "b": "B",
            }
          }
        }
      });
      interface TransDataMap {
        'a': { data: string; };
      }
      const memory = new WeakMap<Node, object>();
      const data = <K extends keyof TransDataMap>(data: TransDataMap[K]) =>
        <T extends string, E extends Element>(factory: (tag: T, ...args: any[]) => E, tag: T, ...args: any[]): E => {
          const el = factory(tag, ...args);
          void memory.set(el, data);
          return el;
        };
      const trans: API<HTMLElementTagNameMap, typeof html> = API((tag: keyof HTMLElementTagNameMap, ...args: any[]) =>
        define(html(tag, {
          onchange: args.every(arg => typeof arg !== 'string')
            ? undefined
            : (ev, el = proxy<string>(ev.target as HTMLElement)) =>
                i18n.init((err, t) =>
                  el.children = err
                    ? 'Failed to init i18next.'
                    : t(el.children, memory.get(el.element))),
        }), ...args));

      const el = trans.span('a', data({ data: 'A' }));
      assert(el.children === 'A');
      assert(el.element.textContent === 'A');
      el.children = 'b';
      assert(el.children === 'B');
      assert(el.element.textContent === 'B');
      el.children = 'a';
      assert(el.children === 'A');
      assert(el.element.textContent === 'A');
    });

  });

});
