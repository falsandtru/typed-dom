import { Shadow, HTML, SVG, El, Attrs, shadow, frag, html } from '../../index';
import { Coroutine } from 'spica/coroutine';
import { Sequence } from 'spica/sequence';
import { wait } from 'spica/timer';

declare global {
  interface ShadowHostHTMLElementTagNameMap {
    'custom-tag': HTMLElement;
  }
  interface HTMLElementTagNameMap {
    'custom': HTMLElement;
  }
}

declare const _: { shuffle<T>(as: T[]): T[]; };

const doc = Shadow.section([]);
document.body.appendChild(doc.element);

describe('Integration: Typed DOM', function () {
  describe('spec', function () {
    it('call', function () {
      assert(HTML('p').element.outerHTML === '<p></p>');
      assert(HTML('p', 'a').element.outerHTML === '<p>a</p>');
      assert(HTML('p', { class: 'class' }, 'a', (h, t) => h(t, { id: 'id' })).element.outerHTML === '<p id="id" class="class">a</p>');
    });

    it('html', function () {
      assert(HTML.html().element instanceof HTMLElement);
      assert(HTML.html().element.outerHTML === '<html></html>');
    });

    it('svg', function () {
      assert(SVG.svg().element instanceof SVGElement);
      assert(SVG.svg().element.outerHTML === '<svg></svg>');
    });

    it('empty', function () {
      const dom = HTML.p();
      assert(dom.element.outerHTML === '<p></p>');
      assert(dom.children === undefined);
    });

    it('factory', function () {
      const dom = HTML.p({ class: 'test' }, [HTML.a()], (h, tag, _, children) => {
        assert(children.every(child => child.element instanceof HTMLAnchorElement));
        return html('div').appendChild(h(tag, { id: 'test' }));
      });
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert(dom.children.length === 1);
      assert(dom.children.every(child => child.element instanceof HTMLAnchorElement));
    });

    it('text', function () {
      const dom = HTML.p('a');
      assert(dom.element.outerHTML === '<p>a</p>');
      assert(dom.children === 'a');
    });

    it('text children update', function () {
      const dom = HTML.p('a');
      // @ts-expect-error
      () => dom.children = undefined;
      dom.children = 'b';
      assert(dom.element.outerHTML === '<p>b</p>');
      assert(dom.children === 'b');
    });

    it('text with factory', function () {
      const dom = HTML.p('a', (h, tag) =>
        h(tag, { id: 'test' }));
      assert(dom.element.id === 'test');
      assert(dom.children === 'a');
    });

    it('node', function () {
      const dom = Shadow.p(frag(['a', html('br'), 'b']));
      assert(dom.element.shadowRoot?.innerHTML === 'a<br>b');
      assert(dom.children instanceof DocumentFragment);
      assert(dom.children.childNodes.length === 0);
      dom.children = frag(['c']);
      assert(dom.element.shadowRoot?.innerHTML === 'c');
      assert(dom.children.childNodes.length === 0);
    });

    it('collection', function () {
      const dom = HTML.ul([
        HTML.li('1'),
        HTML.li('2'),
      ]);
      assert(dom.element.outerHTML === '<ul><li>1</li><li>2</li></ul>');
      assert(dom.children.length === 2);
      assert(dom.children.every(({ element }, i) => element === dom.element.children[i]));
    });

    it('collection children update', function () {
      this.timeout(9 * 1e3);

      const dom = HTML.ul([
        HTML.li('1'),
      ]);
      assert.doesNotThrow(() => dom.children = dom.children);
      assert.throws(() => dom.children = HTML.ul([HTML.li('1')]).children);
      dom.children = [
        HTML.li('2'),
        HTML.li('3'),
      ];
      assert(dom.element.outerHTML === '<ul><li>2</li><li>3</li></ul>');
      assert(dom.children.length === 2);
      assert(dom.children.every(({ element }, i) => element === dom.element.children[i]));
      dom.children = [
        HTML.li('4'),
      ];
      assert(dom.element.outerHTML === '<ul><li>4</li></ul>');
      assert(dom.children.length === 1);
      assert(dom.children.every(({ element }, i) => element === dom.element.children[i]));

      // Property test
      const el = HTML.ul([]);
      const es = Sequence.from([HTML.li('1'), HTML.li('2'), HTML.li('3')]);
      el.children = [];
      Sequence.from([
        ...es.permutations(),
        ...es.permutations().bind(es => Sequence.from(es).subsequences()),
      ])
        .extract()
        .forEach(es => {
          el.children = es;
          assert.deepStrictEqual(el.children, es);
        });
    });

    it('collection children partial update', function () {
      const dom = HTML.ul([
        HTML.li(),
      ]);
      // @ts-expect-error
      () => dom.children[0] = dom.children[0];
      //() => dom.children[0] = HTML.li();
      //() => dom.children.push(HTML.li());
      //() => dom.children.pop();
      //() => dom.children.length = 0;
      // @ts-expect-error
      () => dom.children = [undefined];
      // @ts-expect-error
      () => dom.children = [HTML.li(), undefined];
      assert(dom.children.length === 1);
      assert(dom.children.every(({ element }, i) => element === dom.element.children[i]));
    });

    it('collection with factory', function () {
      const dom = HTML.ul([], (h, tag) =>
        h(tag, { id: 'test' }));
      assert(dom.element.id === 'test');
      assert.deepStrictEqual(dom.children, []);
    });

    it('struct', function () {
      const dom = HTML.article({
        title: HTML.h1('title'),
        content: HTML.p(),
      });
      assert(dom.element.outerHTML === '<article><h1>title</h1><p></p></article>');
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.content.element === dom.element.lastChild);
    });

    it('struct empty', function () {
      const dom = HTML.div({}, {});
      assert.deepStrictEqual(dom.children, {});
    });

    it('struct children update', function () {
      const dom = HTML.article({
        title: HTML.h1('a'),
      });
      assert.doesNotThrow(() => dom.children = dom.children);
      assert.throws(() => dom.children = HTML.article({ title: HTML.h1('b') }).children);
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.element.textContent === 'a');
      assert(dom.children.title.children === 'a');
      dom.children = {
        title: HTML.h1('b'),
      };
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.element.textContent === 'b');
      assert(dom.children.title.children === 'b');
    });

    it('struct children partial update', function () {
      const dom = HTML.article({
        title: HTML.h1('a'),
        content: HTML.p(),
      });
      assert.doesNotThrow(() => dom.children.title = dom.children.title);
      assert.throws(() => dom.children.title = HTML.article({ title: HTML.h1('b') }).children.title);
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.element.textContent === 'a');
      assert(dom.children.title.children === 'a');
      dom.children.title = HTML.h1('b');
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.element.textContent === 'b');
      assert(dom.children.title.children === 'b');
      dom.children.title.children = 'c';
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.element.textContent === 'c');
      assert(dom.children.title.children === 'c');
      dom.children = {
        title: HTML.h1('d'),
      };
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.element.textContent === 'd');
      assert(dom.children.title.children === 'd');
      dom.children = {
        title: HTML.h1('e'),
        content: undefined,
      };
      assert(dom.children.content.element === dom.element.lastChild);
      assert(dom.element.outerHTML === '<article><h1>e</h1><p></p></article>');
    });

    it('struct with factory', function () {
      const dom = HTML.article({}, {}, (h, tag) =>
        h(tag, { id: 'test' }));
      assert(dom.element.id === 'test');
      assert.deepStrictEqual(dom.children, {});
    });

    it('attr', function () {
      (): void => HTML.div({}).children;
      assert.deepStrictEqual(HTML.div({}).children, undefined);
      const dom = HTML.div({ id: 'test', class: 'test' });
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert(dom.children === undefined);
    });

    it('attr with factory', function () {
      const dom = HTML.div({ id: 'test' }, (h, tag) =>
        h(tag, { id: 'id', class: 'test' }, 'test'));
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert(dom.children === undefined);
      assert(HTML.div({}, (h, tag) => h(tag, 'test')).element.textContent === 'test');
    });

    it('attr with text', function () {
      const dom = HTML.div({ id: 'test', class: 'test' }, '');
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert(dom.children === '');
    });

    it('attr with collection', function () {
      const dom = HTML.div({ id: 'test', class: 'test' }, []);
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert.deepStrictEqual(dom.children, []);
    });

    it('attr with struct', function () {
      const dom = HTML.div({ id: 'test', class: 'test' }, {});
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert.deepStrictEqual(dom.children, {});
    });

    it('attr with text and factory', function () {
      const dom = HTML.div({ id: 'test' }, '', (h, tag) =>
        h(tag, { id: 'id', class: 'test' }));
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert(dom.children === '');
    });

    it('attr with collection and factory', function () {
      const dom = HTML.div({ id: 'test' }, [], (h, tag) =>
        h(tag, { id: 'id', class: 'test' }));
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert.deepStrictEqual(dom.children, []);
    });

    it('attr with struct and factory', function () {
      const dom = HTML.div({ id: 'test' }, {}, (h, tag) =>
        h(tag, { id: 'id', class: 'test' }));
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert.deepStrictEqual(dom.children, {});
      assert.deepStrictEqual(HTML('div', undefined, {}, html => html('div', 'a')).children, {});
      assert.deepStrictEqual(HTML.div(undefined, {}, html => html('div', 'a')).children, {});
    });

    it('listen', function (done) {
      HTML.a({ onclick: ev => void assert(ev instanceof Event) ?? done() }).element.click();
    });

    it('sanitize', function () {
      const dom = HTML.div('<script>');
      assert(dom.element.innerHTML === '&lt;script&gt;');
      assert(dom.children === '<script>');
      dom.children = '<script>';
      assert(dom.element.innerHTML === '&lt;script&gt;');
      assert(dom.children === '<script>');
    });

    it('scope', function () {
      const template = [
        ':scope{}',
        ':scope:empty {}',
        ':scope[id] {}',
        ':scope#id {}',
        ':scope.class {}',
        ':scope div {}',
        ':scope>div {}',
        ':scope,:scope {}',
        ':scope{}:scope{}',
        ':scope/* */ {}',
        '/* */:scope {}',
        '  :scope  {}',
      ].join('\n');
      const id = 'id';
      const style = template.replace(/\:scope/g, `#${id}`);
      assert(HTML.div({ id }, [HTML.style(template)]).children[0].element.innerHTML === style);
      assert(HTML.div({ id }, { style: HTML.style(template) }).children.style.element.innerHTML === style);
      assert(HTML.div([HTML.style(':scope {}')]).element.className.match(/^rnd-\w+-\d+$/));
      assert(Shadow.div([HTML.style(':scope {}')]).element.outerHTML === '<div></div>');
      assert(Shadow.div([HTML.style(':scope {}')]).children[0].element.innerHTML === ':host {}');
      assert(Shadow.div([HTML.style('/* :scope */:scope/* :scope */{content:" :scope "}')]).children[0].element.innerHTML === '/* :scope */:host/* :scope */{content:" :scope "}');
      assert(HTML.div([HTML.style('<script>')]).children[0].element.children.length === 0);
      assert(HTML.div([HTML.style(':scope{}<script>')]).children[0].element.children.length === 0);
    });

    it('clear', function () {
      assert(HTML.p(() => HTML.p('a').element).element.innerHTML === 'a');
      assert(HTML.p(() => HTML.p('a').element).children === undefined);
      assert(HTML.p('', () => HTML.p('a').element).element.innerHTML === '');
      assert(HTML.p('', () => HTML.p('a').element).children === '');
      assert(HTML.p([], () => HTML.p('a').element).element.childNodes.length === 0);
      assert.deepStrictEqual(HTML.p([], () => HTML.p('a').element).children, []);
      assert(HTML.p({}, {}, () => HTML.p('a').element).element.childNodes.length === 0);
      assert.deepStrictEqual(HTML.p({}, {}, () => HTML.p('a').element).children, {});
    });

    it('fragment', function () {
      HTML.div([HTML.p(() => document.createDocumentFragment().appendChild(html('p')))]);
    });

    it('parameter combination', function () {
      Sequence.from([
        [{ id: 'id' }],
        [undefined, '', [], {}],
        [() => html('div')]] as const)
        .mapM(v => Sequence.from(v))
        .bind(v => Sequence.from(v).filterM(() => Sequence.from([false, true])))
        .extract()
        .forEach(params => {
          HTML.div(...params as any);
        });
    });

    it('extend', function () {
      window.customElements.define('custom-tag', class extends HTMLElement { });
      assert(Shadow('custom-tag').element.outerHTML === '<custom-tag></custom-tag>');
      assert(HTML('custom-tag').element.outerHTML === '<custom-tag></custom-tag>');
      assert(HTML.custom().element.outerHTML === '<custom></custom>');
    });

    it('swap', function () {
      const dom = HTML.article([HTML.p()]);
      const children = dom.children;
      assert.throws(() => HTML.article(children));
      dom.children = [HTML.p()];
      assert(HTML.article(children));
    });

    it('observe text', function () {
      const dom = HTML.span(
        {
          onmutate: ({ currentTarget: el }) =>
            el.textContent += el.textContent!,
        },
        'a');
      assert.deepStrictEqual({ ...dom.element }, {});
      assert(dom.element['onmutate'] === '');
      assert(dom.children === 'aa');
      dom.children = 'b';
      assert(dom.children === 'bb');
      dom.element['onmutate'] = null;
      assert(dom.element['onmutate'] === null);
    });

    it('observe collection', function () {
      const attrs: Attrs = {
        onconnect: ({ currentTarget: el }) =>
          el.textContent += el.textContent![0].toUpperCase(),
        ondisconnect: ({ currentTarget: el }) =>
          el.textContent += el.textContent![0].toLowerCase(),
      };
      const dom = HTML.ul([
        HTML.li(attrs, 'a'),
        HTML.li(attrs, 'b'),
      ]);
      assert(dom.element['onconnect'] === undefined);
      assert(dom.element['ondisconnect'] === undefined);
      assert.deepStrictEqual(
        dom.children.map(child => child.children),
        [
          'a',
          'b',
        ]);
      doc.children = [dom];
      assert.deepStrictEqual(
        dom.children.map(child => child.children),
        [
          'aA',
          'bB',
        ]);
      assert.deepStrictEqual(
        dom.children.map(v => v.element),
        [...dom.element.children]);
      dom.children = [
        dom.children[1],
        HTML.li(attrs, 'c'),
      ];
      assert.deepStrictEqual(
        dom.children.map(child => child.children),
        [
          'bB',
          'cC',
        ]);
      assert.deepStrictEqual(
        dom.children.map(v => v.element),
        [...dom.element.children]);
      doc.children = [];
      assert.deepStrictEqual(
        dom.children.map(child => child.children),
        [
          'bBb',
          'cCc',
        ]);
      assert.deepStrictEqual(
        dom.children.map(v => v.element),
        [...dom.element.children]);
    });

    it('observe record', function () {
      const attrs: Attrs = {
        onconnect: ({ currentTarget: el }) =>
          el.textContent += el.textContent![0].toUpperCase(),
        ondisconnect: ({ currentTarget: el }) =>
          el.textContent += el.textContent![0].toLowerCase(),
      };
      const dom = HTML.ul({
        a: HTML.li(attrs, 'a'),
        b: HTML.li(attrs, 'b'),
        c: HTML.li(attrs, 'c'),
        d: HTML.li(attrs, 'd'),
        e: HTML.li(attrs, 'e'),
      });
      assert.deepStrictEqual(
        Object.entries(dom.children).map(([k, v]) => [k, v.children]),
        [
          ['a', 'a'],
          ['b', 'b'],
          ['c', 'c'],
          ['d', 'd'],
          ['e', 'e'],
        ]);
      doc.children = [Shadow.section([dom])];
      assert.deepStrictEqual(
        Object.entries(dom.children).map(([k, v]) => [k, v.children]),
        [
          ['a', 'aA'],
          ['b', 'bB'],
          ['c', 'cC'],
          ['d', 'dD'],
          ['e', 'eE'],
        ]);
      assert.deepStrictEqual(
        [...Object.values(dom.children)].map(v => v.element),
        [...dom.element.children]);
      dom.children = {
        a: dom.children.a,
        b: dom.children.c,
        c: dom.children.b,
        d: HTML.li(attrs, 'f'),
        e: dom.children.e,
      };
      dom.children.e = HTML.li(attrs, 'g');
      assert.deepStrictEqual(
        Object.entries(dom.children).map(([k, v]) => [k, v.children]),
        [
          ['a', 'aA'],
          ['b', 'cC'],
          ['c', 'bB'],
          ['d', 'fF'],
          ['e', 'gG'],
        ]);
      assert.deepStrictEqual(
        [...Object.values(dom.children)].map(v => v.element),
        [...dom.element.children]);
      doc.children = [];
      assert.deepStrictEqual(
        Object.entries(dom.children).map(([k, v]) => [k, v.children]),
        [
          ['a', 'aAa'],
          ['b', 'cCc'],
          ['c', 'bBb'],
          ['d', 'fFf'],
          ['e', 'gGg'],
        ]);
      assert.deepStrictEqual(
        [...Object.values(dom.children)].map(v => v.element),
        [...dom.element.children]);
    });

    it('shadow', function () {
      assert(Shadow('section', [HTML.slot()]).element.outerHTML === '<section></section>');
      assert(Shadow.section([HTML.slot()]).element.outerHTML === '<section></section>');
      assert(Shadow.section([HTML.slot()]).element.shadowRoot!.innerHTML === '<slot></slot>');
      assert(Shadow.section([HTML.slot()]).children[0].element.outerHTML === '<slot></slot>');
      assert(Shadow.section([HTML.slot()], (h, t) => shadow(h(t), { mode: 'closed' }).host as HTMLElement).element.shadowRoot === null);
      assert(Shadow.section([HTML.slot()], (h, t) => shadow(h(t), { mode: 'closed' }).host as HTMLElement).children[0].element.outerHTML === '<slot></slot>');
      const dom = HTML.div([Shadow.section([HTML.slot('a')])]);
      assert(dom.element.outerHTML === '<div><section></section></div>');
      assert(dom.children[0].children[0].element.outerHTML === '<slot>a</slot>');
      dom.children[0].children[0].children = 'b';
      assert(dom.element.outerHTML === '<div><section></section></div>');
      assert(dom.element.firstElementChild!.shadowRoot!.innerHTML === '<slot>b</slot>');
    });

  });

  describe('usage', function () {
    it('component', function () {
      class Component implements El {
        private readonly dom = HTML.section({
          style: HTML.style(':scope { color: red; }'),
          content: HTML.ul([
            HTML.li('item'),
          ]),
        });
        public readonly tag = this.dom.tag;
        public readonly element = this.dom.element;
        public get children() {
          return this.dom.children.content.children;
        }
        public set children(children) {
          this.dom.children.content.children = children;
        }
      }

      (): El => new Component();
      // @ts-expect-error
      (): El<''> => new Component();
      // @ts-expect-error
      () => HTML.div().children = '';
      // @ts-expect-error
      () => HTML.div().children = [new Component()];
      // @ts-expect-error
      () => HTML.div().children = { a: new Component() };
      const dom = new Component();
      assert(dom.children[0].children === 'item');
      dom.children = [
        HTML.li('Item'),
      ];
      assert(dom.children[0].children === 'Item');
      assert(HTML.div([dom]));
    });

    it('component shadow', function () {
      class Component implements El {
        private readonly dom = Shadow.section({
          style: HTML.style(':scope { color: red; }'),
          content: HTML.ul([
            HTML.li('item'),
          ]),
        });
        public readonly tag = this.dom.tag;
        public readonly element = this.dom.element;
        public get children() {
          return this.dom.children.content.children;
        }
        public set children(children) {
          this.dom.children.content.children = children;
        }
      }

      const dom = new Component();
      assert(dom.children[0].children === 'item');
      dom.children = [
        HTML.li('Item'),
      ];
      assert(dom.children[0].children === 'Item');
      assert(HTML.div([dom]));
    });

    it('component coroutine', async function () {
      class Component extends Coroutine implements El {
        constructor() {
          super(async function* (this: Component) {
            assert(this.element);
            let count = 0;
            this.children = `${count}`;
            while (true) {
              this.element.isConnected || await new Promise<unknown>(resolve =>
                this.element.addEventListener('connect', resolve, { once: true }));
              this.children = `${++count}`;
              yield;
            }
          }, { trigger: 'element', interval: 100 });
        }
        private readonly dom = Shadow.section({ onconnect: '' }, {
          style: HTML.style(':scope { color: red; }'),
          content: HTML.p(''),
        });
        public readonly tag = this.dom.tag;
        public readonly element = this.dom.element;
        public get children() {
          return this.dom.children.content.children;
        }
        public set children(children) {
          this.dom.children.content.children = children;
        }
      }

      const dom = new Component();
      assert(dom.children === '0');
      doc.children = [dom];
      await 0;
      assert(dom.children === '1');
      await wait(110);
      assert(dom.children === '2');
      doc.children = [];
      await wait(110);
      assert(dom.children === '2');
      doc.children = [dom];
      await 0;
      assert(dom.children === '3');
      doc.children = [];
    });

    it('translate', function () {
      const translator = i18next.createInstance({
        lng: 'en',
        resources: {
          en: {
            translation: {
              'Greeting': 'Hello, {{name}}.',
            },
          },
        },
      });
      interface TransDataMap {
        'Greeting': { name: string; };
      }

      function data
        <K extends keyof TransDataMap>
        (data: TransDataMap[K])
        : El.Factory<HTMLElementTagNameMap, K> {
        return (html, tag, _, children) =>
          html(tag, {
            onmutate: ev =>
              void translator.init((err, t) =>
                ev.currentTarget.textContent = err
                  ? '{% Failed to initialize the translator. %}'
                  : t(children, data) ?? `{% Failed to translate "${children}". %}`),
          });
      }

      const el = HTML.span('Greeting', data({ name: 'world' }));
      assert(el.children === 'Hello, world.');
      assert(el.element.textContent === 'Hello, world.');
      // @ts-expect-error
      () => HTML.span('Greeting', data({}));
      // @ts-expect-error
      () => HTML.span('', data({ name: 'world' }));
      // @ts-expect-error
      () => HTML.span(data({ name: 'world' }));

      function intl
        <K extends keyof TransDataMap>
        (children: K, data: TransDataMap[K])
        : El.Factory<HTMLElementTagNameMap, El.Children.Void> {
        return (html, tag) => {
          const el = html(tag);
          translator.init((err, t) =>
            el.textContent = err
              ? '{% Failed to initialize the translator. %}'
              : t(children, data) ?? `{% Failed to translate "${children}". %}`);
          return el;
        };
      }

      assert(HTML.span(intl('Greeting', { name: 'world' })).children === undefined);
      assert(HTML.span(intl('Greeting', { name: 'world' })).element.textContent === 'Hello, world.');
      assert(HTML.span({}, intl('Greeting', { name: 'world' })).children === undefined);
      assert(HTML.span({}, intl('Greeting', { name: 'world' })).element.textContent === 'Hello, world.');
      // @ts-expect-error
      () => HTML.span(intl('Greeting', {}));
      // @ts-expect-error
      () => HTML.span(intl('', { name: 'world' }));
      // @ts-expect-error
      () => HTML.span('', intl('Greeting', { name: 'world' }));
    });

  });

});
