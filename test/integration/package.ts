import { Shadow, HTML, SVG, El, API, proxy, frag, shadow, html, define } from '../../index';
import { Sequence } from 'spica/sequence';
import { Coroutine } from 'spica/coroutine';

declare global {
  interface ShadowHostElementTagNameMap {
    'custom-tag': HTMLElement;
  }
  interface HTMLElementTagNameMap {
    'custom': HTMLElement;
  }
  interface SVGElementTagNameMap_ {
    'a': SVGAElement;
  }
}
window.customElements.define('custom-tag', class extends HTMLElement { });

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

      // property test
      const ss = Array(3).fill(0).map(() => HTML.li(``));
      void Sequence.zip(
        Sequence.cycle([[...Array(3).fill(0).map(() => HTML.li(``)), ...ss]]),
        Sequence.cycle([[...Array(3).fill(0).map(() => HTML.li(``)), ...ss]]))
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
      const dom = HTML.ul([
        HTML.li()
      ] as const);
      //assert.throws(() => dom.children[0] = dom.children[0]);
      //assert.throws(() => dom.children[0] = HTML.li());
      //assert.throws(() => dom.children.push(HTML.li()));
      //assert.throws(() => dom.children.pop());
      //assert.throws(() => dom.children.length = 0);
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
        content: HTML.p([HTML.a()])
      });
      assert(dom.element.outerHTML === '<article><h1>title</h1><p><a></a></p></article>');
      assert(dom.children.title.element === dom.element.firstChild);
      assert(dom.children.content.element === dom.element.lastChild);
    });

    it('struct empty', function () {
      const dom = HTML.div({});
      assert.deepStrictEqual(dom.children, {});
    });

    it('struct children update', function () {
      const dom = HTML.article({
        title: HTML.h1(`a`)
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
        title: HTML.h1(`a`)
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
    });

    it('listen', function (done) {
      HTML.a({ onclick: ev => void assert(ev instanceof Event) || done() }).element.click();
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
      const template = `$scope {}\n  $scope {}`;
      const result = template.replace(/\$scope/g, '#test');
      assert(HTML.div({ id: 'test' }, [HTML.style(template)]).children[0].element.innerHTML === result);
      assert(HTML.div({ id: 'test' }, { style: HTML.style(template) }).children.style.element.innerHTML === result);
      assert(HTML.div({ id: 'test' }, [HTML.style(`<script>`)]).children[0].element.children.length === 0);
      assert(HTML.div([HTML.style(template)]).element.className.startsWith('id-'));
      assert(HTML.div([HTML.style(template)]).children[0].element.innerHTML.match(/\.[\w\-]+\s/gm)!.length === 2);
      assert(Shadow.div([HTML.style(template)]).children[0].element.innerHTML === template.replace(/\$scope/g, ':host'));
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
      assert(Shadow('custom-tag').element.outerHTML === '<custom-tag></custom-tag>');
      assert(HTML.custom().element.outerHTML === '<custom></custom>');
      assert(SVG.a().element instanceof SVGAElement);
    });

    it('swap', function () {
      assert.throws(() => HTML.article(HTML.article([HTML.p()]).children));
      const el = HTML.article([HTML.p()]);
      const children = el.children;
      el.children = [HTML.p()];
      frag(children.map(el => el.element));
      assert(HTML.article(children));
    });

    it('observe text', function () {
      const el = HTML.span(
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
      const el = HTML.ul([
        HTML.li(listeners, 'a'),
        HTML.li(listeners, 'b'),
      ]);
      el.children = [
        el.children[1],
        HTML.li(listeners, 'c'),
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
      const el = HTML.ul({
        a: HTML.li(listeners, 'a'),
        b: HTML.li(listeners, 'b'),
        c: HTML.li(listeners, 'c'),
      });
      el.children = {
        a: el.children.a,
        b: el.children.c,
        c: HTML.li(listeners, 'd'),
      };
      assert.deepStrictEqual(
        Object.entries(el.children).map(([k, v]) => [k, v.children]),
        [
          ['a', 'A'],
          ['b', 'C'],
          ['c', 'D'],
        ]);
    });

    it('shadow', function () {
      assert(Shadow('section', [HTML.p()]).element.outerHTML === '<section></section>');
      assert(Shadow.section([HTML.p()]).element.outerHTML === '<section></section>');
      assert(Shadow.section([HTML.p()]).element.shadowRoot!.innerHTML === '<p></p>');
      assert(Shadow.section([HTML.p()]).children[0].element.outerHTML === '<p></p>');
      assert(Shadow.section((h, t) => h(t, [html('p')])).element.shadowRoot!.innerHTML === '<p></p>');
      assert(Shadow.section((h, t) => shadow(h(t, [html('p')])).host as HTMLElement).element.shadowRoot!.innerHTML === '<p></p>');
      assert(Shadow.section((h, t) => shadow(h(t, [html('p')]), { mode: 'closed' }).host as HTMLElement).element.shadowRoot === null);
      assert(Shadow.section([HTML.p()], (h, t) => shadow(h(t), { mode: 'closed' }).host as HTMLElement).element.shadowRoot === null);
      assert(Shadow.section([HTML.p()], (h, t) => shadow(h(t), { mode: 'closed' }).host as HTMLElement).children[0].element.outerHTML === '<p></p>');
    });

  });

  describe('usage', function () {
    it('component', function () {
      class Component implements El {
        private readonly dom = HTML.section({
          style: HTML.style(`$scope ul { width: 100px; }`),
          content: HTML.ul([
            HTML.li(`item`)
          ] as const),
        });
        public readonly element = this.dom.element;
        public get children() {
          return this.dom.children.content.children;
        }
        public set children(children) {
          this.dom.children.content.children = children;
        }
      }

      const comp = new Component();
      assert(HTML.div([comp]));
      assert(comp.children[0].children === 'item');
      comp.children = [
        HTML.li('Item')
      ];
      assert(comp.children[0].children === 'Item');
    });

    it('component shadow', function () {
      class Component implements El {
        private readonly dom = Shadow.section({
          style: HTML.style(`ul { width: 100px; }`),
          content: HTML.ul([
            HTML.li(`item`)
          ] as const),
        });
        public readonly element = this.dom.element;
        public get children() {
          return this.dom.children.content.children;
        }
        public set children(children) {
          this.dom.children.content.children = children;
        }
      }

      const comp = new Component();
      assert(HTML.div([comp]));
      assert(comp.children[0].children === 'item');
      comp.children = [
        HTML.li('Item')
      ];
      assert(comp.children[0].children === 'Item');
    });

    it('component coroutine', function () {
      class Component extends Coroutine<void> implements El {
        constructor() {
          super(function* (this: Component) {
            while (this.element.isConnected) {
              yield;
            }
          }, { size: Infinity });
        }
        private readonly dom = Shadow.section({
          style: HTML.style(`ul { width: 100px; }`),
          content: HTML.ul([
            HTML.li(`item`)
          ] as const),
        });
        public readonly element = this.dom.element;
        public get children() {
          return this.dom.children.content.children;
        }
        public set children(children) {
          this.dom.children.content.children = children;
        }
      }

      const comp = new Component();
      assert(HTML.div([comp]));
      assert(comp.children[0].children === 'item');
      comp.children = [
        HTML.li('Item')
      ];
      assert(comp.children[0].children === 'Item');
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
      const trans: API<HTMLElementTagNameMap> = API((tag: keyof HTMLElementTagNameMap, ...args: any[]) =>
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
