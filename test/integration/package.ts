import { API, Shadow, HTML, SVG, El, Attrs, Factory, shadow, html } from '../..';
import { Coroutine } from 'spica/coroutine';
import { Sequence } from 'spica/sequence';

declare global {
  interface ShadowHostElementTagNameMap {
    'custom-tag': HTMLElement;
  }
  interface HTMLElementTagNameMap {
    'custom': HTMLElement;
  }
}

declare const _: { shuffle<T>(as: T[]): T[]; };

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
      const dom = HTML.p(`a`);
      assert(dom.element.outerHTML === '<p>a</p>');
      assert(dom.children === 'a');
    });

    it('text children update', function () {
      const dom = HTML.p(`a`);
      // @ts-expect-error
      () => dom.children = undefined;
      dom.children = 'b';
      assert(dom.element.outerHTML === '<p>b</p>');
      assert(dom.children === 'b');
    });

    it('text with factory', function () {
      const dom = HTML.p(`a`, (h, tag) =>
        h(tag, { id: 'test' }));
      assert(dom.element.id === 'test');
      assert(dom.children === 'a');
    });

    it('collection', function () {
      const dom = HTML.ul([
        HTML.li(`1`),
        HTML.li(`2`)
      ]);
      assert(dom.element.outerHTML === '<ul><li>1</li><li>2</li></ul>');
      assert(dom.children.length === 2);
      assert(dom.children.every(({ element }, i) => element === dom.element.children[i]));
    });

    it('collection children update', function () {
      this.timeout(9 * 1e3);

      const dom = HTML.ul([
        HTML.li(`1`)
      ]);
      assert.doesNotThrow(() => dom.children = dom.children);
      assert.throws(() => dom.children = HTML.ul([HTML.li(`1`)]).children);
      dom.children = [
        HTML.li('2'),
        HTML.li('3')
      ];
      assert(dom.element.outerHTML === '<ul><li>2</li><li>3</li></ul>');
      assert(dom.children.length === 2);
      assert(dom.children.every(({ element }, i) => element === dom.element.children[i]));
      dom.children = [
        HTML.li('4')
      ];
      assert(dom.element.outerHTML === '<ul><li>4</li></ul>');
      assert(dom.children.length === 1);
      assert(dom.children.every(({ element }, i) => element === dom.element.children[i]));

      // Property test
      const el = HTML.ul([HTML.li('')]);
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
        HTML.li()
      ] as const);
      // @ts-expect-error
      () => dom.children[0] = dom.children[0];
      //() => dom.children[0] = HTML.li();
      //() => dom.children.push(HTML.li());
      //() => dom.children.pop();
      //() => dom.children.length = 0;
      // @ts-expect-error
      () => dom.children = [undefined];
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
        title: HTML.h1(`title`),
        content: HTML.p()
      });
      assert(dom.element.outerHTML === '<article><h1>title</h1><p></p></article>');
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.content.element === dom.element.lastChild);
    });

    it('struct empty', function () {
      const dom = HTML.div({});
      assert.deepStrictEqual(dom.children, {});
    });

    it('struct children update', function () {
      const dom = HTML.article({
        title: HTML.h1(`a`),
      });
      assert.doesNotThrow(() => dom.children = dom.children);
      assert.throws(() => dom.children = HTML.article({ title: HTML.h1(`b`) }).children);
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.element.textContent === 'a');
      assert(dom.children.title.children === 'a');
      dom.children = {
        title: HTML.h1(`b`)
      };
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.element.textContent === 'b');
      assert(dom.children.title.children === 'b');
    });

    it('struct children partial update', function () {
      const dom = HTML.article({
        title: HTML.h1(`a`),
        content: HTML.p()
      });
      assert.doesNotThrow(() => dom.children.title = dom.children.title);
      assert.throws(() => dom.children.title = HTML.article({ title: HTML.h1(`b`) }).children.title);
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.element.textContent === 'a');
      assert(dom.children.title.children === 'a');
      dom.children.title = HTML.h1(`b`);
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.element.textContent === 'b');
      assert(dom.children.title.children === 'b');
      dom.children.title.children = 'c';
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.element.textContent === 'c');
      assert(dom.children.title.children === 'c');
      dom.children = {
        title: HTML.h1(`d`),
      };
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.title.element.textContent === 'd');
      assert(dom.children.title.children === 'd');
      dom.children = {
        title: HTML.h1(`e`),
        content: undefined,
      };
      assert(dom.children.content.element === dom.element.lastChild);
      assert(dom.element.outerHTML === '<article><h1>e</h1><p></p></article>');
    });

    it('struct with factory', function () {
      const dom = HTML.article({}, (h, tag) =>
        h(tag, { id: 'test' }));
      assert(dom.element.id === 'test');
      assert.deepStrictEqual(dom.children, {});
    });

    it('attr', function () {
      const dom = HTML.div({ id: 'test', class: 'test' });
      assert(dom.element.id === 'test');
      assert(dom.element.getAttribute('class') === 'test');
      assert(dom.children === undefined);
    });

    it('attr with factory', function () {
      const dom = HTML.div({ id: 'test' }, (h, tag) =>
        h(tag, { id: 'id', class: 'test' }));
      assert(dom.element.id === 'test');
      assert(dom.element.className === 'test');
      assert(dom.children === undefined);
    });

    it('attr with text', function () {
      const dom = HTML.div({ id: 'test', class: 'test' }, '');
      assert(dom.element.id === 'test');
      assert(dom.element.getAttribute('class') === 'test');
      assert(dom.children === '');
    });

    it('attr with collection', function () {
      const dom = HTML.div({ id: 'test', class: 'test' }, []);
      assert(dom.element.id === 'test');
      assert(dom.element.getAttribute('class') === 'test');
      assert.deepStrictEqual(dom.children, []);
    });

    it('attr with struct', function () {
      const dom = HTML.div({ id: 'test', class: 'test' }, {});
      assert(dom.element.id === 'test');
      assert(dom.element.getAttribute('class') === 'test');
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
      assert(HTML.div([HTML.style(`<script>`)]).children[0].element.children.length === 0);
      assert(HTML.div([HTML.style(`:scope{}<script>`)]).children[0].element.children.length === 0);
    });

    it('clear', function () {
      assert(HTML.p(() => HTML.p('a').element).element.innerHTML === 'a');
      assert(HTML.p(() => HTML.p('a').element).children === undefined);
      assert(HTML.p('', () => HTML.p('a').element).element.innerHTML === '');
      assert(HTML.p('', () => HTML.p('a').element).children === '');
      assert(HTML.p([], () => HTML.p('a').element).element.childNodes.length === 0);
      assert.deepStrictEqual(HTML.p([], () => HTML.p('a').element).children, []);
      assert(HTML.p({}, () => HTML.p('a').element).element.childNodes.length === 0);
      assert.deepStrictEqual(HTML.p({}, () => HTML.p('a').element).children, {});
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
          onmutate: (ev, el = ev.target as HTMLElement) =>
            el.textContent += el.textContent!,
        },
        'a');
      assert(dom.children === 'aa');
      dom.children = 'b';
      assert(dom.children === 'bb');
    });

    it('observe collection', function () {
      const attrs: Attrs = {
        onconnect: (ev, el = ev.target as HTMLElement) =>
          el.textContent += el.textContent!.toUpperCase(),
        ondisconnect: (ev, el = ev.target as HTMLElement) =>
          el.textContent += el.textContent!,
      };
      const dom = HTML.ul([
        HTML.li(attrs, 'a'),
        HTML.li(attrs, 'b'),
      ]);
      assert.deepStrictEqual(
        dom.children.map(child => child.children),
        [
          'aA',
          'bB',
        ]);
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
    });

    it('observe record', function () {
      const attrs: Attrs = {
        onconnect: (ev, el = ev.target as HTMLElement) =>
          el.textContent += el.textContent![0].toUpperCase(),
        ondisconnect: (ev, el = ev.target as HTMLElement) =>
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
          ['a', 'aA'],
          ['b', 'bB'],
          ['c', 'cC'],
          ['d', 'dD'],
          ['e', 'eE'],
        ]);
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
    });

    it('shadow', function () {
      assert(Shadow('section', [HTML.p()]).element.outerHTML === '<section></section>');
      assert(Shadow.section([HTML.p()]).element.outerHTML === '<section></section>');
      assert(Shadow.section([HTML.p()]).element.shadowRoot instanceof ShadowRoot);
      assert(Shadow.section([HTML.p()]).element.shadowRoot!.innerHTML === '<p></p>');
      assert(Shadow.section([HTML.p()]).children[0].element.outerHTML === '<p></p>');
      assert(Shadow.section((h, t) => h(t, [html('p')])).element.shadowRoot!.innerHTML === '<p></p>');
      assert(Shadow.section((h, t) => shadow(h(t, [html('p')])).host as HTMLElement).element.shadowRoot!.innerHTML === '<p></p>');
      assert(Shadow.section((h, t) => shadow(h(t, [html('p')]), { mode: 'closed' }).host as HTMLElement).element.shadowRoot === null);
      assert(Shadow.section([HTML.p()], (h, t) => shadow(h(t), { mode: 'closed' }).host as HTMLElement).element.shadowRoot === null);
      assert(Shadow.section([HTML.p()], (h, t) => shadow(h(t), { mode: 'closed' }).host as HTMLElement).children[0].element.outerHTML === '<p></p>');
      const dom = HTML.div([Shadow.section([HTML.p('a')])]);
      assert(dom.element.outerHTML === '<div><section></section></div>');
      assert(dom.children[0].children[0].element.outerHTML === '<p>a</p>');
      dom.children[0].children[0].children = 'b';
      assert(dom.element.outerHTML === '<div><section></section></div>');
      assert(dom.element.firstElementChild!.shadowRoot!.innerHTML === '<p>b</p>');
    });

  });

  describe('usage', function () {
    it('component', function () {
      class Component implements El {
        private readonly dom = HTML.section({
          style: HTML.style(`:scope { color: red; }`),
          content: HTML.ul([
            HTML.li(`item`)
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
      (empty = HTML.section()): typeof empty => new Component();
      // @ts-expect-error
      (): El<''> => new Component();
      const dom = new Component();
      assert(dom.children[0].children === 'item');
      dom.children = [
        HTML.li('Item')
      ];
      assert(dom.children[0].children === 'Item');
      assert(HTML.div([dom]));
    });

    it('component shadow', function () {
      class Component implements El {
        private readonly dom = Shadow.section({
          style: HTML.style(`:scope { color: red; }`),
          content: HTML.ul([
            HTML.li(`item`)
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
        HTML.li('Item')
      ];
      assert(dom.children[0].children === 'Item');
      assert(HTML.div([dom]));
    });

    it('component coroutine', function () {
      class Component extends Coroutine implements El {
        constructor() {
          super(async function* (this: Component) {
            assert(this.element);
            assert(this.children);
            this.children = this.children.map(child => {
              child.children = child.children.toUpperCase();
              return child;
            });
            while (true) {
              yield;
            }
          }, { trigger: 'element', capacity: 0 });
          assert(this.children[0].children === 'ITEM');
        }
        private readonly dom = Shadow.section({
          style: HTML.style(`:scope { color: red; }`),
          content: HTML.ul([
            HTML.li(`item`)
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
      assert(dom.children[0].children === 'ITEM');
      dom.children = [
        HTML.li('item')
      ];
      assert(dom.children[0].children === 'item');
      assert(HTML.div([dom]));
    });

    it('translate', function () {
      const i18n = i18next.createInstance({
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
      const Trans = API<HTMLElementTagNameMap>(html);
      const bind = <K extends keyof TransDataMap>(data: TransDataMap[K]) =>
        <T extends keyof HTMLElementTagNameMap>(
          factory: Factory<HTMLElementTagNameMap>,
          tag: T,
          attrs: Attrs,
          children: K,
        ) =>
          factory(tag, void Object.assign<Attrs, Attrs>(attrs, {
            onmutate: ev =>
              void i18n.init((err, t) =>
                (ev.target as HTMLElement).textContent = err
                  ? '{% Failed to initialize the translator. %}'
                  : t(children, data) ?? `{% Failed to translate "${children}". %}`),
          }));

      const el = Trans.span('Greeting', bind({ name: 'world' }));
      assert(el.children === 'Hello, world.');
      assert(el.element.textContent === 'Hello, world.');
      // @ts-expect-error
      Trans.span('', bind({ name: 'world' }));
      // @ts-expect-error
      Trans.span('Greeting', bind({}));
    });

  });

});
